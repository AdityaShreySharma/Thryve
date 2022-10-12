import express from "express";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressSanitizer from "express-sanitizer";
import session from "express-session";
import flash from "connect-flash";
import LocalStrategy from "passport-local";
import methodOverride from "method-override";
import morgan from "morgan";

const app = express().disable("x-powered-by");
// const __dirname = path.resolve();
import User from "./models/user.js";
import Food from "./models/food.js";
import Exercise from "./models/exercise.js";

import workoutRoute from "./routes/workout.js";
import homeRoute from "./routes/home.js";
import profileRoute from "./routes/profile.js";
import historyRoute from "./routes/history.js";
import dietRoute from "./routes/diet.js";
import healthInfoRoute from "./routes/healthInfo.js";
import authRoute from "./routes/auth.js";
import otpRoute from "./routes/otp.js";

// ENVIRONMENT SETUP
const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

mongoose.connect("mongodb://localhost/thryve3", mongoConfig)
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        throw new Error(err);
    });

const views_path = path.join(__dirname + "/views");
const public_path = path.join(__dirname + "/public");

app.set("view engine", "ejs");
app.set("views", views_path);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(expressSanitizer());
app.use(express.static(public_path));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = import("moment");

app.use(session({
    secret: "This is the Authentication Key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

import dotenv from "dotenv";

dotenv.config();

//  MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/");
}

function isVerified(req, res, next) {
    if (req.user.verified) {
        return next();
    }
    req.flash("error", "Verification of account is pending");
    res.redirect("/otp");
}

app.use("/", homeRoute);
app.use("/profile", profileRoute);
app.use("/history", historyRoute);
app.use("/diet", dietRoute);
app.use("/workout", workoutRoute);
app.use("/healthinfo", healthInfoRoute);
app.use("/auth", authRoute);
app.use("/otp", otpRoute);

app.get("/api", isLoggedIn, isVerified, function (req, res) {
    //console.log("GET: /api");
    let userId = req.user._id;
    User.findById(userId).populate("profile").populate({ path: "diet.food" }).populate({ path: "workout.exercise" }).exec(function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.send(user);
        }
    });
});

app.get("/foods/api", isLoggedIn, isVerified, function (req, res) {
    //console.log("GET: /foods/api");
    Food.find({}, function (err, foods) {
        if (err) {
            console.log("err");
        } else {
            foods.sort(function (a, b): number {
                return b.activeUsers - a.activeUsers;
            });
            res.send(foods);
        }
    });
});

app.get("/exercises/api", isLoggedIn, isVerified, function (req, res) {
    //console.log("GET: /exercises/api");
    Exercise.find({}, function (err, exercises) {
        if (err) {
            console.log(err);
        } else {
            exercises.sort(function (a, b): number {
                return b.activeUsers - a.activeUsers;
            });
            res.send(exercises);
        }
    });
});

export default app;