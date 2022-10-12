import * as express from "express";
import * as auth from "./../controllers/auth/flash";
import * as historyController from "./../controllers/historyController";

const router = express.Router();

router
    .route("/weight")
    .post(auth.isLoggedIn, auth.isVerified, historyController.postWeight)
    .delete(auth.isLoggedIn, auth.isVerified, historyController.deleteWeight);

router
    .route("/bp")
    .post(auth.isLoggedIn, auth.isVerified, historyController.postBloodPressure)
    .delete(auth.isLoggedIn, auth.isVerified, historyController.deleteBloodPressure);

router
    .route("/sugar")
    .post(auth.isLoggedIn, auth.isVerified, historyController.postSugar)
    .delete(auth.isLoggedIn, auth.isVerified, historyController.deleteSugar);

export default router;