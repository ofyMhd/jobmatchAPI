const mongoose = require('mongoose');

const jomaSchema = new mongoose.Schema ({
    programStudy: {
        type: String,
        require: true
    },
    experience: {
        type: String,
        require: true
    },
    skills: {
        type: String,
        require: true
    },
    jobMatchHistory: [
        {
            programStudy: String,
            experience: String,
            skills: String,
            resultSkills: String,
            jobLink: String,
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Joma', jomaSchema);