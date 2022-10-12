import mongoose from "mongoose"

//Profile
const ProfileSchema = new mongoose.Schema({
    name: {
        first: {type: String, default: ""},
        last: {type: String, default: ""}
    },
    gender: String,
    dob: Date,
    height: {
        magnitude: {type: Number, default: 0},
        unit: {type: String, default: "cm"}
    },
    weight: {
        magnitude: {type: Number, default: 0},
        unit: {type: String, default: "kg"}
    },
    targetWeight: Number,
    bp: {
        systolic: Number,
        diastolic: Number
    },
    sugar: Number,
    weightHist: [
        {
            weight: {
                magnitude: {type: Number, default: 0},
                unit: {type: String, default: "kg"}
            },
            timestamp: {type: Date, default: Date.now}
        }
    ],
    bpHist: [
        {
            bp: {
                systolic: Number,
                diastolic: Number
            },
            timestamp: {type: Date, default: Date.now}
        }
    ],
    sugarHist: [
        {
            sugar: Number,
            timestamp: {type: Date, default: Date.now}
        }
    ]
});

const Profile = mongoose.model("Profile", ProfileSchema)
export default Profile
