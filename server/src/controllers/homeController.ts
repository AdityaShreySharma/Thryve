import User from "../models/user";

export function landingPage(request, response) {
    response.render("landing");
}

export async function home(request, response) {
    let userId = request.user._id;
    await User
        .findById(userId)
        .populate({ path: "diet.food" })
        .populate({ path: "workout.exercise" })
        .exec((err, user) => {
            if (err) console.log(err);
            else
                response.render("home", { user: user });
        });

}

export async function food(request, response) {
    let userId = request.user._id;
    const user = await User
        .findById(userId)
        .populate({ path: "diet.food" })

    for (let i = 0; i < user.diet.length; ++i) {
        let flag = false;
        for (let key in request.body.tick) {
            if (user.diet[i].food._id === request.body.tick[key]) {
                user.diet[i].check = true;
                flag = true;
            }
        }
        if (!flag) user.diet[i].check = false;
    }
    await user.save();
    response.redirect("/home");
}

export async function exercises(request, response) {
    let userId = request.user._id;
    const user = await User
        .findById(userId)
        .populate({ path: "workout.exercise" })

    for (let i = 0; i < user.workout.length; ++i) {
        let flag = false;
        for (let key in request.body.tick) {
            if (user.workout[i].exercise._id === request.body.tick[key]) {
                user.workout[i].check = true;
                flag = true;
            }
        }
        if (!flag) user.workout[i].check = false;
    }
    await user.save();
    response.redirect("/home");
}