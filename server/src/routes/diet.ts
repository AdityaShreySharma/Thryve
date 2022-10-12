import * as express from "express";
import * as auth from "../controllers/auth/flash";
import * as dietController from "../controllers/dietController";

const router = express.Router();

router
    .route("/")
    .get(auth.isLoggedIn, auth.isVerified, dietController.getDiet)
    .post(auth.isLoggedIn, auth.isVerified, dietController.addDiet)
    .put(auth.isLoggedIn, auth.isVerified, dietController.editDiet)
    .delete(auth.isLoggedIn, auth.isVerified, dietController.removeDiet);

router
    .route("/food/new")
    .get(auth.isLoggedIn, auth.isVerified, dietController.getNewFood);
router
    .route("/food")
    .post(auth.isLoggedIn, auth.isVerified, dietController.createNewFood);

router
    .route("/food/:fdid")
    .put(auth.isLoggedIn, auth.isVerified, auth.isFoodAuthorized, dietController.updateFood)
    .delete(auth.isLoggedIn, auth.isVerified, auth.isFoodAuthorized, dietController.deleteFood);

router
    .route("/food/:fdid/verify")
    .post(auth.isLoggedIn, auth.isVerified, dietController.verifyFood);
router
    .route("/food/:fdid/edit")
    .get(auth.isLoggedIn, auth.isVerified, auth.isFoodAuthorized, dietController.getFoodEditor);

export default router;