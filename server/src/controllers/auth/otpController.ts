import User from "./../../models/user";
import async from "async";
import * as nodemailer from "nodemailer";

export const getOtp = (req, res) => res.render("mailerOtp");

export async function sendOtp (req, res) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await User.findOne({ email: req.user.email });

    user.otp = otp;
    user.otpExpires = Date.now() + 3600000;
    await user.save();

    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const mailOptions = {
        to: req.user.email,
        from: process.env.NODEMAILER_USER,
        subject: "Verification",
        text: "Thank you for registering.\n" +
            "Please complete the verification process.\n\n" +
            "OTP: " + otp
    };

    await smtpTransport.sendMail(mailOptions, () => {
        req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
        return res.redirect("/otp/check");
    });
}

export const getOtpCheck = (req, res) => res.render("check_otp");

export async function postOtpCheck (req, res) {
    const user = await User.findOne({
        email: req.user.email,
        otpExpires: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash("error", "OTP invalid or expired.");
        return res.redirect("/otp");
    }

    if (user.otp !== req.body.otp) {
        user.otp = undefined;
        user.otpExpires = undefined;
        req.flash("error", "OTP invalid");
        return res.redirect("/otp");
    }
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    req.flash("success", "Verification completed. Please complete your profile.");
    return res.redirect("/profile/new");
}

export async function getResetToken (req, res) {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash("error", "Password reset token is invalid or expired.");
        return res.redirect("back");
    }

    return res.render("reset", { token: token });
}

export function postResetToken (req, res) {
    async.waterfall([
            function (done) {
                User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: { $gt: Date.now() }
                }, function (err, user) {
                    if (!user) {
                        req.flash("error", "Password reset token is invalid or has expired.");
                        return res.redirect("back");
                    }
                    if (req.body.password === req.body.confirm) {
                        user.setPassword(req.body.password, function (err) {
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;

                            user.save(function (err) {
                                req.logIn(user, function (err) {
                                    done(err, user);
                                });
                            });
                        });
                    } else {
                        req.flash("error", "Passwords do not match.");
                        return res.redirect("back");
                    }
                });
            },
            function (user, done) {
                let smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASS
                    }
                });
                let mailOptions = {
                    to: user.email,
                    from: process.env.NODEMAILER_USER,
                    subject: "Your password has been changed",
                    text: "Hello,\n\n" +
                        "This is a confirmation that the password for" +
                        " your account " + user.email + " has just been changed.\n"
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash("success", "Success! Your password has been changed.");
                    done(err);
                }).catch(e => {
                    throw new Error(e.message);
                });
            }
        ],
        function (err) {
            res.redirect("/home");
        });
}
