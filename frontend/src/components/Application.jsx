import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

const Application = ({ onClose, jobId, applicantId, applicantProfileId  }) => {
  const [formData, setFormData] = useState({
    applicant: localStorage.getItem('userid') || "",
    applicant_profile: localStorage.getItem('applicantprofile_id') || "",
    job: jobId,
    application_date: new Date().toISOString().substring(0, 10),
    stage: 1,
    answers_to_ques: {}, // Holds question-answer pairs
    status: 'applied',
  });


  const [token, setToken] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchToken = () => {
      const token = localStorage.getItem("token");
      setToken(token);
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/job/?id=${jobId}`, {
          headers: { Authorization: `Token ${token}` }
        });
        const jobData = response.data.results[0]; // Assuming the job data is in the first element
        if (jobData && jobData.custom_ques) {
          setQuestions(Object.keys(jobData.custom_ques)); // Assuming custom_ques is an object with questions as keys
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchToken();
    fetchQuestions();
  }, [jobId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('question_')) {
      const questionIndex = name.split('_')[1]; // Get the index from the name
      setFormData((prevData) => ({
        ...prevData,
        answers_to_ques: {
          ...prevData.answers_to_ques,
          [questions[questionIndex]]: value, // Use the actual question text as the key
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post('http://localhost:8000/api/v1/application/', formData, {
  //       headers: {
  //         Authorization: `Token ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     alert('Application created successfully');
  //     onClose();
  //   } catch (error) {
  //     if (error.response && error.response.status === 409) {
  //       alert('Application already exists');
  //       setIsDuplicate(true);
  //     } else {
  //       console.error('Error creating application:', error);
  //       alert('Failed to create application');
  //     }
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/application/', formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert('Application created successfully');
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Application already exists');
        setIsDuplicate(true);
      } else {
        console.error('Error creating application:', error);
        alert('Failed to create application');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper style={{ padding: '40px', maxWidth: '800px', width: '100%', borderRadius: '25px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
          Create Application
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job"
                name="job"
                value={formData.job}
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
                disabled={isDuplicate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Application Date"
                type="date"
                name="application_date"
                value={formData.application_date}
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
                disabled={isDuplicate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stage"
                type="number"
                name="stage"
                value={formData.stage}
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
                disabled={isDuplicate}
              />
            </Grid>
            {/* Render questions dynamically */}
              {questions.map((question, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={question} // Display the question as the label
                    name={`question_${index}`} // Unique name for each question
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
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
                    disabled={isDuplicate}
                  />
                </Grid>
              ))}
            <Grid item xs={12}>
              <TextField
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
                disabled={isDuplicate}
              />
            </Grid>
          </Grid>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }} disabled={isDuplicate}>
              Submit Application
            </Button>
            <Button onClick={onClose} variant="contained" color="secondary">
              Close
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Application;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

// const Application = ({ onClose, jobId, applicantId, applicantProfileId }) => {
//   const [formData, setFormData] = useState({
//     applicant: localStorage.getItem('userid') || "",
//     applicant_profile: localStorage.getItem('applicant_id') || "",
//     job: jobId,
//     application_date: new Date().toISOString().substring(0, 10),
//     stage: 1,
//     answers_to_ques: '',
//     status: 'applied',
//   });

//   const [token, setToken] = useState("");
//   const [isDuplicate, setIsDuplicate] = useState(false);

//   useEffect(() => {
//     const fetchToken = () => {
//       const token = localStorage.getItem("token");
//       setToken(token);
//     };

//     fetchToken();
//   }, []);

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
//       await axios.post('http://localhost:8000/api/v1/application/', formData, {
//         headers: {
//           Authorization: `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       alert('Application created successfully');
      
//       onClose();
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         alert('Application already exists');
//         setIsDuplicate(true);
//       } else {
//         console.error('Error creating application:', error);
//         alert('Failed to create application');
//       }
//     }
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <Paper style={{ padding: '40px', maxWidth: '800px', width: '100%', borderRadius: '25px', textAlign: 'center' }}>
//         <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
//           Create Application
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Job"
//                 name="job"
//                 value={formData.job}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Application Date"
//                 type="date"
//                 name="application_date"
//                 value={formData.application_date}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Stage"
//                 type="number"
//                 name="stage"
//                 value={formData.stage}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Answers to Questions"
//                 name="answers_to_ques"
//                 value={formData.answers_to_ques}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//           </Grid>
//           <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }} disabled={isDuplicate}>
//               Submit Application
//             </Button>
//             <Button onClick={onClose} variant="contained" color="secondary">
//               Close
//             </Button>
//           </div>
//         </form>
//       </Paper>
//     </div>
//   );
// };

// export default Application;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

// const Application = ({ onClose, jobId, applicantId, applicantProfileId }) => {
//   const [formData, setFormData] = useState({
//     applicant: localStorage.getItem('userid') || "",
//     applicant_profile: localStorage.getItem('applicant_id') || "",
//     job: jobId,
//     application_date: new Date().toISOString().substring(0, 10),
//     stage: 1,
//     answers_to_ques: {}, // Change this to an object to hold question-answer pairs
//     status: 'applied',
//   });

//   const [token, setToken] = useState("");
//   const [isDuplicate, setIsDuplicate] = useState(false);
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const fetchToken = () => {
//       const token = localStorage.getItem("token");
//       setToken(token);
//     };

//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/v1/job/?id=${jobId}`, {
//           headers: { Authorization: `Token ${token}` }
//         });
//         const jobData = response.data[0]; // Assuming the job data is in the first element
//         if (jobData && jobData.custom_ques) {
//           setQuestions(Object.keys(jobData.custom_ques)); // Assuming custom_ques is an object with questions as keys
//         }
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       }
//     };

//     fetchToken();
//     fetchQuestions();
//   }, [jobId, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       answers_to_ques: {
//         ...prevData.answers_to_ques,
//         [name]: value, // Update the specific answer
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:8000/api/v1/application/', formData, {
//         headers: {
//           Authorization: `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       alert('Application created successfully');
//       onClose();
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         alert('Application already exists');
//         setIsDuplicate(true);
//       } else {
//         console.error('Error creating application:', error);
//         alert('Failed to create application');
//       }
//     }
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <Paper style={{ padding: '40px', maxWidth: '800px', width: '100%', borderRadius: '25px', textAlign: 'center' }}>
//         <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
//           Create Application
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Job"
//                 name="job"
//                 value={formData.job}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Application Date"
//                 type="date"
//                 name="application_date"
//                 value={formData.application_date}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Stage"
//                 type="number"
//                 name="stage"
//                 value={formData.stage}
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//             {/* Render questions dynamically */}
//             {questions.map((question, index) => (
//               <Grid item xs={12} key={index}>
//                 <TextField
//                   label={question} // Display the question as the label
//                   name={`question_${index}`} // Unique name for each question
//                   onChange={handleChange}
//                   fullWidth
//                   multiline
//                   rows={2}
//                   InputProps={{
//                     style: {
//                       borderRadius: '20px',
//                       fontWeight: 'bold',
//                     }
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       fontWeight: 'bold',
//                     }
//                   }}
//                   disabled={isDuplicate}
//                 />
//               </Grid>
//             ))}
//             <Grid item xs={12}>
//               <TextField
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
//                 disabled={isDuplicate}
//               />
//             </Grid>
//           </Grid>
//           <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }} disabled={isDuplicate}>
//               Submit Application
//             </Button>
//             <Button onClick={onClose} variant="contained" color="secondary">
//               Close
//             </Button>
//           </div>
//         </form>
//       </Paper>
//     </div>
//   );
// };

// export default Application;
