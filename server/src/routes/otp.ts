import * as express from "express";
import * as auth from "../controllers/auth/flash";
import * as otpController from "../controllers/auth/otpController";

const router = express.Router();

router
    .route("/")
    .get(auth.isLoggedIn, otpController.getOtp)
    .post(auth.isLoggedIn, otpController.sendOtp);

router
    .route("/check")
    .get(auth.isLoggedIn, otpController.getOtpCheck)
    .post(auth.isLoggedIn, otpController.postOtpCheck);

router
    .route("/reset/:token")
    .get(otpController.getResetToken)
    .post(otpController.postResetToken);

export default router;