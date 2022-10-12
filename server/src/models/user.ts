import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
// import * as bcrypt from "bcrypt-nodejs"

//User
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    password: String,
    admin: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    verified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    diet: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: {
                amount: { type: Number, default: 100 },
                unit: { type: String, default: "g" }
            },
            check: { type: Boolean, default: false }
        }
    ],
    workout: [
        {
            exercise: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Exercise"
            },
            duration: { type: Number, default: 15 },
            check: { type: Boolean, default: false }
        }
    ],
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);
export default User;
