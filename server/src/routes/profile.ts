import * as express from "express";
import * as auth from "../controllers/auth/flash";
import * as profileController from "../controllers/profileController";

const router = express.Router();

router
    .route("/")
    .get(auth.isLoggedIn, auth.isVerified, profileController.getProfile)
    .post(auth.isLoggedIn, auth.isVerified, profileController.newProfile)
    .put(auth.isLoggedIn, auth.isVerified, profileController.editProfile)
    .delete(auth.isLoggedIn, auth.isVerified, profileController.deleteProfile);

router
    .route("/new")
    .get(auth.isLoggedIn, auth.isVerified, profileController.newProfilePage);

router
    .route("/edit")
    .get(auth.isLoggedIn, auth.isVerified, profileController.editProfilePage);

export default router;