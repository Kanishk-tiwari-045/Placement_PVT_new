import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
} from '@mui/material';

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
    custom_ques: {}, // Change this to an object
    attachments: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [customQuestion, setCustomQuestion] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        if (key === 'custom_ques') {
          formDataToSend.append(key, JSON.stringify(formData[key])); // Convert custom_ques to JSON string
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      await axios.post('http://localhost:8000/api/v1/job/', formDataToSend);
      alert('Job created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
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
                label="Company"
                name="company"
                value={formData.company}
                fullWidth
                required
                InputProps={{ 
                  style: { 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    readOnly: true,
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
                label="Perks and Benefits"
                name="perks_benefits"
                value={formData.perks_benefits}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
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
                label="Custom Question"
                value={customQuestion}
                onChange={handleCustomQuestionChange}
                fullWidth
                InputProps={{
                  style: { borderRadius: '20px', fontWeight: 'bold' },
                }}
                InputLabelProps={{
                  style: { fontWeight: 'bold' },
                }}
              />
              <Button type="button" onClick={addCustomQuestion} variant="contained" style={{ marginTop: '10px' }}>
                Add Question
              </Button>
            </Grid>
            {Object.keys(formData.custom_ques).map((question, index) => (
              <Grid item xs={12} key={index}>
                <Typography>{question}</Typography>
              </Grid>
            ))}
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}>
                Post Job
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default JobForm;


// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   MenuItem,
// } from '@mui/material';

// const JobForm = ({ onClose }) => {
//   const initialFormData = {
//     title: '',
//     description: '',
//     work_location: 'onsite',
//     job_type: 'full_time',
//     eligibility_criteria: '',
//     deadline: '',
//     stipend_salary: '',
//     company: localStorage.getItem('organisationId') || '', // Retrieve organisation ID from local storage
//     status: 'open',
//     openings: 1,
//     perks_benefits: '',
//     custom_ques: null,
//     attachments: null,
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       for (let key in formData) {
//         formDataToSend.append(key, formData[key]);
//       }
//       await axios.post('http://localhost:8000/api/v1/job/', formDataToSend);
//       alert('Job created successfully');
//       onClose();
//     } catch (error) {
//       console.error('Error creating job:', error);
//       alert('Failed to create job');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//       <Paper style={{ padding: '20px', maxWidth: '1100px', width: '100%', borderRadius: '25px', textAlign: 'center', overflow: 'auto' }}>
//         <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
//           Create Job
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Work Location"
//                 name="work_location"
//                 value={formData.work_location}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               >
//                 <MenuItem value="onsite">Onsite</MenuItem>
//                 <MenuItem value="remote">Remote</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Job Type"
//                 name="job_type"
//                 value={formData.job_type}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               >
//                 <MenuItem value="full_time">Full Time</MenuItem>
//                 <MenuItem value="part_time">Part Time</MenuItem>
//                 <MenuItem value="contract">Contract</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               >
//                 <MenuItem value="open">Open</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Company"
//                 name="company"
//                 value={formData.company}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                     readOnly: true,
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//                 // disabled // Disable the company field as it is pre-filled
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Deadline"
//                 type="datetime-local"
//                 name="deadline"
//                 value={formData.deadline}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   shrink: true,
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Stipend/Salary"
//                 name="stipend_salary"
//                 value={formData.stipend_salary}
//                 onChange={handleChange}
//                 fullWidth
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Eligibility Criteria"
//                 name="eligibility_criteria"
//                 value={formData.eligibility_criteria}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Perks and Benefits"
//                 name="perks_benefits"
//                 value={formData.perks_benefits}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Custom Questions"
//                 name="custom_ques"
//                 value={formData.custom_ques}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold', // Make text inside input bold
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold', // Make label bold
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} style={{ textAlign: 'center' }}>
//               <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}>
//                 Post Job
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </div>
//   );
// };

// export default JobForm;


// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   MenuItem,
// } from '@mui/material';

// const JobForm = ({ onClose }) => {
//   const initialFormData = {
//     title: '',
//     description: '',
//     work_location: 'onsite',
//     job_type: 'full_time',
//     eligibility_criteria: '',
//     deadline: '',
//     stipend_salary: '',
//     company: localStorage.getItem('organisationId') || '',
//     status: 'open',
//     openings: 1,
//     perks_benefits: '',
//     custom_ques: {}, // Change this to an object
//     attachments: null,
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [customQuestion, setCustomQuestion] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleCustomQuestionChange = (e) => {
//     setCustomQuestion(e.target.value);
//   };

//   const addCustomQuestion = () => {
//     if (customQuestion.trim()) {
//       setFormData((prevData) => ({
//         ...prevData,
//         custom_ques: {
//           ...prevData.custom_ques,
//           [customQuestion]: '', // Initialize with empty answer
//         },
//       }));
//       setCustomQuestion(''); // Clear the input field
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       for (let key in formData) {
//         formDataToSend.append(key, JSON.stringify(formData[key])); // Convert custom_ques to JSON string
//       }
//       await axios.post('http://localhost:8000/api/v1/job/', formDataToSend);
//       alert('Job created successfully');
//       onClose();
//     } catch (error) {
//       console.error('Error creating job:', error);
//       alert('Failed to create job');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//       <Paper style={{ padding: '20px', maxWidth: '1100px', width: '100%', borderRadius: '25px', textAlign: 'center', overflow: 'auto' }}>
//         <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
//           Create Job
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Work Location"
//                 name="work_location"
//                 value={formData.work_location}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               >
//                 <MenuItem value="onsite">Onsite</MenuItem>
//                 <MenuItem value="remote">Remote</MenuItem>
//                 <MenuItem value="hybrid">Hybrid</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Job Type"
//                 name="job_type"
//                 value={formData.job_type}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               >
//                 <MenuItem value="full_time">Full Time</MenuItem>
//                 <MenuItem value="part_time">Part Time</MenuItem>
//                 <MenuItem value="internship">Internship</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               >
//                 <MenuItem value="open">Open</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Company"
//                 name="company"
//                 value={formData.company}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                     readOnly: true,
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Deadline"
//                 type="datetime-local"
//                 name="deadline"
//                 value={formData.deadline}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   shrink: true,
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Stipend/Salary"
//                 name="stipend_salary"
//                 value={formData.stipend_salary}
//                 onChange={handleChange}
//                 fullWidth
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Eligibility Criteria"
//                 name="eligibility_criteria"
//                 value={formData.eligibility_criteria}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 required
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Perks and Benefits"
//                 name="perks_benefits"
//                 value={formData.perks_benefits}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 InputProps={{ 
//                   style: { 
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                   } 
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontWeight: 'bold',
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Custom Question"
//                 value={customQuestion}
//                 onChange={handleCustomQuestionChange}
//                 fullWidth
//                 // InputProps={{
//                 //   style: { borderRadius: '20px', fontWeight: 'bold' },
//                 // }}
//                 // InputLabelProps={{
//                 //   style: { fontWeight: 'bold' },
//                 // }}
//               />
//               <Button type="button" onClick={addCustomQuestion} variant="contained" style={{ marginTop: '10px' }}>
//                 Add Question
//               </Button>
//             </Grid>
//             {Object.keys(formData.custom_ques).map((question, index) => (
//               <Grid item xs={12} key={index}>
//                 <Typography>{question}</Typography>
//                 <TextField
//                   value={formData.custom_ques[question]}
//                   onChange={(e) => {
//                     const updatedQuestions = { ...formData.custom_ques, [question]: e.target.value };
//                     setFormData({ ...formData, custom_ques: updatedQuestions });
//                   }}
//                   fullWidth
//                   multiline
//                   rows={2}
//                   // InputProps={{
//                   //   style: { borderRadius: '20px', fontWeight: 'bold' },
//                   // }}
//                   // InputLabelProps={{
//                   //   style: { fontWeight: 'bold' },
//                   // }}
//                 />
//               </Grid>
//             ))}
//             <Grid item xs={12} style={{ textAlign: 'center' }}>
//               <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}>
//                 Post Job
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </div>
//   );
// };

// export default JobForm;
