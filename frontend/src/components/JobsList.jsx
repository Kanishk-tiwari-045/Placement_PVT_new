import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, CardActions, IconButton } from '@mui/material';
import Modal from 'react-modal';
import { ExpandMore } from '@mui/icons-material';
import Application from './Application';

Modal.setAppElement('#root');

const JobsList = ({ applicantId, applicantProfileId }) => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10); // Number of jobs per page

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = () => {
    axios.get(`http://localhost:8000/api/v1/job/?page=${currentPage}`)
      .then(response => {
        console.log('API response:', response.data);  // Log API response
        const jobsData = response.data.results;  // Access the jobs array from the results property
        if (Array.isArray(jobsData)) {
          setJobs(jobsData);
        } else {
          console.error('API response results is not an array:', jobsData);
          setJobs([]);
        }
      })
      .catch(error => console.error('Error fetching jobs:', error));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleApply = (jobId) => {
    setSelectedJobId(jobId);
    setExpandedJobId(null); // Close expanded job
    setIsModalOpen(true);
  };

  const handleExpandClick = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: '20px', background: '#ffffff', borderRadius: '20px' }}>
      <TextField
        label="Search by Role"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
        {currentJobs.map(job => (
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
                <div className="px-4 py-3">
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleApply(job.id)}
                style={{ alignSelf: 'flex-end', marginBottom: '10px', marginLeft: 'auto' }}
              >
                Apply
              </Button>
              <IconButton onClick={() => handleExpandClick(job.id)}>
                <ExpandMore />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
      {/* Pagination controls */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, index) => (
          <Button
            key={index}
            variant="outlined"
            color={currentPage === index + 1 ? 'primary' : 'default'}
            onClick={() => paginate(index + 1)}
            style={{ margin: '0 5px' }}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Application Form"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark overlay with transparency
            zIndex: '1000' // Ensure the modal appears on top
          },
          content: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '80vw',
            maxHeight: '80vh',
            width: 'fit-content', // Set width to fit the content
            height: 'fit-content', // Set height to fit the content
            overflow: 'auto',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            animation: 'fadeIn 0.5s',
            border: 'none' // Remove the border
          }
        }}
      >
        <Application
          applicantId={applicantId}
          applicantProfileId={applicantProfileId}
          jobId={selectedJobId}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default JobsList;


