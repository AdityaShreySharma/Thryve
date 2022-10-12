import Food from "./../../models/food";
import Exercise from "../../models/exercise";


export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next()

    req.flash("error", "You need to be logged in to do that")
    return res.redirect("/")
}

export const isVerified = (req, res, next) => {
    if (req.user.verified) return next()

    req.flash("error", "Verification of account is pending")
    return res.redirect("/otp")
}

export const isAdmin = (req, res, next) => {
    if (req.user.admin) return next()

    req.flash("error", "You don't have admin privileges")
    return res.redirect("back")
}

export const isFoodAuthorized = (req, res, next) => {
    if (req.user.admin) return next()

    const {fdid: foodId} = req.params

    Food.findById(foodId, function (err, food) {
        if (err) {
            req.flash("error", "Something went wrong")
            return res.redirect("/diet")
        }
        if (!food.verified && food.addedBy.equals(req.user._id))
            return next()

        req.flash("error", "Something went wrong")
        return res.redirect("/diet")
    })
}

export const isExerciseAuthorized = (req, res, next) => {
    if (req.user.admin) return next()

    const {exid: exerciseId} = req.params

    Exercise.findById(exerciseId, function (err, exercise) {
        if (err) {
            req.flash("error", "Something went wrong");
            return res.redirect("/workout");
        }
        if (!exercise.verified && exercise.addedBy.equals(req.user._id))
            return next()

        req.flash("error", "Something went wrong");
        return res.redirect("/workout");
    })
}