import mongoose from "mongoose"
//Food
const FoodSchema = new mongoose.Schema({
    name: String,
    categoryTag: String,
    proteinTag: String,
    fatTag: String,
    carbohydratesTag: String,
    energy: {
        amount: {type: Number, default: 0},
        unit: {type: String, default: "kcal"}
    },
    nutrients: {
        protein: {
            amount: {type: Number, default: 0},
            unit: {type: String, default: "g"}
        },
        fat: {
            amount: {type: Number, default: 0},
            unit: {type: String, default: "g"}
        },
        carbohydrates: {
            amount: {type: Number, default: 0},
            unit: {type: String, default: "g"}
        }
    },
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
});

const Food = mongoose.model("Food", FoodSchema)
export default Food
