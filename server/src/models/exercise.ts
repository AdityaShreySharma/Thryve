import mongoose from "mongoose"

//Exercise
const ExerciseSchema = new mongoose.Schema({
    name: String,
    tag: String,
    steps: {type: String},
    MET: {type: Number, default: 5},
    activeUsers: {type: Number, default: 0},
    verified: {type: Boolean, default: false},
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Exercise = mongoose.model("Exercise", ExerciseSchema)
export default Exercise
