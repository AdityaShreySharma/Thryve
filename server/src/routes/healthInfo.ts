import * as express from "express";
import * as auth from "../controllers/auth/flash";
import * as healthInfoController from "../controllers/healthInfoController";

const router = express.Router();

router
    .route("/")
    .get(auth.isLoggedIn, auth.isVerified, healthInfoController.getHealthInfo);

router
    .route("/weight")
    .get(auth.isLoggedIn, auth.isVerified, healthInfoController.getWeight);

router
    .route("/targetweight")
    .get(auth.isLoggedIn, auth.isVerified, healthInfoController.updateTargetWeight);

router
    .route("/bp")
    .get(auth.isLoggedIn, auth.isVerified, healthInfoController.updateBloodPressure);

router
    .route("/sugar")
    .get(auth.isLoggedIn, auth.isVerified, healthInfoController.updateSugar);

export default router;