import * as express from "express";
import passport from "passport";

import * as auth from "../controllers/auth/flash";
import * as authController from "../controllers/auth/authController";
import * as adminController from "../controllers/auth/adminController";

const router = express.Router();

const passportAuth = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true
});

router
    .route("/register")
    .post(authController.register);

router
    .route("/login")
    .post(passportAuth, authController.login);

router
    .route("/logout")
    .get(auth.isLoggedIn, auth.isVerified, authController.logout);

router
    .route("/reset/password")
    .get(authController.getPasswordReset)
    .post(authController.postNewPassword);

router
    .route("/admin")
    .get(auth.isLoggedIn, auth.isVerified, adminController.getAdmin)
    .post(auth.isLoggedIn, auth.isVerified, adminController.postAdmin);

export default router;