import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Organisation = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.organisation || {
    name: '',
    website: '',
    logo: null,
    contact_details: '',
    industry_type: '',
    location: '',
    email: localStorage.getItem('userEmail') || '',
    founded_date: '',
    number_of_employees: '',
    annual_revenue: '',
    created_by: '',
  };

  const [formData, setFormData] = useState(initialData);
  const [otp, setOTP] = useState('');
  const [otpDialogOpen, setOTPDialogOpen] = useState(false);
  const [otpError, setOTError] = useState('');

  useEffect(() => {
    if (location.state?.organisation) {
      setFormData(location.state.organisation);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      logo: file,
    });
  };

  const handleOpenOTPDialog = () => {
    setOTPDialogOpen(true);
  };

  const handleCloseOTPDialog = () => {
    setOTPDialogOpen(false);
  };

  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const handleResendOTP = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1/resend-otp/',
        {
          email: formData.email,
          organization_id: localStorage.getItem('organisationId'),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert('OTP Resent successfully');
      } else {
        setOTError('Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      console.error('Error response data:', error.response?.data);
      setOTError('Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'email') {
        data.append('userEmail', formData[key]); // Update 'email' to 'userEmail'
      } else {
        data.append(key, formData[key]);
      }
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1/org/create/',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        }
      );
  
      localStorage.setItem('organisationId', response.data.organisation_id);
      localStorage.setItem('otp', response.data.otp);
      localStorage.setItem('token', token); // Store the token as well
      localStorage.setItem('otp_created_at', response.data.otp_created_at);
      // Check if otp_created_at is available in the response before storing
  
      // alert('Organisation created successfully');
  
      handleOpenOTPDialog();// Open OTP verification dialog
      alert('Organisation created successfully'); 
    } 
    catch (error) {
      console.error('Error creating organisation:', error);
      console.error('Error response data:', error.response?.data);
      alert('Failed to create organisation');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const token = localStorage.getItem('token');
      const organizationId = localStorage.getItem('organisationId');
      const storedOtp = localStorage.getItem('otp');
      const storedOtpCreatedAt = localStorage.getItem('otp_created_at');
      const userEmail = localStorage.getItem('userEmail');
      const otpFromForm = otp; // Assuming 'otp' is the state variable for OTP input
  
      // Debugging logs to ensure values are correctly fetched
      console.log('localStorage token:', token);
      console.log('localStorage organizationId:', organizationId);
      console.log('localStorage storedOtp:', storedOtp);
      console.log('localStorage storedOtpCreatedAt:', storedOtpCreatedAt);
      console.log('localStorage userEmail:', userEmail);
      console.log('otp from form:', otpFromForm);
  
      // Check if all required parameters are present
      if (!(userEmail && otpFromForm && organizationId && storedOtp && storedOtpCreatedAt && token)) {
        console.error('Missing or invalid parameters in localStorage or form state');
        return;
      }
  
      // Make API call to verify OTP
      const otpResponse = await axios.post(
        'http://127.0.0.1:8000/api/v1/verify-otp/',
        {
          userEmail: userEmail,
          organization_id: organizationId,
          otp: otpFromForm,
          stored_otp: storedOtp,
          otp_created_at: storedOtpCreatedAt,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log('localStorage token:', token);
      console.log('localStorage organizationId:', organizationId);
      console.log('localStorage storedOtp:', storedOtp);
      console.log('localStorage storedOtpCreatedAt:', storedOtpCreatedAt);
      console.log('localStorage userEmail:', userEmail);
      console.log('otp from form:', otpFromForm);

      if (otpResponse.status === 200) {
        alert('OTP Verified successfully');
        handleCloseOTPDialog(); // Close OTP verification dialog
        navigate('/home'); // Navigate to home page after OTP verification
      } else {
        setOTError('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      console.error('Error response data:', error.response?.data); // Log server response data
      if (error.response?.data?.message === 'Invalid data, Organization not found') {
        setOTError('Organization not found');
      } else {
        setOTError('Failed to verify OTP');
      }
    }
  };
  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <Paper style={{ padding: '20px', maxWidth: '600px', width: '100%', borderRadius: '25px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
          Create Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Website"
                name="website"
                value={formData.website}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Logo"
                name="logo"
                type="file"
                onChange={handleFileChange}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '20px',
                    fontWeight: 'bold'
                  }
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  },
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Details"
                name="contact_details"
                value={formData.contact_details}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Industry Type"
                name="industry_type"
                value={formData.industry_type}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                fullWidth
                required
                InputProps={{
                  style: {
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    readOnly: true,
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Founded Date"
                type="date"
                name="founded_date"
                value={formData.founded_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontWeight: 'bold',
                  }
                }}
                InputProps={{
                  style: {
                    borderRadius: '20px',
                    fontWeight: 'bold',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Employees"
                type="number"
                name="number_of_employees"
                value={formData.number_of_employees}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Annual Revenue"
                type="number"
                name="annual_revenue"
                value={formData.annual_revenue}
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
              <Button type="submit" variant="contained" sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
        <Dialog open={otpDialogOpen} onClose={handleCloseOTPDialog}>
  <DialogTitle>Enter OTP</DialogTitle>
  <DialogContent>
    <TextField
      label="OTP"
      type="text"
      value={otp}
      onChange={handleOTPChange}
      fullWidth
      required
    />
    {otpError && <Typography color="error">{otpError}</Typography>}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleResendOTP}>Resend OTP</Button>
    <Button onClick={handleVerifyOTP}>Verify OTP</Button>
  </DialogActions>
</Dialog>
      </Paper>
    </div>
  );
};

export default Organisation;
