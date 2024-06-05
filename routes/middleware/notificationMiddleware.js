module.exports = (req, res, next) => {
    if (req.session.notifications) {
        // Pass notifications to the view
        res.locals.notifications = req.session.notifications;
        console.log("Passing notifications to the view:", req.session.notifications);

        // Clear notifications from the session to avoid showing them again
        delete req.session.notifications;
    } else {
        console.log("No notifications found in the session.");
    }
    next();
};