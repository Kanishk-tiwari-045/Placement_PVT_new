import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Step,
  Stepper,
  StepLabel,
  Autocomplete,
} from "@mui/material";

const Applicant = ({ onClose }) => {
  const [formData, setFormData] = useState({
    applicant: localStorage.getItem('userid') || '',
    highest_qualification: "",
    stream: "",
    year: "",
    education_status: "Finished",
    passing_year: "",
    cgpa: "",
    skills: [],
    address: "NA",
    city: "NA",
    state: "NA",
    pincode: "NA",
    resume: null,
    certificates: [],
    content_type: 16,
  });

  const [activeStep, setActiveStep] = useState(0);
  const [token, setToken] = useState("");
  const [certificateInputs, setCertificateInputs] = useState([{ file: null, name: '' }]);
  const [applicantprofileId, setApplicantId] = useState(localStorage.getItem('applicantprofile_id') || null);
  const [resumeName, setResumeName] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
        const fetchTokenAndUserId = () => {
          const token = localStorage.getItem("token");
          setToken(token);
        };
    
        fetchTokenAndUserId();
      }, []);

      useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/skills/");
                console.log("Fetched skills:", response.data); // Log response data
                let skillsArray = response.data.results;
                if (Array.isArray(skillsArray)) {
                    const formattedSkills = skillsArray.map(skill => ({
                        id: skill.id, 
                        name: skill.name
                    }));
                    setSkillsList(formattedSkills);
                } else {
                    console.error("Fetched skills data is not an array");
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };
    
        fetchSkills();
    }, []);
    
    
  const handleSkillChange = (event, value) => {
    setFormData({ ...formData, skills: value.map(skill => skill.id) });
  };

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      try {
        const response = await axios.post("http://localhost:8000/api/v1/skills/", { name: newSkill });
        setSkillsList([...skillsList, response.data]);
        setNewSkill("");
      } catch (error) {
        console.error("Error adding new skill:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
    if (name === 'resume') {
      setResumeName(files[0].name);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      if (formData.year === "") {
        alert("Please select a year");
        return;
      }
      try {
        const profileData = {
          applicant: formData.applicant,
          highest_qualification: formData.highest_qualification,
          stream: formData.stream,
          year: formData.year,
          education_status: formData.education_status,
          passing_year: formData.passing_year,
          cgpa: formData.cgpa,
          skills: formData.skills,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        };
        let profileResponse;
        if (applicantprofileId) {
          profileResponse = await axios.put(
            `http://localhost:8000/api/v1/applicantprofile/?id=${applicantprofileId}`,
            
            profileData,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          profileResponse = await axios.post(
            "http://localhost:8000/api/v1/applicantprofile/",
            profileData,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const newApplicantId = profileResponse.data.data.id;
          localStorage.setItem('applicantprofile_id', newApplicantId);
          setApplicantId(newApplicantId);
        }
        handleNextStep();
      } catch (error) {
        console.error("Error creating/updating applicant:", error);
        alert("Failed to create/update applicant");
      }
    } else {
      handleNextStep();
    }
  };

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCertificateChange = (index, e) => {
    const { files } = e.target;
    const newCertificates = [...certificateInputs];
    newCertificates[index].file = files[0];
    newCertificates[index].name = files[0].name;
    setCertificateInputs(newCertificates);
  };

  const addCertificateInput = () => {
    setCertificateInputs([...certificateInputs, { file: null, name: '' }]);
  };

  const removeCertificateInput = (index) => {
    if (certificateInputs.length > 1) {
      setCertificateInputs(certificateInputs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const applicantprofileId = localStorage.getItem('applicantprofile_id');
      if (!applicantprofileId) {
        alert("No applicant ID found");
        return;
      }
      const formDataForResume = new FormData();
      formDataForResume.append("attachment_file", formData.resume);
      formDataForResume.append("attachment_type", "resume");
      formDataForResume.append("content_type", formData.content_type);
      formDataForResume.append("object_id", applicantprofileId);
      await axios.post(
        'http://localhost:8000/api/v1/attachment/',
        formDataForResume,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );
      for (let i = 0; i < certificateInputs.length; i++) {
        const certData = new FormData();
        certData.append("attachment_file", certificateInputs[i].file);
        certData.append("attachment_type", "certificates");
        certData.append("content_type", formData.content_type);
        certData.append("object_id", applicantprofileId);
        await axios.post(
          'http://localhost:8000/api/v1/attachment/',
          certData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${token}`,
            },
          }
        );
      }
      alert("Applicant created successfully");
      console.log("Added")
      onClose();
    } catch (error) {
      console.log("Error")
      alert("Failed to attach documents");
      console.error("Error attaching documents:", error);
    }
  };

  const steps = ["Personal Details", "Upload Documents"];

  return (
    <div 
    style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
      }}
      >
      <Paper 
      style={{ 
        padding: "40px", 
        maxWidth: "1200px", 
        width: "100%", 
        borderRadius: "25px", 
        textAlign: "center" }}>
        <Typography variant="h4" gutterBottom style={{ fontFamily: "Roboto", fontWeight: 700 }}>
          Create Applicant Profile
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Highest Qualification" name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Stream" name="stream" value={formData.stream} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Year" name="year" value={formData.year} onChange={handleChange} fullWidth required SelectProps={{ native: true }} InputLabelProps={{shrink: true}}>
                  <option value="">Select the Year</option>
                  {["First", "Second", "Third", "Fourth"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Education Status" name="education_status" value={formData.education_status} onChange={handleChange} fullWidth required SelectProps={{ native: true }}>
                  {["Finished", "Pursuing"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Passing Year" name="passing_year" value={formData.passing_year} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  options={skillsList}
                  getOptionLabel={(option) => option.name}
                  onChange={handleSkillChange}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Skills" placeholder="Select Skills" />
                  )}
                />
                <TextField
                  label="New Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onBlur={handleAddSkill}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} fullWidth required />
              </Grid>
            </Grid>
          )}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    fontFamily: "Roboto",
                  }}
                >
                  Upload Resume
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>
                {resumeName && <Typography>{resumeName}</Typography>}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Certificates</Typography>
                {certificateInputs.map((certificate, index) => (
                  <div key={index}>
                    <Button
                      variant="contained"
                      component="label"
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        fontFamily: "Roboto",
                        marginRight: "10px",
                      }}
                    >
                      Upload Certificate {index + 1}
                      <input
                        type="file"
                        name={`certificate${index}`}
                        onChange={(e) => handleCertificateChange(index, e)}
                        hidden
                      />
                    </Button>
                    {certificate.name && <Typography>{certificate.name}</Typography>}
                    {certificateInputs.length > 1 && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeCertificateInput(index)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="contained"
                  onClick={addCertificateInput}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    fontFamily: "Roboto",
                    marginTop: "10px",
                  }}
                >
                  Add Certificate
                </Button>
              </Grid>
            </Grid>
          )}

          <div style={{ marginTop: "20px" }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} style={{ marginRight: "10px" }}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            )}
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Applicant;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   Step,
//   Stepper,
//   StepLabel,
//   Autocomplete,
// } from "@mui/material";

// const Applicant = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     applicant: localStorage.getItem('userid') || '',
//     highest_qualification: "",
//     stream: "",
//     year: "",
//     education_status: "Finished",
//     passing_year: "",
//     cgpa: "",
//     skills: [],
//     address: "NA",
//     city: "NA",
//     state: "NA",
//     pincode: "NA",
//     resume: null,
//     certificates: [],
//     content_type: 16,
//   });

//   const [activeStep, setActiveStep] = useState(0);
//   const [token, setToken] = useState("");
//   const [certificateInputs, setCertificateInputs] = useState([{ file: null, name: '' }]);
//   const [applicantprofileId, setApplicantId] = useState(localStorage.getItem('applicantprofile_id') || null);
//   const [resumeName, setResumeName] = useState(null);
//   const [skillsList, setSkillsList] = useState([]);
//   const [newSkill, setNewSkill] = useState("");

//   useEffect(() => {
//         const fetchTokenAndUserId = () => {
//           const token = localStorage.getItem("token");
//           setToken(token);
//         };
    
//         fetchTokenAndUserId();
//       }, []);

//       useEffect(() => {
//         const fetchSkills = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8000/api/v1/skills/");
//                 console.log("Fetched skills:", response.data); // Log response data
//                 let skillsArray = response.data.results;
//                 if (Array.isArray(skillsArray)) {
//                     const formattedSkills = skillsArray.map(skill => ({
//                         id: skill.id, 
//                         name: skill.name
//                     }));
//                     setSkillsList(formattedSkills);
//                 } else {
//                     console.error("Fetched skills data is not an array");
//                 }
//             } catch (error) {
//                 console.error("Error fetching skills:", error);
//             }
//         };
    
//         fetchSkills();
//     }, []);
    
    
//   const handleSkillChange = (event, value) => {
//     setFormData({ ...formData, skills: value.map(skill => skill.id) });
//   };

//   const handleAddSkill = async () => {
//     if (newSkill.trim()) {
//       try {
//         const response = await axios.post("http://localhost:8000/api/v1/skills/", { name: newSkill });
//         setSkillsList([...skillsList, response.data]);
//         setNewSkill("");
//       } catch (error) {
//         console.error("Error adding new skill:", error);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files[0],
//     });
//     if (name === 'resume') {
//       setResumeName(files[0].name);
//     }
//   };

//   const handleNext = async (e) => {
//     e.preventDefault();
//     if (activeStep === 0) {
//       if (formData.year === "") {
//         alert("Please select a year");
//         return;
//       }
//       try {
//         const profileData = {
//           applicant: formData.applicant,
//           highest_qualification: formData.highest_qualification,
//           stream: formData.stream,
//           year: formData.year,
//           education_status: formData.education_status,
//           passing_year: formData.passing_year,
//           cgpa: formData.cgpa,
//           skills: formData.skills,
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//         };
//         let profileResponse;
//         if (applicantprofileId) {
//           profileResponse = await axios.put(
//             `http://localhost:8000/api/v1/applicantprofile/?id=${applicantprofileId}`,
            
//             profileData,
//             {
//               headers: {
//                 Authorization:`Token ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         } else {
//           profileResponse = await axios.post(
//             "http://localhost:8000/api/v1/applicantprofile/",
//             profileData,
//             {
//               headers: {
//                 Authorization: `Token ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           const newApplicantId = profileResponse.data.data.id;
//           localStorage.setItem('applicantprofile_id', newApplicantId);
//           setApplicantId(newApplicantId);
//         }
//         handleNextStep();
//       } catch (error) {
//         console.error("Error creating/updating applicant:", error);
//         alert("Failed to create/update applicant");
//       }
//     } else {
//       handleNextStep();
//     }
//   };

//   const handleNextStep = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleCertificateChange = (index, e) => {
//     const { files } = e.target;
//     const newCertificates = [...certificateInputs];
//     newCertificates[index].file = files[0];
//     newCertificates[index].name = files[0].name;
//     setCertificateInputs(newCertificates);
//   };

//   const addCertificateInput = () => {
//     setCertificateInputs([...certificateInputs, { file: null, name: '' }]);
//   };

//   const removeCertificateInput = (index) => {
//     if (certificateInputs.length > 1) {
//       setCertificateInputs(certificateInputs.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const applicantprofileId = localStorage.getItem('applicantprofile_id');
//       if (!applicantprofileId) {
//         alert("No applicant ID found");
//         return;
//       }
//       const formDataForResume = new FormData();
//       formDataForResume.append("attachment_file", formData.resume);
//       formDataForResume.append("attachment_type", "resume");
//       formDataForResume.append("content_type", formData.content_type);
//       formDataForResume.append("object_id", applicantprofileId);
//       await axios.post(
//         'http://localhost:8000/api/v1/attachment/',
//         formDataForResume,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       for (let i = 0; i < certificateInputs.length; i++) {
//         const certData = new FormData();
//         certData.append("attachment_file", certificateInputs[i].file);
//         certData.append("attachment_type", "certificates");
//         certData.append("content_type", formData.content_type);
//         certData.append("object_id", applicantprofileId);
//         await axios.post(
//          'http://localhost:8000/api/v1/attachment/',
//           certData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//       }
//       alert("Applicant created successfully");
//       onClose();
//     } catch (error) {
//       console.error("Error attaching documents:", error);
//       alert("Failed to attach documents");
//     }
//   };

//   const steps = ["Personal Details", "Upload Documents"];

//   return (
//     <div 
//     style={{ 
//       display: "flex", 
//       justifyContent: "center", 
//       alignItems: "center" 
//       }}
//       >
//       <Paper 
//       style={{ 
//         padding: "40px", 
//         maxWidth: "1200px", 
//         width: "100%", 
//         borderRadius: "25px", 
//         textAlign: "center" }}>
//         <Typography variant="h4" gutterBottom style={{ fontFamily: "Roboto", fontWeight: 700 }}>
//           Create Applicant Profile
//         </Typography>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//         <form onSubmit={handleSubmit}>
//           {activeStep === 0 && (
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="Highest Qualification" name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="Stream" name="stream" value={formData.stream} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField select label="Year" name="year" value={formData.year} onChange={handleChange} fullWidth required SelectProps={{ native: true }}>
//                   <option value="">Select the Year</option>
//                   {["First", "Second", "Third", "Fourth"].map((option) => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField select label="Education Status" name="education_status" value={formData.education_status} onChange={handleChange} fullWidth required SelectProps={{ native: true }}>
//                   {["Finished", "Pursuing"].map((option) => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="Passing Year" name="passing_year" value={formData.passing_year} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Autocomplete
//                   multiple
//                   options={skillsList}
//                   getOptionLabel={(option) => option.name}
//                   onChange={handleSkillChange}
//                   renderInput={(params) => (
//                     <TextField {...params} variant="outlined" label="Skills" placeholder="Select Skills" />
//                   )}
//                 />
//                 <TextField
//                   label="New Skill"
//                   value={newSkill}
//                   onChange={(e) => setNewSkill(e.target.value)}
//                   onBlur={handleAddSkill}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth required />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} fullWidth required />
//               </Grid>
//             </Grid>
//           )}
//           {activeStep === 1 && (
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   component="label"
//                   style={{
//                     backgroundColor: "#007bff",
//                     color: "#fff",
//                     fontFamily: "Roboto",
//                   }}
//                 >
//                   Upload Resume
//                   <input
//                     type="file"
//                     name="resume"
//                     onChange={handleFileChange}
//                     hidden
//                   />
//                 </Button>
//                 {resumeName && <Typography>{resumeName}</Typography>}
//               </Grid>

//               <Grid item xs={12}>
//                 <Typography variant="h6">Certificates</Typography>
//                 {certificateInputs.map((certificate, index) => (
//                   <div key={index}>
//                     <Button
//                       variant="contained"
//                       component="label"
//                       style={{
//                         backgroundColor: "#007bff",
//                         color: "#fff",
//                         fontFamily: "Roboto",
//                         marginRight: "10px",
//                       }}
//                     >
//                       Upload Certificate {index + 1}
//                       <input
//                         type="file"
//                         name={`certificate${index}`}
//                         onChange={(e) => handleCertificateChange(index, e)}
//                         hidden
//                       />
//                     </Button>
//                     {certificate.name && <Typography>{certificate.name}</Typography>}
//                     {certificateInputs.length > 1 && (
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => removeCertificateInput(index)}
//                       >
//                         Delete
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//                 <Button
//                   variant="contained"
//                   onClick={addCertificateInput}
//                   style={{
//                     backgroundColor: "#007bff",
//                     color: "#fff",
//                     fontFamily: "Roboto",
//                     marginTop: "10px",
//                   }}
//                 >
//                   Add Certificate
//                 </Button>
//               </Grid>
//             </Grid>
//           )}

//           <div style={{ marginTop: "20px" }}>
//             {activeStep > 0 && (
//               <Button onClick={handleBack} style={{ marginRight: "10px" }}>
//                 Back
//               </Button>
//             )}
//             {activeStep < steps.length - 1 && (
//               <Button variant="contained" color="primary" onClick={handleNext}>
//                 Next
//               </Button>
//             )}
//             {activeStep === steps.length - 1 && (
//               <Button variant="contained" color="primary" type="submit">
//                 Submit
//               </Button>
//             )}
//           </div>
//         </form>
//       </Paper>
//     </div>
//   );
// };

// export default Applicant;