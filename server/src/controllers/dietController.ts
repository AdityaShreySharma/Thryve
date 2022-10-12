import { Request, Response, NextFunction } from "express";

import Food from "./../models/food";
import User from "./../models/user";

export async function getDiet (req: Request, res: Response) {
    const categories = await Food.distinct("categoryTag");
    let
        { _id: userId} = req.user,
        nameQuery,
        categoryQuery = [],
        proteinQuery,
        fatQuery,
        carbohydratesQuery,
        perPage = 6,
        pageQuery = parseInt(req.query.page),
        pageNumber = pageQuery ? pageQuery : 1;

    //search query
    if (!req.query.search)
        nameQuery = new RegExp(AnyExp(""), "gi");
    else
        nameQuery = new RegExp(StrCmpExp(req.query.search), "gi");

    //category query
    if (req.query.tags)
        for (let key in req.query.tags)
            categoryQuery.push(new RegExp(StrCmpExp(req.query.tags[key]), "gi"));

    if (categoryQuery.length === 0)
        categoryQuery.push(new RegExp(AnyExp(""), "gi"));

    //nutrients query
    if (req.query.proteinTag)
        proteinQuery = new RegExp(StrCmpExp(req.query.proteinTag), "gi");
    else
        proteinQuery = new RegExp(AnyExp(""), "gi");

    if (req.query.fatTag)
        fatQuery = new RegExp(StrCmpExp(req.query.fatTag), "gi");
    else
        fatQuery = new RegExp(AnyExp(""), "gi");


    if (req.query.carbohydratesTag)
        carbohydratesQuery = new RegExp(StrCmpExp(req.query.carbohydratesTag), "gi");
    else
        carbohydratesQuery = new RegExp(AnyExp(""), "gi");


    const foods = await Food.find({
        name: nameQuery,
        categoryTag: { $in: categoryQuery },
        proteinTag: proteinQuery,
        fatTag: fatQuery,
        carbohydratesTag: carbohydratesQuery
    })
        .skip(perPage * pageNumber - perPage)
        .limit(perPage);

    const foodCount = await Food
        .count({
            name: nameQuery,
            categoryTag: { $in: categoryQuery },
            proteinTag: proteinQuery,
            fatTag: fatQuery,
            carbohydratesTag: carbohydratesQuery
        });

    const user = await User
        .findById(userId)
        .populate({ path: "diet.food" });

    const { search, tags, proteinTag, fatTag, carbohydratesTag } = req.query;

    return res.render("diet/index", {
        user: user,
        foods: foods,
        categories: categories,
        current: pageNumber,
        pages: Math.ceil(foodCount / perPage),
        search: search,
        tags: tags,
        proteinTag: proteinTag,
        fatTag: fatTag,
        carbohydratesTag: carbohydratesTag
    });
}

export async function addDiet (req, res) {
    let userId = req.user._id;
    let foodId = req.body.food._id;
    const user = await User.findById(userId);

    const foodAlreadyExists = user.diet.some(diet => diet.food === foodId);

    if (foodAlreadyExists) {
        req.flash("error", "Already present in Checkout List");
        return res.redirect("/diet");
    }

    const food = await Food.findById(foodId);
    food.activeUsers = food.activeUsers + 1;
    await food.save();

    const newFood = {
        food: food,
        quantity: req.body.quantity
    };
    user.diet.push(newFood);
    await user.save();
    return res.redirect("/diet");
}

export async function editDiet (req, res) {
    const userId = req.user._id;
    const foodId = req.body.foodInDiet._id;

    const user: any = await User.findById(userId);

    const foodIndex: number = user.diet.findIndex(diet => diet.food === foodId);

    if (foodIndex === -1) return res.redirect("diet");

    user.diet[foodIndex].quantity = req.body.quantity;
    await user.save();
    return res.redirect("/diet");
}

export async function removeDiet (req: Request, res) {
    const userId = req.user._id;
    const foodId = req.body.foodInDiet._id;
    const user = await User.findById(userId);

    const foodIndex = user.diet.findIndex(diet => diet.food === foodId);

    if (foodIndex === -1)
        return res.redirect("/diet");

    user.diet.splice(foodIndex, 1);
    await user.save();

    const food = await Food.findById(foodId);

    food.activeUsers = food.activeUsers - 1;
    await food.save();
    return res.redirect("/diet");
}

export async function getNewFood (req, res) {
    const foodCategories = await Food.distinct("categoryTag");
    return res.render("diet/new", { categories: foodCategories });
}

export async function createNewFood (req, res) {
    const
        { food } = req.body,
        addedBy = req.user;

    if (!addedBy) {
        req.flash("error", "No user specified");
        return res.redirect("/diet");
    }

    const newFood = createNewFoodItem(food, addedBy);

    try {
        await Food.create(newFood);
        req.flash("success", "Successfully Submitted.");
        return res.redirect("/diet");
    } catch (err) {
        req.flash("error", "An error occurred: " + err);
        return res.redirect("/diet");
    }

}

export async function verifyFood (req, res) {
    const { fdid: foodId } = req.params;
    const food = await Food.findById(foodId);

    if (!food) throw new Error("Food not found");

    food.verified = true;
    food.verifiedBy = req.user;
    await food.save();
    return res.redirect("/diet");
}

export async function getFoodEditor (req, res) {
    const { fdid: foodId } = req.params;
    const food = await Food.findById(foodId);

    if (!food) throw new Error('Food not found');
    return res.render("diet/edit", { food: food });
}

export async function updateFood (req, res) {
    const { fdid: foodId } = req.params;
    try {
        await Food.findByIdAndUpdate(foodId, req.body.food);
        req.flash("success", "Update Successful");
    } catch (err) {
        req.flash("error", "Something went wrong");
    } finally {
        res.redirect("/diet");
    }
}

export async function deleteFood (req, res) {
    const { fdid: foodId } = req.params;
    await Food.findByIdAndRemove(foodId);
    req.flash("success", "Food deleted");

    const users = await User.find({});
    for (let user of users) {
        const currentUser = await User.findById(user._id);
        const idx = currentUser.diet.findIndex(diet => diet.food === foodId);

        if (idx === -1) continue;
        currentUser.diet.splice(idx, 1);
        await currentUser.save();
    }
    return res.redirect("/diet");
}

function createNewFoodItem (food, addedBy) {
    const { energy, nutrients } = food;

    energy.unit = energy.unit.toLowerCase();
    nutrients.protein.unit = nutrients.protein.unit.toLowerCase();
    nutrients.fat.unit = nutrients.fat.unit.toLowerCase();
    nutrients.carbohydrates.unit = nutrients.carbohydrates.unit.toLowerCase();

    return {
        ...food,
        name: food.name.toLowerCase(),
        categoryTag: food.categoryTag.toLowerCase(),
        proteinTag: food.proteinTag.toLowerCase(),
        fatTag: food.fatTag.toLowerCase(),
        carbohydratesTag: food.carbohydratesTag.toLowerCase(),
        energy: energy,
        nutrients: nutrients,
        addedBy: addedBy
    };
}

// TODO: Remove redundant function

function findFoodIndex (diet, foodId) {
    if (typeof diet === "undefined" || diet.length === 0) return -1;
    let foodIndex = -1;
    diet.find((userDiet, index) => {
        foodIndex = userDiet.food === foodId ? index : -1;
    });
    return foodIndex;
}

function StrCmpExp (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function AnyExp (text) {
    return text.replace(text, ".*");
}