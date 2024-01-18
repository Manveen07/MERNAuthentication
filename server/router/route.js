import { Router } from "express";
import * as controller from "../controller/appController.js";
import Auth, { localvariable } from "../middleware/auth.js";
import { registerMail } from "../controller/mailer.js";
const router = Router();

router.route("/register").post(controller.register); // register user

router.route("/registerMail").post(registerMail); //send mail

router.route("/authenticate").post(controller.verifyuser, (req, res) => {
  res.end();
}); //authenticate user
router.route("/login").post(controller.verifyuser, controller.login); //login route

// Get routes
router.route("/user/:username").get(controller.getUser); //user with username
router
  .route("/generateOTP")
  .get(controller.verifyuser, localvariable, controller.generateotp); //generate randon otp
router.route("/verifyotp").get(controller.verifyuser, controller.verifyOTP); //verify randon otp
router.route("/createResetSession").get(controller.createResetSession); //reset all variables

// Put routes
router.route("/updateuser").put(Auth, controller.updateUser); //update user
router
  .route("/resetPassword")
  .put(controller.verifyuser, controller.resetPassword); //reset password

export default router;
