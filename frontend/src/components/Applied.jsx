import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardActions, IconButton, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const Applied = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const userId = localStorage.getItem('userid');

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/application/?applicant=${userId}`);
      console.log('Applications Response:', response);
      const applications = response.data.data;

      // Extract job IDs
      const jobIds = applications.map(app => app.job);
      console.log('Job IDs:', jobIds);

      // Fetch job details for each job ID
      const jobPromises = jobIds.map(jobId => axios.get(`http://localhost:8000/api/v1/job/?id=${jobId}`));
      const jobResponses = await Promise.all(jobPromises);

      console.log('Job Responses:', jobResponses);
      const userAppliedJobs = jobResponses.map(res => res.data.results[0]);
      setAppliedJobs(userAppliedJobs);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  const handleExpandClick = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div style={{ padding: '20px', background: '#ffffff', borderRadius: '20px' }}>
       <Typography variant="h4" component="h2" style={{ fontWeight: 'bold', marginBottom: '30px' }}>
        Applied Jobs
        </Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
        {appliedJobs.map(job => (
          <Card key={job.id} style={{ marginBottom: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent style={{ flexGrow: 1 }}>
              <div className="bg-blue-800 text-white text-center py-4" style={{ borderRadius: '15px' }}>
                <h2 className="text-2xl font-semibold">{job.title}</h2>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-x-4 overflow-y-auto max-h-96">
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Location:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.location}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Work Location:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.work_location}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Job Type:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.job_type}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Stipend/Salary:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.stipend_salary}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Deadline:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.deadline}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Openings:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.openings}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700 font-bold">Status:</span>
                  <span className="block text-gray-900 overflow-hidden">{job.status}</span>
                </div>
              </div>
              {expandedJobId === job.id && (
                <div>
                  <div className="mb-4">
                    <span className="block text-gray-700 font-bold">Description:</span>
                    <span className="block text-gray-900 overflow-hidden">{job.description}</span>
                  </div>
                  <div className="mb-4">
                    <span className="block text-gray-700 font-bold">Eligibility Criteria:</span>
                    <span className="block text-gray-900 overflow-hidden">{job.eligibility_criteria}</span>
                  </div>
                  <div className="mb-4">
                    <span className="block text-gray-700 font-bold">Perks & Benefits:</span>
                    <span className="block text-gray-900 overflow-hidden">{job.perks_benefits}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardActions>
              <IconButton
                onClick={() => handleExpandClick(job.id)}
                aria-expanded={expandedJobId === job.id}
                aria-label="show more"
              >
                <ExpandMore />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Applied;