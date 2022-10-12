import User from './../../models/user'

export const getAdmin = (req, res) => {
    return res.render('keyForm')
}

export const postAdmin = async (req, res) => {
    const
        userId = req.user._id,
        key = process.env.ADMIN_KEY

    if (key !== req.body.key) {
        req.flash('error', 'Incorrect Key. Admin privileges denied.')
        return res.redirect('/home')
    }

    const user = await User.findById(userId)
    if (!user) {
        req.flash('error', 'Something went wrong')
        return res.redirect('/home')
    }

    user.admin = true
    await user.save()
    req.flash('success', 'You are now an Admin User')
    return res.redirect('/home')
}