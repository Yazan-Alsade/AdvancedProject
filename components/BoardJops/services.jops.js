const { v4: uuidv4 } = require('uuid');
const connection = require('../dbConn/databse');

// Get all job listings
function getAllJobListings(callback) {
  const sql = 'SELECT * FROM jobs';

  connection.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

// Get job listing by ID
function getJobListingById(id, callback) {
  const sql = 'SELECT * FROM jobs WHERE id = ?';

  connection.query(sql, id, (err, results) => {
    if (err) {
      callback(err, null);
    } else if (results.length === 0) {
      callback(null, null);
    } else {
      callback(null, results[0]);
    }
  });
}

// Create a new job listing
function createJobListing(jobListing, callback) {
  const id = uuidv4();
  const { title, description, requirements, salary,location } = jobListing;
  const sql = 'INSERT INTO jobs ( id,title, description, requirements, salary,location) VALUES (?, ?, ?, ?, ?,?)';
  const values = [id, title, description, requirements, salary,location];

  connection.query(sql, values, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, id);
    }
  });
}

// Update an existing job listing
function updateJobListing(id, jobListing, callback) {
  const { title, description, requirements, salary,location } = jobListing;
  const sql = 'UPDATE jobs SET title = ?, description = ?, requirements = ?, salary = ?,,location=? WHERE id = ?';
  const values = [title, description, requirements, salary,,location, id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      callback(err);
    } else if (results.affectedRows === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
}

// Delete a job listing
function deleteJobListing(id, callback) {
  const sql = 'DELETE FROM jobs WHERE id = ?';

  connection.query(sql, id, (err, result) => {
    if (err) {
      callback(err);
    } else if (result.affectedRows === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
}

function searchJobs(title, location, salary) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM jobs WHERE 1=1";

    if (title) {
      query += ` AND title LIKE '%${title}%'`;
    }
    if (location) {
      query += ` AND location LIKE '%${location}%'`;
    }
    if (salary) {
      const [minSalary, maxSalary] = salary.split("-");
      query += ` AND salary BETWEEN ${minSalary} AND ${maxSalary}`;
    }

    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Save job search for future reference
module.exports.saveJobSearch = async (title, location, salaryRange) => {
  const sql = 'INSERT INTO saved_searches (title, location, min_salary, max_salary) VALUES (?, ?, ?, ?)';
  const values = [title, location, salaryRange.min, salaryRange.max];

  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);
      }
    });
  });
};
    
function applyForJob(jobApplication, callback) {
  const { jobId, resume, coverLetter } = jobApplication;

  // Check if the job exists
  const checkJobQuery = 'SELECT * FROM jobs WHERE id = ?';
  connection.query(checkJobQuery, jobId, (error, results) => {
    if (error) {
      callback(error);
    } else if (results.length === 0) {
      // Job not found
      callback('Job not found');
    } else {
      // Job found, insert the application
      const insertApplicationQuery = 'INSERT INTO job_applications (job_id, resume, coverLetter) VALUES (?, ?, ?)';
      const values = [jobId, resume, coverLetter];

      connection.query(insertApplicationQuery, values, (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null);
        }
      });
    }
  });
}

  // Read a job application by ID
function getJobApplicationById(id, callback) {
  const sql = 'SELECT * FROM job_applications WHERE id = ?';

  connection.query(sql, id, (err, results) => {
    if (err) {
      callback(err, null);
    } else if (results.length === 0) {
      callback(null, null);
    } else {
      callback(null, results[0]);
    }
  });
}

// Update a job application
function updateJobApplication(id, jobApplication, callback) {
  const { jobId, resume, coverLetter } = jobApplication;
  const sql = 'UPDATE job_applications SET job_id = ?, resume = ?, coverLetter = ? WHERE id = ?';
  const values = [jobId, resume, coverLetter, id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      callback(err);
    } else if (results.affectedRows === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
}

// Delete a job application
function deleteJobApplication(id, callback) {
  const sql = 'DELETE FROM job_applications WHERE id = ?';

  connection.query(sql, id, (err, result) => {
    if (err) {
      callback(err);
    } else if (result.affectedRows === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
}



  

module.exports = {
  getAllJobListings,
  getJobListingById,
  createJobListing,
  updateJobListing,
  deleteJobListing,
  searchJobs,
  applyForJob,
  getJobApplicationById,
  updateJobApplication,
  deleteJobApplication

};
