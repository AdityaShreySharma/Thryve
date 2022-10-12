import User from "./../models/user";
import Profile from "./../models/profile";

export async function getHealthInfo (req, res) {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("profile");
    return res.render("healthInfo/index", { user: user });
}

export async function getWeight (req, res) {
    let profileId = req.user.profile;
    const weightProfile = await Profile.findById(profileId);
    return res.render("healthInfo/weight", { profile: weightProfile });
}

export async function updateTargetWeight (req, res) {
    let profileId = req.user.profile;
    await Profile.findByIdAndUpdate(profileId, {
        "$set":
            {
                "targetWeight": req.body.targetWeight
            }
    });
    return res.redirect("/healthinfo");
}

export async function updateBloodPressure (req, res) {
    let profileId = req.user.profile;
    const bloodPressureProfile = await Profile.findById(profileId);
    return res.render("healthInfo/bp", { profile: bloodPressureProfile });
}

export async function updateSugar (req, res) {
    let profileId = req.user.profile;
    const sugarProfile = await Profile.findById(profileId);
    return res.render("healthInfo/sugar", { profile: sugarProfile });
}