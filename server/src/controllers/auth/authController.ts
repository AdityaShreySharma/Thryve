import User from "./../../models/user";

import passport from "passport";
import * as async from "async";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";

export const register = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email
    });

    const { password, passwordCheck } = req.body;
    const { isValidPassword, errorMessage } = validatePassword(password, passwordCheck);

    if (!isValidPassword) {
        req.flash("error", errorMessage);
        return res.redirect("/");
    }

    User.register(newUser, password, (err) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/");
        }

        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Complete the verification");
            return res.redirect("/otp");
        });
    });
};

export const login = (req, res) => {
    return res.redirect("/home");
};

export const logout = (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out");
    return res.status(200).redirect("/");
};

export const getPasswordReset = (req, res) => {
    return res.render("mailer");
};

export function postNewPassword(req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                let token = buf.toString("hex");
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash("error", "No account with that email address exists.");
                    return res.redirect("/auth/reset/password");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
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
                subject: "Password Reset",
                text:
                    "You are receiving this because you have requested the " +
                    "reset of the password for your account.\n\n" +
                    "Please click on the following link to complete the process:\n\n" +
                    "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                    "If you did not request this, please ignore this email " +
                    "and your password will remain unchanged.\n"
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log("mail sent");
                req.flash(
                    "success",
                    "An e-mail has been sent to "
                    + user.email
                    + " with further instructions."
                );
                done(err, "done");
            });
        }
    ],
        function (err) {
            if (err) return next(err);
            return res.redirect("back");
        });
}

function validatePassword(password, passwordCheck) {
    const result = {
        isValidPassword: false,
        errorMessage: ""
    };

    if (typeof password === "undefined" || password.length === 0)
        return { ...result, errorMessage: "empty password" };

    if (password !== passwordCheck)
        return { ...result, errorMessage: "invalid credentials" };

    if (password.length < 8)
        return { ...result, errorMessage: "Password should have minimum 8 characters." };

    return {
        ...result,
        isValidPassword: true
    };
}