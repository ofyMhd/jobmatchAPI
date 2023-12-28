const express = require('express');
const router = express.Router();
const Joma = require('../models/Joma');


router.post('/jobmatch-ai', async (req, res, next) => {
    const { programStudy, experience, skills } = req.body;
    let resultSkills = "";

    try {
        if (skills.includes('JavaScript')) {
            resultSkills = "JavaScript Developer";
        } else if (skills.includes('Python')) {
            resultSkills = "Python Developer";
        } else if (skills.includes('Java')) {
            resultSkills = "Java Developer";
        } else {
            resultSkills = "Generic Developer";
        }

        const jobLink = "https://www.jobstreet.co.id/";

        const joma = await Joma.findById(req.user.id);
        if (!joma) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const date = new Date();
        joma.jobMatchHistory.push({
            programStudy,
            experience,
            skills,
            resultSkills,
            jobLink,
            date
        });

        await joma.save();

        res.status(200).json({
            success: true,
            message: 'Job match result saved successfully',
            resultSkills,
            jobLink
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Something error occurred'
        });
    }
});

module.exports = router;
