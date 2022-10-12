import Profile from "../models/profile";

export async function postWeight (req, res) {
    const { profile: id } = req.user;
    const weight = req.body.data;
    try {
        await Profile.findByIdAndUpdate(id, { "$set": { "weight": weight } });
        const profile = await Profile.findById(id);
        const newWeight = {
            weight: req.body.data,
            timestamp: new Date(Date.now())
        };
        profile.weightHist.push(newWeight);
        await profile.save();
        res.redirect("/healthinfo");
    } catch (err) {
        throw new Error(err);
    }
}

export async function deleteWeight (req, res) {
    const { profile: id } = req.user;
    try {
        const profile = await Profile.findById(id);
        const timeStampISOString = new Date(req.body.timestamp).toISOString();

        let idx = -1;

        profile.weightHist.find(function (w, index) {
            let timestamp = new Date(new Date(w.timestamp)
                .setMilliseconds(0))
                .toISOString();
            if (timestamp === timeStampISOString) idx = index;
        });

        if (profile.weightHist.length > 1 && idx !== -1) {
            profile.weightHist.splice(idx, 1);
            profile.weight = profile.weightHist[profile.weightHist.length - 1].weight;
            await profile.save();
            return res.redirect("/healthinfo");
        }

        if (profile.weightHist.length === 1) {
            req.flash("error", "Weight history cannot be empty. Please add some weight to delete.");
            return res.redirect("/healthinfo/weight");
        }

        req.flash("error", "Something went wrong");
        return res.redirect("/healthinfo");

    } catch (err) {
        throw new Error(err);
    }
}

export async function postBloodPressure (req, res) {
    const { profile: id } = req.user;
    try {
        await Profile.findByIdAndUpdate(id, { "$set": { "bp": req.body.bp } });
        const profile = await Profile.findById(id);
        const newBP = {
            bp: req.body.bp,
            timestamp: new Date(Date.now())
        };
        profile.bpHist.push(newBP);
        await profile.save();
        res.redirect("/healthinfo");
    } catch (err) {
        throw new Error(err);
    }
}

export async function deleteBloodPressure (req, res) {
    const { profile: id } = req.user;
    try {
        const profile = await Profile.findById(id);
        const timeStampISOString = new Date(req.body.timestamp).toISOString();

        let idx = -1;

        profile.bpHist.find(function (w, index) {
            let timestamp = new Date(new Date(w.timestamp)
                .setMilliseconds(0))
                .toISOString();
            if (timestamp === timeStampISOString) idx = index;
        });

        if (profile.bpHist.length > 1 && idx !== -1) {
            profile.bpHist.splice(idx, 1);
            profile.bp = profile.bpHist[profile.bpHist.length - 1].bp;
            await profile.save();
            return res.redirect("/healthinfo");
        }

        if (profile.bpHist.length === 1) {
            req.flash("error",
                "Blood Pressure history cannot be empty." +
                " Please add some weight to delete.");
            return res.redirect("/healthinfo/bp");
        }

        req.flash("error", "Something went wrong");
        return res.redirect("/healthinfo");
    } catch (err) {
        throw new Error(err);
    }
}

export async function postSugar (req, res) {
    try {
        const { profile: profileId } = req.user;
        Profile.findByIdAndUpdate(profileId,
            { "$set": { "sugar": req.body.sugar } }, (err, foundProfile) => {
                if (err) throw new Error(err);
                let newSugar = {
                    sugar: req.body.sugar,
                    timestamp: new Date(Date.now())
                };
                foundProfile.sugarHist.push(newSugar);
                foundProfile.save();
                return res.redirect("/healthinfo");
            });
    } catch (err) {
        throw new Error(err);
    }
}

export async function deleteSugar (req, res) {
    const { profile: profileId } = req.user;
    const sugarProfile = await Profile.findById(profileId);

    if (typeof sugarProfile === "undefined") {
        req.flash("error", "Something went wrong");
        return res.redirect("/healthinfo");
    }

    const current_timestamp = new Date(req.body.timestamp).toISOString();
    let idx = -1;
    sugarProfile.sugarHist.find((sugar, index) => {
        let timestamp = new Date(new Date(sugar.timestamp).setMilliseconds(0)).toISOString();
        if (timestamp === current_timestamp)
            idx = index;
    });

    if (sugarProfile.sugarHist.length > 1 && idx !== -1) {
        sugarProfile.sugarHist.splice(idx, 1);
        sugarProfile.sugar = sugarProfile.sugarHist[sugarProfile.sugarHist.length - 1].sugar;
        await sugarProfile.save();
        return res.redirect("/healthinfo");
    }

    if (idx === 0) {
        req.flash("error", "Blood Sugar History cannot be empty. Please add a data to delete.");
        return res.redirect("/healthinfo/sugar");
    }

    req.flash("error", "Something went wrong");
    return res.redirect("/healthinfo");
}
