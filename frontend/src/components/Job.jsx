import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const JobForm = ({ onClose }) => {
  const initialFormData = {
    title: '',
    description: '',
    work_location: 'onsite',
    job_type: 'full_time',
    eligibility_criteria: '',
    deadline: '',
    stipend_salary: '',
    company: localStorage.getItem('organisationId') || '',
    status: 'open',
    openings: 1,
    perks_benefits: '',
    custom_ques: {},
    attachments: null,
    // content_type:11
  };

  const [formData, setFormData] = useState(initialFormData);
  const [customQuestion, setCustomQuestion] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [attachments, setAttachments] = useState([]);

  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleCustomQuestionChange = (e) => {
    setCustomQuestion(e.target.value);
  };

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        custom_ques: {
          ...prevData.custom_ques,
          [customQuestion]: '', // Initialize with empty answer
        },
      }));
      setCustomQuestion(''); // Clear the input field
    }
  };

  const handleDeleteQuestion = (question) => {
    const { [question]: _, ...updatedQuestions } = formData.custom_ques;
    setFormData({
      ...formData,
      custom_ques: updatedQuestions,
    });
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestionText(question);
  };

  const saveEditedQuestion = () => {
    const { [editingQuestion]: answer, ...rest } = formData.custom_ques;
    setFormData({
      ...formData,
      custom_ques: {
        ...rest,
        [newQuestionText]: answer,
      },
    });
    setEditingQuestion(null);
    setNewQuestionText('');
  };
  const handleFileChange = (e) => {
    setAttachments(e.target.files); // Store the FileList object
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate < today) {
      alert('Deadline cannot be in the past');
      return;
    }
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        if (key === 'custom_ques') {
          formDataToSend.append(key, JSON.stringify(formData[key])); // Convert custom_ques to JSON string
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      const jobResponse = await axios.post('http://localhost:8000/api/v1/job/', formDataToSend);
      const jobId = jobResponse.data.data.id;
      alert('Job created successfully');
  
      // Handle file attachments
      if (attachments.length > 0) {
        const attachmentFormData = new FormData();
        Array.from(attachments).forEach((file) => {
          attachmentFormData.append('attachment_file', file); // Append each file individually
        });
        attachmentFormData.append("attachment_type", "certificates");
        attachmentFormData.append('content_type', 11);
        attachmentFormData.append('object_id', jobId);
  
        await axios.post('http://localhost:8000/api/v1/attachment/', attachmentFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        });
        alert("Attachments attached successfully");
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
  };
  
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper style={{ padding: '20px', maxWidth: '1100px', width: '100%', borderRadius: '25px', textAlign: 'center', overflow: 'auto' }}>
        <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
          Create Job
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Work Location"
                name="work_location"
                value={formData.work_location}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              >
                <MenuItem value="onsite">Onsite</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Job Type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              >
                <MenuItem value="full_time">Full Time</MenuItem>
                <MenuItem value="part_time">Part Time</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Deadline"
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Stipend/Salary"
                name="stipend_salary"
                value={formData.stipend_salary}
                onChange={handleChange}
                fullWidth
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Eligibility Criteria"
                name="eligibility_criteria"
                value={formData.eligibility_criteria}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Number of Openings"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Perks and Benefits"
                name="perks_benefits"
                value={formData.perks_benefits}
                onChange={handleChange}
                fullWidth
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } 
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Custom Question"
                value={customQuestion}
                onChange={handleCustomQuestionChange}
                fullWidth
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  } ,
                  endAdornment: (
                    <IconButton
                      onClick={addCustomQuestion}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {Object.keys(formData.custom_ques).map((question, index) => (
                <Grid container key={index} alignItems="center">
                  <Grid item xs={10}>
                    {editingQuestion === question ? (
                      <TextField
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        fullWidth
                        InputProps={{ 
                          style: { 
                            borderRadius: '20px',
                            fontWeight: 'bold',
                          } 
                        }}
                        InputLabelProps={{
                          style: {
                            fontWeight: 'bold',
                          }
                        }}
                      />
                    ) : (
                      <Typography>{question}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    {editingQuestion === question ? (
                      <IconButton
                        onClick={saveEditedQuestion}
                        color="primary"
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleEditQuestion(question)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDeleteQuestion(question)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom style={{ marginTop: '20px', fontWeight: 'bold' }}>
                Attachments
              </Typography>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ marginTop: '10px', fontWeight: 'bold' }}
              />
            </Grid>
{/* 
            <Grid item xs={12} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}></Grid> */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ borderRadius: '20px', fontWeight: 'bold' }}
              >
                Create Job
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default JobForm;