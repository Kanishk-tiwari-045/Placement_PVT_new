import React from 'react';
import { jsPDF } from 'jspdf';
import { Button, Paper, Typography, Grid } from '@mui/material';

const ApplicantPreview = ({ formData, resumePreview, certificateInputs, onClose }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text('Applicant Profile', 10, 10);
    doc.text(`Highest Qualification: ${formData.highest_qualification}`, 10, 20);
    doc.text(`Stream: ${formData.stream}`, 10, 30);
    doc.text(`Year: ${formData.year}`, 10, 40);
    doc.text(`Education Status: ${formData.education_status}`, 10, 50);
    doc.text(`Passing Year: ${formData.passing_year}`, 10, 60);
    doc.text(`CGPA: ${formData.cgpa}`, 10, 70);
    doc.text(`Skills: ${formData.skills.join(', ')}`, 10, 80);
    doc.text(`Address: ${formData.address}`, 10, 90);
    doc.text(`City: ${formData.city}`, 10, 100);
    doc.text(`State: ${formData.state}`, 10, 110);
    doc.text(`Pincode: ${formData.pincode}`, 10, 120);
    
    // Add Resume
    if (resumePreview) {
      doc.text(`Resume: ${formData.resume.name}`, 10, 130);
    }

    // Add Certificates
    certificateInputs.forEach((cert, index) => {
      doc.text(`Certificate ${index + 1}: ${cert.file.name}`, 10, 140 + (index * 10));
    });

    doc.save('applicant-profile.pdf');
  };

  return (
    <Paper style={{ padding: '40px', maxWidth: '800px', margin: 'auto', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Applicant Profile Preview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Personal Details</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Highest Qualification: {formData.highest_qualification}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Stream: {formData.stream}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Year: {formData.year}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Education Status: {formData.education_status}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Passing Year: {formData.passing_year}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>CGPA: {formData.cgpa}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Skills: {formData.skills.join(', ')}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography>Address: {formData.address}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography>City: {formData.city}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography>State: {formData.state}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography>Pincode: {formData.pincode}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Typography variant="h6">Uploaded Documents</Typography>
        </Grid>
        {resumePreview && (
          <Grid item xs={12}>
            <Typography>Resume: <a href={resumePreview} target="_blank" rel="noopener noreferrer">{formData.resume.name}</a></Typography>
          </Grid>
        )}
        {certificateInputs.map((cert, index) => (
          <Grid item xs={12} key={index}>
            <Typography>Certificate {index + 1}: <a href={cert.preview} target="_blank" rel="noopener noreferrer">{cert.file.name}</a></Typography>
          </Grid>
        ))}
      </Grid>

      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={generatePDF}>
          Download PDF
        </Button>
        <Button variant="contained" onClick={onClose} style={{ marginLeft: '10px' }}>
          Close
        </Button>
      </div>
    </Paper>
  );
};

export default ApplicantPreview;
