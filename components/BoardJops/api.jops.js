const express = require('express');
const router = express.Router();
const service = require('./services.jops');
const connection = require('../dbConn/databse');


// Get all job listings
router.get('/jobs', (req, res) => {
  service.getAllJobListings((err, jobListings) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving job listings' });
    } else {
      res.status(200).json(jobListings);
    }
  });
});

// Get job listing by ID
router.get('/jobs/:id', (req, res) => {
  const id = req.params.id;

  service.getJobListingById(id, (err, jobListing) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving job listing' });
    } else if (!jobListing) {
      res.status(404).json({ error: 'Job listing not found' });
    } else {
      res.status(200).json(jobListing);
    }
  });
});

// Create a new job listing
router.post('/jobs', (req, res) => {
  const jobListing = req.body;

  service.createJobListing(jobListing, (err, id) => {
    if (err) {
      res.status(500).json({ error: 'Error creating job listing' });
    } else {
      res.status(201).json({ id: id });
    }
  });
});

// Update an existing job listing
router.put('/jobs/:id', (req, res) => {
  const id = req.params.id;
  const jobListing = req.body;

  service.updateJobListing(id, jobListing, (err, success) => {
    if (err) {
      res.status(500).json({ error: 'Error updating job listing' });
    } else if (!success) {
      res.status(404).json({ error: 'Job listing not found' });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// Delete a job listing
router.delete('/jobs/:id', (req, res) => {
  const id = req.params.id;

  service.deleteJobListing(id, (err, success) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting job listing' });
    } else if (!success) {
      res.status(404).json({ error: 'Job listing not found' });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// Search for job listings
router.get("/jobs/search", async (req, res) => {
  const { title, location, salary } = req.query;

  try {
    const jobs = await service.searchJobs(title, location, salary);
    res.json(jobs);
  } catch (error) {
    console.error("Error searching for jobs:", error);
    res.status(500).json({ error: "An error occurred while searching for jobs" });
  }
});
  
  // Save job search
  router.post('/jobs/search/save', async (req, res) => {
    const { title, location, salary } = req.body;
  
    try {
      await service.saveJobSearch(title, location, salary);
      res.status(200).json({ message: 'Job search saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error saving job search' });
    }
  });

  // Apply for a job
router.post('/apply', (req, res) => {
  const { jobId, resume, coverLetter } = req.body;
  const jobApplication = {
    jobId,
    resume,
    coverLetter
  };

  service.applyForJob(jobApplication, (error) => {
    if (error === 'Job not found') {
      return res.status(404).json({ error: 'Job not found' });
    } else if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ message: 'Job application submitted successfully' });
  });
});
// Get a job application by ID
router.get('/job-applications/:id', (req, res) => {
  const { id } = req.params;

  service.getJobApplicationById(id, (error, jobApplication) => {
    if (error) {
      console.error('Error retrieving job application:', error);
      res.status(500).json({ error: 'Failed to retrieve job application' });
    } else if (!jobApplication) {
      res.status(404).json({ error: 'Job application not found' });
    } else {
      res.json(jobApplication);
    }
  });
});

// Update a job application
router.put('/job-applications/:id', (req, res) => {
  const { id } = req.params;
  const { jobId, resume, coverLetter } = req.body;
  const jobApplication = { jobId, resume, coverLetter };

  service.updateJobApplication(id, jobApplication, (error, success) => {
    if (error) {
      console.error('Error updating job application:', error);
      res.status(500).json({ error: 'Failed to update job application' });
    } else if (!success) {
      res.status(404).json({ error: 'Job application not found' });
    } else {
      res.json({ success: true });
    }
  });
});

// Delete a job application
router.delete('/job-applications/:id', (req, res) => {
  const { id } = req.params;

  service.deleteJobApplication(id, (error, success) => {
    if (error) {
      console.error('Error deleting job application:', error);
      res.status(500).json({ error: 'Failed to delete job application' });
    } else if (!success) {
      res.status(404).json({ error: 'Job application not found' });
    } else {
      res.json({ success: true });
    }
  });
});

// API Endpoint to Toggle Application as Favorite
router.put('/applications/:applicationId/favorite', (req, res) => {
  const { applicationId } = req.params;
  const { isFavorite } = req.body;

  const sql = 'UPDATE job_applications SET is_favorite = ? WHERE id = ?';
  const values = [isFavorite, applicationId];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating application favorite status:', err);
      res.status(500).json({ error: 'An error occurred while updating application favorite status' });
    } else {
      res.status(200).json({ message: 'Application favorite status updated successfully' });
    }
  });
});



  

module.exports = router;
