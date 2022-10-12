import * as express from "express";
import * as auth from "../controllers/auth/flash";
import * as homeController from "../controllers/homeController";

const router = express.Router();

router
    .route("/")
    .get(homeController.landingPage);

router
    .route("/home")
    .get(auth.isLoggedIn, auth.isVerified, homeController.home);

router
    .route("/home/foods")
    .put(auth.isLoggedIn, auth.isVerified, homeController.food);

router
    .route("/home/exercises")
    .put(auth.isLoggedIn, auth.isVerified, homeController.exercises);

export default router;