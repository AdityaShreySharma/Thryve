import * as express from "express";
import * as auth from "../controllers/auth/flash";
import * as workoutController from "../controllers/workoutController";

const router = express.Router();

router
    .route("/")
    .get(auth.isLoggedIn, auth.isVerified, workoutController.getWorkout)
    .post(auth.isLoggedIn, auth.isVerified, workoutController.addNewWorkout)
    .put(auth.isLoggedIn, auth.isVerified, workoutController.editWorkout)
    .delete(auth.isLoggedIn, auth.isVerified, workoutController.deleteWorkout);

router
    .route("/exercise")
    .post(auth.isLoggedIn, auth.isVerified, workoutController.createNewExercise)

router
    .route("/exercise/new")
    .get(auth.isLoggedIn, auth.isVerified, workoutController.getNewExercise);

router
    .route("/exercise/:exid")
    .get(auth.isLoggedIn, auth.isVerified, workoutController.getExercise)
    .put(auth.isLoggedIn, auth.isVerified, auth.isExerciseAuthorized, workoutController.updateExercise)
    .delete(auth.isLoggedIn, auth.isVerified, auth.isExerciseAuthorized, workoutController.deleteExercise)

router
    .route("/exercise/:exid/verify")
    .post(auth.isLoggedIn, auth.isVerified, auth.isAdmin, workoutController.verifyExercise)

router
    .route("/exercise/:exid/edit")
    .get(auth.isLoggedIn, auth.isVerified, auth.isExerciseAuthorized, workoutController.editExercise)

export default router;