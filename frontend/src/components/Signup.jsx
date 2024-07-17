// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Signup.css';

// const Signup = ({ onClose, onRoleChange }) => {
//   const navigate = useNavigate();

//   const [isRightPanelActive, setIsRightPanelActive] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phone_number, setPhoneNumber] = useState('');
//   const [isOrganization, setIsOrganization] = useState(false);
//   const [signupMessage, setSignupMessage] = useState('');
//   const [isSigningUp, setIsSigningUp] = useState(false);

//   const handleSignInClick = () => {
//     setIsRightPanelActive(false);
//   };

//   const handleSignUpClick = () => {
//     setIsRightPanelActive(true);
//   };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
//         email,
//         password,
//       });
//       console.log('Sign In Success:', response.data);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userEmail', email);
//       localStorage.setItem('userid', response.data.id);

//       onRoleChange(response.data.isOrg ? 'Organisation' : 'applicant');
//       navigate('/');
//     } catch (error) {
//       console.error('Sign In Error:', error);
//       alert('Invalid credentials');
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setIsSigningUp(true);
//     try {
//       if (password !== confirmPassword) {
//         alert('Passwords do not match');
//         return;
//       }
//       const response = await axios.post('http://localhost:8000/api/v1/auth/signup/', {
//         email,
//         password,
//         phone_number,
//         name,
//         isOrg: isOrganization,
//       });

//       console.log('Sign Up Success:', response.data);
//       localStorage.setItem('userEmail', email);

//       // Remove the role change to prevent immediate navigation
//       // onRoleChange(isOrganization ? 'Organisation' : 'applicant');
//       setIsRightPanelActive(false);
//       setSignupMessage('Signup successful! Please sign in to proceed.');
//     } catch (error) {
//       console.error('Sign Up Error:', error);
//       if (error.response && error.response.status === 400) {
//         if (error.response.data.email) {
//           alert('User with this email already exists.');
//         } else {
//           alert('Signup functionality not implemented.');
//         }
//       } else {
//         alert('Signup functionality not implemented.');
//       }
//     } finally {
//       setIsSigningUp(false);
//     }
//   };

//   return (
//     <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
//       <div className="form-container sign-up-container">
//         <form action="#" onSubmit={handleSignup}>
//           <h1>Create Account</h1>
//           <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//           <span>or use your email for registration</span>
//           <input
//             style={{ borderRadius: '20px' }}
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <input

//             style={{ borderRadius: '20px' }}
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="text"
//             placeholder="Phone Number"
//             value={phone_number}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//           <label className="wrap-check-64">
//             <input
//               type="checkbox"
//               checked={isOrganization}
//               onChange={(e) => setIsOrganization(e.target.checked)}
//               className="switch-input"
//             />
//             <span className="slider round" style={{ marginTop: '10px', marginBottom: '17px' }}></span>
//             <span className="checkbox-text" style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px', marginBottom: '17px' }}>As Organization</span>
//           </label>
//           <button type="submit">Sign Up</button>
//         </form>
//       </div>

//       <div className="form-container sign-in-container">
//         <form action="#" onSubmit={handleSignIn}>
//           <h1>Sign in</h1>
//           <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//           <span>or use your account</span>
//           <input
//             style={{ borderRadius: '20px' }}
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <a href="#">Forgot your password?</a>
//           <button type="submit">Sign In</button>
//           {signupMessage && <p className="signup-message">{signupMessage}</p>}
//         </form>
//       </div>

//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Welcome Back!</h1>
//             <p>To keep connected with us please login with your personal info</p>
//             <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Hello, Friend!</h1>
//             <p>Enter your personal details and start your journey with us</p>
//             <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Signup.css';

// const Signup = ({ onClose, onRoleChange }) => {
//   const navigate = useNavigate();

//   const [isRightPanelActive, setIsRightPanelActive] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [phone_number, setPhoneNumber] = useState('');
//   const [isOrganization, setIsOrganization] = useState(false);
//   const [signupMessage, setSignupMessage] = useState('');
//   const [isSigningUp, setIsSigningUp] = useState(false);

//   const handleSignInClick = () => {
//     setIsRightPanelActive(false);
//   };

//   const handleSignUpClick = () => {
//     setIsRightPanelActive(true);
//   };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
//         email,
//         password,
//       });
//       console.log('Sign In Success:', response.data);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userEmail', email);
//       localStorage.setItem('userid', response.data.id);

//       onRoleChange(response.data.isOrg ? 'Organisation' : 'applicant');
//       navigate('/');
//     } catch (error) {
//       console.error('Sign In Error:', error);
//       alert('Invalid credentials');
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setIsSigningUp(true);
//     try {
//       const response = await axios.post('http://localhost:8000/api/v1/auth/signup/', {
//         email,
//         password,
//         phone_number,
//         name,
//         isOrg: isOrganization,
//       });

//       console.log('Sign Up Success:', response.data);
//       localStorage.setItem('userEmail', email);

//       setIsRightPanelActive(false);
//       setSignupMessage('Signup successful! Please sign in to proceed.');
//     } catch (error) {
//       console.error('Sign Up Error:', error);
//       if (error.response && error.response.status === 400) {
//         if (error.response.data.email) {
//           alert('User with this email already exists.');
//         } else {
//           alert('Signup functionality not implemented.');
//         }
//       } else {
//         alert('Signup functionality not implemented.');
//       }
//     } finally {
//       setIsSigningUp(false);
//     }
//   };

//   return (
//     <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
//       <div className="form-container sign-up-container">
//         <form action="#" onSubmit={handleSignup}>
//           <h1>Create Account</h1>
//           <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//           <span>or use your email for registration</span>
//           <input
//             style={{ borderRadius: '20px' }}
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="text"
//             placeholder="Phone Number"
//             value={phone_number}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//           <label className="wrap-check-64">
//             <input
//               type="checkbox"
//               checked={isOrganization}
//               onChange={(e) => setIsOrganization(e.target.checked)}
//               className="switch-input"
//             />
//             <span className="slider round" style={{ marginTop: '10px', marginBottom: '17px' }}></span>
//             <span className="checkbox-text" style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px', marginBottom: '17px' }}>As Organization</span>
//           </label>
//           <button type="submit">Sign Up</button>
//         </form>
//       </div>

//       <div className="form-container sign-in-container">
//         <form action="#" onSubmit={handleSignIn}>
//           <h1>Sign in</h1>
//           <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//           <span>or use your account</span>
//           <input
//             style={{ borderRadius: '20px' }}
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             style={{ borderRadius: '20px' }}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <a href="#">Forgot your password?</a>
//           <button type="submit">Sign In</button>
//           {signupMessage && <p className="signup-message">{signupMessage}</p>}
//         </form>
//       </div>

//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Welcome Back!</h1>
//             <p>To keep connected with us please login with your personal info</p>
//             <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Hello, Friend!</h1>
//             <p>Enter your personal details and start your journey with us</p>
//             <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = ({ onClose, onRoleChange }) => {
  const navigate = useNavigate();

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [isOrganization, setIsOrganization] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        email,
        password,
      });
      console.log('Sign In Success:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userid', response.data.id);

      onRoleChange(response.data.isOrg ? 'Organisation' : 'applicant');
      navigate('/');
    } catch (error) {
      console.error('Sign In Error:', error);
      alert('Invalid credentials');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    try {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const response = await axios.post('http://localhost:8000/api/v1/auth/signup/', {
        email,
        password,
        phone_number,
        name,
        isOrg: isOrganization,
      });

      console.log('Sign Up Success:', response.data);
      localStorage.setItem('userEmail', email);

      setIsRightPanelActive(false);
      setSignupMessage('Signup successful! Please sign in to proceed.');
    } catch (error) {
      console.error('Sign Up Error:', error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.email) {
          alert('User with this email already exists.');
        } else {
          alert('Signup functionality not implemented.');
        }
      } else {
        alert('Signup functionality not implemented.');
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form action="#" onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input
            style={{ borderRadius: '20px' }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={{ borderRadius: '20px' }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ position: 'relative' }}>
          <input
          style={{ borderRadius: '20px', paddingRight: '40px' }} // Add padding for the eye icon
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          />
          <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </span>
            </div>
          <input
            style={{ borderRadius: '20px' }}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={{ borderRadius: '20px' }}
            type="text"
            placeholder="Phone Number"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <label className="wrap-check-64">
            <input
              type="checkbox"
              checked={isOrganization}
              onChange={(e) => setIsOrganization(e.target.checked)}
              className="switch-input"
            />
            <span className="slider round" style={{ marginTop: '10px', marginBottom: '17px' }}></span>
            <span className="checkbox-text" style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px', marginBottom: '17px' }}>As Organization</span>
          </label>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form action="#" onSubmit={handleSignIn}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input
            style={{ borderRadius: '20px' }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div style={{ position: 'relative' }}>
            <input
            style={{ borderRadius: '20px' }}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
              </div>
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
          {signupMessage && <p className="signup-message">{signupMessage}</p>}
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;