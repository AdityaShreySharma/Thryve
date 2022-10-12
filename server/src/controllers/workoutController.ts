import Exercise from "../models/exercise";
import User from "../models/user";

export async function getWorkout (req, res) {
    const { _id: userId } = req.user;
    const exercises = await Exercise.find({});
    const user = await User.findById(userId).populate({ path: "workout.exercise" });

    return res.render("workout/index", {
        user: user,
        exercises: exercises
    });
}

export async function addNewWorkout (req, res) {
    const { _id: userId } = req.user;
    const { _id: exerciseId } = req.body.exercise;

    const user = await User.findById(userId);

    const workoutAlreadyExists = user.workout.some(workout => workout.exercise === exerciseId);

    if (workoutAlreadyExists) {
        req.flash("error", "Workout already present in checkout list.");
        return res.redirect("/workout");
    }

    const exercise = await Exercise.findById(exerciseId);
    exercise.activeUsers = exercise.activeUsers + 1;
    await exercise.save();

    const newWorkout = {
        exercise: exercise,
        duration: req.body.duration
    };

    user.workout.push(newWorkout);
    await user.save();
    return res.status(200).redirect("/workout");
}

export async function deleteWorkout (req, res) {
    const { _id: userId } = req.user;
    const { _id: exerciseId } = req.body.exercise;

    const user = await User.findById(userId);
    const idx = user.workout.findIndex(workout => workout.exercise === exerciseId);

    if (idx === -1) return res.status(404).redirect("/workout");

    user.workout.splice(idx, 1);
    await user.save();

    const exercise = await Exercise.findById(exerciseId);
    exercise.activeUsers = exercise.activeUsers - 1;
    await exercise.save();
    return res.redirect("/workout");
}

export async function editWorkout (req, res) {
    const { _id: userId } = req.user;
    const { _id: exerciseId } = req.body.exercise;

    const user = await User.findById(userId);
    const idx = user.workout.findIndex(workout => workout.exercise === exerciseId);

    user.workout[idx].duration = req.body.duration;
    await user.save();
    res.redirect("/workout");
}

export async function getNewExercise (req, res) {
    return res.status(200).render("workout/new");
}

export async function createNewExercise (req, res) {
    const { exercise } = req.body;
    exercise.name = exercise.name.toLowerCase();
    exercise.tag = exercise.tag.toLowerCase();
    exercise.addedBy = req.user;

    try {
        await Exercise.create(exercise);
        req.flash("success", "Successfully Submitted.");
    } catch (err) {
        req.flash("error", "Something went wrong");
        return res.status(500).redirect("/workout");
    } finally {
        res.redirect("/workout");
    }
}

export async function getExercise (req, res) {
    let { exid: exerciseId } = req.params;
    const exercise = await Exercise.findById(exerciseId);
    res.render("workout/show", { exercise: exercise });
}

export async function verifyExercise (req, res) {
    const { exid: exerciseId } = req.params;
    const exercise = Exercise.findById(exerciseId);

    exercise.verified = true;
    exercise.verifiedBy = req.user;
    await exercise.save();
    res.redirect("/workout");
}

export async function updateExercise (req, res) {
    const { exid: exerciseId } = req.params;
    // TODO: extract body, dangerous to store directly.
    const { exercise } = req.body;

    try {
        Exercise.findByIdAndUpdate(exerciseId, exercise);
        req.flash("success", "Update Successful");
        res.status(200).redirect("/workout/exercise/" + exerciseId);
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.status(500).redirect("/workout");
    }
}

export async function editExercise (req, res) {
    const { exid: exid } = req.params;
    const exercise = await Exercise.findById(exid);
    res.render("workout/edit", { exercise: exercise });
}

export async function deleteExercise (req, res) {
    const { exid: exerciseId } = req.params;
    // delete exercise
    try {
        await Exercise.findByIdAndRemove(exerciseId);
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/workout");
    }
    req.flash("success", "Exercise deleted");

    const users = await User.find({});
    for (let user of users) {
        const idx = user.workout.findIndex(workout => workout.food === exerciseId);
        if (idx === -1) continue;

        user.workout.splice(idx, 1);
        await user.save();
    }
    res.redirect("/workout");
}