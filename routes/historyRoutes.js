const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const isAuthenticated = require('./middleware/authMiddleware').isAuthenticated;

router.get('/history', isAuthenticated, async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page to 1 and limit to 10 items per page
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found, redirecting to login");
            return res.redirect('/login');
        }

        const tasks = await Task.find({ userId: userId })
                                .limit(limit * 1)
                                .skip((page - 1) * limit)
                                .exec();

        // Get total documents in the Task collection
        const count = await Task.countDocuments({ userId: userId });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        res.render('history', { username:user.username, tasks, totalPages, currentPage: page });
    } catch (error) {
        console.error(`Error fetching transaction history: ${error.message}`);
        console.error(error.stack);
        res.status(500).send('Error fetching transaction history');
    }
});

module.exports = router;