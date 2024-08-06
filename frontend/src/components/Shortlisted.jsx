import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Shortlisted = () => {
  const [shortlistedApplicants, setShortlistedApplicants] = useState([]);

  useEffect(() => {
    fetchShortlistedApplicants();
  }, []);

  const fetchShortlistedApplicants = async () => {
    try {
      const userId = localStorage.getItem('userid');
      const orgResponse = await axios.get(
        `http://localhost:8000/api/v1/org/create/?created_by=${userId}`,
        {
          headers: {
            Authorization:` Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const organizations = orgResponse.data.results;
      if (!organizations || organizations.length === 0) {
        console.error('No organization found for user or empty response:', orgResponse);
        return;
      }
      const organizationId = organizations[0].id;
  
      // Fetch jobs to get job details including company ID
      const jobsResponse = await axios.get(
        `http://localhost:8000/api/v1/job/?company=${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const jobsData = jobsResponse.data.results;
  
      // Collecting all job IDs
      const jobIds = jobsData.map(job => job.id);
  
      // Fetch shortlisted applications and filter them based on status
      const shortlistedApplicantsData = [];
      for (const jobId of jobIds) {
        const applicationsResponse = await axios.get(
          `http://localhost:8000/api/v1/application/?job=${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
  
        const applications = applicationsResponse.data.data;
        // Filter applications by status 'shortlisted'
        const shortlistedApplications = applications.filter(application =>
          application.status === 'shortlisted'
        );
  
        // Fetch applicant profile for each shortlisted application
        for (const application of shortlistedApplications) {
          const applicantProfileResponse = await axios.get(
            `http://localhost:8000/api/v1/applicantprofile/?applicant=${application.applicant}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            }
          );
          const applicantProfile = applicantProfileResponse.data.data;
  
          // Push shortlisted applicant data
          shortlistedApplicantsData.push({
            applicant_name: applicantProfile.applicant.name,
            applicant_email: applicantProfile.applicant.email,
            job: application.job, // Assuming job title is directly accessible from application
            id: application.id, // Assuming you have an identifier for the application
          });
        }
      }
  
      setShortlistedApplicants(shortlistedApplicantsData);
    } catch (error) {
      console.error('Error fetching shortlisted applicants:', error);
    }
  };

  const handleRemoveShortlist = async (applicationId) => {
    try {
      // Update application status to 'applied' or desired initial status
      const response = await axios.patch(
        'http://localhost:8000/api/v1/application/${applicationId}/',
        { status: 'applied' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log('Applicant removed from shortlist successfully:', response.data);
      fetchShortlistedApplicants(); // Refresh the list after removing shortlist
    } catch (error) {
      console.error('Error removing applicant from shortlist:', error);
      // Handle error scenarios
    }
  };

  return (
    <div>
      <Typography variant="h4   " gutterBottom style={{ color: 'black', backgroundColor: 'white', padding: '10px'  }}>
        Shortlisted Applicants
      </Typography>
      {shortlistedApplicants.length > 0 ? (
        <List>
          {shortlistedApplicants.map((applicant) => (
            <Card key={applicant.id} style={{ marginBottom: '10px' }}>
              <CardContent>
                <Typography variant="h6">{applicant.applicant_name}</Typography>
                <Typography color="textSecondary">
                  Applied for Job-ID: {applicant.job}
                </Typography>
              </CardContent>
              <ListItem>
                <ListItemText primary={`Email: ${applicant.applicant_email}`} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveShortlist(applicant.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No shortlisted applicants found.</Typography>
      )}
    </div>
  );
};

export default Shortlisted;