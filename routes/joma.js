const express = require('express');
const router = express.Router();

module.exports = (admin) => {
const db = admin.firestore();
const jobHistoryCollection = db.collection('JobHistory');


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

const jobHistoryDoc = jobHistoryCollection.doc(req.user.id);
const jobHistory = await jobHistoryDoc.get();

  if (!jobHistory.exists) {
    await jobHistoryDoc.set({
        programStudy,
        experience,
        skills,
        jobMatchHistory: [],
  });
}

const currentDate = new Date();
const formattedDate = currentDate.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});

const jobMatchResult = {
    programStudy,
    experience,
    skills,
    resultSkills,
    jobLink,
    date: formattedDate,
};

await jobHistoryDoc.update({
    jobMatchHistory: admin.firestore.FieldValue.arrayUnion(jobMatchResult),
});

    res.status(200).json({
        success: true,
        message: 'Job match result saved successfully',
        resultSkills,
        jobLink,
      });
      
} catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  });

router.get('/jobhistory', async (req, res, next) => {
    try {
      const jobHistoryDoc = await jobHistoryCollection.doc(req.user.id).get();

      if (!jobHistoryDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Job history not found',
        });
      }

      const jobHistoryData = jobHistoryDoc.data();

      res.status(200).json({
        success: true,
        jobHistory: jobHistoryData.jobMatchHistory || [],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  });



return router;
};
