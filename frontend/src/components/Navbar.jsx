// import React, { useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Signup from './Signup';
// import Organisation from './Organisation';
// import Job from './Job';
// import JobsList from "./JobsList";
// import Applicant from './Applicant';

// const Navbar = ({ setActiveTab }) => {
//   const [isSignupOpen, setIsSignupOpen] = useState(false);
//   const [isOrganisationOpen, setIsOrganisationOpen] = useState(false);
//   const [isJobOpen, setIsJobOpen] = useState(false);
//   const [isApplicantOpen, setIsApplicantOpen] = useState(false); // State for Applicant form
//   const [isApplicationOpen, setIsApplicationOpen] = useState(false); // State for Applicant form
//   const [dimBackground, setDimBackground] = useState(false);
//   const [position, setPosition] = useState({
//     left: 0,
//     width: 0,
//     opacity: 0,
//   });

//   const signupFormRef = useRef(null);
//   const organisationFormRef = useRef(null);
//   const jobFormRef = useRef(null);
//   const applicantFormRef = useRef(null);
//   const applicationFormRef = useRef(null); // Ref for Applicant form

//   const [role, setRole] = useState(""); // State to track the current logged-in role

//   const toggleSignup = () => {
//     setIsSignupOpen(!isSignupOpen);
//     setDimBackground(!dimBackground);
//   };

//   const toggleJob = () => {
//     setIsJobOpen(!isJobOpen);
//     setDimBackground(!dimBackground);
//   };

//   const toggleOrganisation = () => {
//     setIsOrganisationOpen(!isOrganisationOpen);
//     setDimBackground(!dimBackground);
//   };

//   const toggleApplicant = () => {
//     setIsApplicantOpen(!isApplicantOpen);
//     setDimBackground(!dimBackground);
//   };

//   const toggleApplication = () => {
//     setIsApplicationOpen(!isApplicationOpen);
//     setDimBackground(!dimBackground);
//   };

//   const handleSignupClose = (e) => {
//     if (signupFormRef.current && signupFormRef.current.contains(e.target)) {
//       return;
//     }
//     setIsSignupOpen(false);
//     setDimBackground(false);
//   };

//   const handleOrganisationClose = (e) => {
//     if (organisationFormRef.current && organisationFormRef.current.contains(e.target)) {
//       return;
//     }
//     setIsOrganisationOpen(false);
//     setDimBackground(false);
//   };

//   const handleJobClose = (e) => {
//     if (jobFormRef.current && jobFormRef.current.contains(e.target)) {
//       return;
//     }
//     setIsJobOpen(false);
//     setDimBackground(false);
//   };

//   const handleApplicantClose = (e) => {
//     if (applicantFormRef.current && applicantFormRef.current.contains(e.target)) {
//       return;
//     }
//     setIsApplicantOpen(false);
//     setDimBackground(false);
//   };

//   const handleApplicationClose = (e) => {
//     if (applicationFormRef.current && applicationFormRef.current.contains(e.target)) {
//       return;
//     }
//     setIsApplicationOpen(false);
//     setDimBackground(false);
//   };

//   // Function to change role to "applicant" if the checkbox is not checked
//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//     setIsSignupOpen(false); // Close signup form after role change
//     setDimBackground(false); // Reset dim background
//   };

//   return (
//     <div className="relative z-50">
//       <div className="bg-gray-100 py-4 fixed top-0 left-0 right-0 w-full">
//         <div className="w-full flex justify-between items-center px-4">
//           <ul
//             onMouseLeave={() => {
//               if (!isSignupOpen && !isOrganisationOpen && !isJobOpen && !isApplicantOpen && !isApplicationOpen) {
//                 setPosition((prev) => ({
//                   ...prev,
//                   opacity: 0,
//                 }));
//               }
//             }}
//             className="relative flex rounded-full border-4 border-blue-700 bg-transparent p-1 w-full items-center"
//           >
//             <div className="flex items-center mr-6">
//               <lord-icon
//                 src="https://cdn.lordicon.com/wmwqvixz.json"
//                 trigger="hover"
//                 style={{ width: '40px', height: '40px', marginLeft: '10px' }}
//               ></lord-icon>
//               <div className="ml-4 font-bold text-lg">
//                 Placement-Cell
//               </div>
//             </div>
//             <div className="flex justify-center items-center flex-grow">
//             <Tab setPosition={setPosition} setActiveTab={setActiveTab}>Home</Tab>
//               {role === "Organisation" && (
//                 <>
//                   <Tab setPosition={setPosition} setActiveTab={toggleOrganisation}>OrgProfile</Tab>
//                   <Tab setPosition={setPosition} setActiveTab={toggleJob}>Job</Tab>
//                 </>
//               )}
//               {role === "applicant" && (
//                 <>
//                   <Tab setPosition={setPosition} setActiveTab={toggleApplicant}>UserProfile</Tab>
//                   <Tab setPosition={setPosition} setActiveTab={toggleApplication}>Jobs</Tab>
//                 </>
//               )}
//               {role !== "Organisation" && role !== "applicant" && (
//                 <>
//                   <Tab setPosition={setPosition} setActiveTab={setActiveTab}>About</Tab>
//                   <Tab setPosition={setPosition} setActiveTab={setActiveTab}>Contact</Tab>
//                 </>
//               )}
//               <Tab setPosition={setPosition} setActiveTab={toggleSignup}>Signin</Tab>
//             </div>
//             <Cursor position={position} />
//             <motion.input
//               type="text"
//               placeholder="Search"
//               className="border border-gray-400 w-80 rounded-md py-1 px-3 mr-6"
//               whileHover={{ scale: 1.1 }}
//             />
//             <div className="ml-1 mr-2">
//               <lord-icon
//                 src="https://cdn.lordicon.com/ojnjgkun.json"
//                 trigger="hover"
//                 style={{ width: '40px', height: '40px' }}
//               ></lord-icon>
//             </div>
//             <div className="ml-1 mr-2">
//               <lord-icon
//                 src="https://cdn.lordicon.com/lznlxwtc.json"
//                 trigger="hover"
//                 style={{ width: '40px', height: '40px' }}
//               ></lord-icon>
//             </div>
//           </ul>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isSignupOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: dimBackground ? 1 : 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50"
//             onClick={handleSignupClose}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-transparent rounded-lg p-6 z-50"
//               style={{ minWidth: '300px' }}
//               ref={signupFormRef}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Signup onClose={handleSignupClose} onRoleChange={handleRoleChange} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isJobOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: dimBackground ? 1 : 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50"
//             onClick={handleJobClose}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-transparent rounded-lg p-6 z-50"
//               style={{
//                 maxHeight: 'calc(100vh - 80px)', 
//                 overflow: 'auto',
//                 marginTop: '80px',
//               }}
//               ref={jobFormRef}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Job onClose={handleJobClose} onRoleChange={handleRoleChange} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isOrganisationOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: dimBackground ? 1 : 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50"
//             onClick={handleOrganisationClose}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-transparent rounded-lg p-6 z-50"
//               style={{
//                 maxHeight: 'calc(100vh - 80px)', 
//                 overflow: 'auto',
//                 marginTop: '80px',
//               }}
//               ref={organisationFormRef}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Organisation onClose={handleOrganisationClose} onRoleChange={handleRoleChange} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isApplicantOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: dimBackground ? 1 : 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50"
//             onClick={handleApplicantClose}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-transparent rounded-lg p-6 z-50"
//               style={{
//                 maxHeight: 'calc(100vh - 80px)', 
//                 overflow: 'auto',
//                 marginTop: '80px',
//               }}
//               ref={applicantFormRef}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Applicant onClose={handleApplicantClose} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isApplicationOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: dimBackground ? 1 : 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50"
//             onClick={handleApplicationClose}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-transparent rounded-lg p-6 z-50"
//               style={{
//                 maxHeight: 'calc(100vh - 80px)', 
//                 overflow: 'auto',
//                 marginTop: '80px',
//               }}
//               ref={applicationFormRef}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <JobsList onClose={handleApplicationClose} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const Tab = ({ children, setPosition, setActiveTab }) => {
//   const ref = useRef(null);
//   return (
//     <li
//       ref={ref}
//       onMouseEnter={() => {
//         if (!ref?.current) return;

//         const { width } = ref.current.getBoundingClientRect();

//         setPosition({
//           left: ref.current.offsetLeft,
//           width,
//           opacity: 1,
//         });
//       }}
//       onClick={() => setActiveTab(children)}
//       className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs font-medium text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
//     >
//       {children}
//     </li>
//   );
// };

// const Cursor = ({ position }) => {
//   return (
//     <motion.li
//       animate={{
//         ...position,
//       }}
//       className="absolute z-0 h-7 rounded-full md:h-12 text-white"
//       style={{
//         backgroundColor: `rgba(50, 50, 50, 0.9999)`,
//         width: "100px",
//       }}
//     />
//   );
// };

// export default Navbar;


import React, { useRef, useState } from "react"; 

import { motion, AnimatePresence } from "framer-motion"; 

import Signup from './Signup'; 

import Organisation from './Organisation'; 

import Job from './Job'; 

import Jobslist from './JobsList'; 

import ApplicationList from './ApplicationList'; 

import Applicant from './Applicant'; 

import Applied from './Applied';

 

const Navbar = ({ setActiveTab }) => { 

  const [isSignupOpen, setIsSignupOpen] = useState(false); 

  const [isOrganisationOpen, setIsOrganisationOpen] = useState(false); 

  const [isJobOpen, setIsJobOpen] = useState(false); 

  const [isApplicantOpen, setIsApplicantOpen] = useState(false); // State for Applicant form 

  const [isAppliedOpen, setIsAppliedOpen] = useState(false); // State for Applicant form 

  const [isApplicationOpen, setIsApplicationOpen] = useState(false); 

  const [isApplicationListOpen, setIsApplicationListOpen] = useState(false); // State for Applicant form 

  const [dimBackground, setDimBackground] = useState(false); 

  const [position, setPosition] = useState({ 

    left: 0, 

    width: 0, 

    opacity: 0, 

  }); 

 

  const signupFormRef = useRef(null); 

  const organisationFormRef = useRef(null); 

  const jobFormRef = useRef(null); 

  const applicantFormRef = useRef(null); 

  const applicationFormRef = useRef(null); 

  const applicationlistFormRef = useRef(null); // Ref for Applicant form 

  const appliedFormRef = useRef(null); // Ref for Applicant form

  const [role, setRole] = useState(""); // State to track the current logged-in role 

 

  const toggleSignup = () => { 

    setIsSignupOpen(!isSignupOpen); 

    setDimBackground(!dimBackground); 

  }; 

  const toggleApplied = () => {
    setIsAppliedOpen(!isAppliedOpen);
    setDimBackground(!dimBackground);
  }

  const toggleJob = () => { 

    setIsJobOpen(!isJobOpen); 

    setDimBackground(!dimBackground); 

  }; 

 

  const toggleOrganisation = () => { 

    setIsOrganisationOpen(!isOrganisationOpen); 

    setDimBackground(!dimBackground); 

  }; 

 

  const toggleApplicant = () => { 

    setIsApplicantOpen(!isApplicantOpen); 

    setDimBackground(!dimBackground); 

  }; 

 

  const toggleApplication = () => { 

    setIsApplicationOpen(!isApplicationOpen); 

    setDimBackground(!dimBackground); 

  }; 

 

  const toggleApplicationList = () => { 

    setIsApplicationListOpen(!isApplicationListOpen); 

    setDimBackground(!dimBackground); 

  }; 

 

  const handleSignupClose = (e) => { 

    if (signupFormRef.current && signupFormRef.current.contains(e.target)) { 

      return; 

    } 

    setIsSignupOpen(false); 

    setDimBackground(false); 

  }; 

  const handleOrganisationClose = (e) => { 

    if (organisationFormRef.current && organisationFormRef.current.contains(e.target)) { 

      return; 

    } 

    setIsOrganisationOpen(false); 

    setDimBackground(false); 

  }; 

 

  const handleJobClose = (e) => { 

    if (jobFormRef.current && jobFormRef.current.contains(e.target)) { 

      return; 

    } 

    setIsJobOpen(false); 

    setDimBackground(false); 

  }; 

 

  const handleApplicantClose = (e) => { 

    if (applicantFormRef.current && applicantFormRef.current.contains(e.target)) { 

      return; 

    } 

    setIsApplicantOpen(false); 

    setDimBackground(false); 

  }; 

 

  const handleApplicationClose = (e) => { 

    if (applicationFormRef.current && applicationFormRef.current.contains(e.target)) { 

      return; 

    } 

    setIsApplicationOpen(false); 

    setDimBackground(false); 

  }; 

  const handleAppliedClose = (e) => {

    if (appliedFormRef.current && appliedFormRef.current.contains(e.target)) {

      return;
    }
    setIsAppliedOpen(false);
    setDimBackground(false);
  };

  const handleApplicationListClose = (e) => { 

    if (applicationlistFormRef.current && applicationlistFormRef.current.contains(e.target)) { 

      return; 

    } 

    setIsApplicationListOpen(false); 

    setDimBackground(false); 

  }; 

 

  // Function to change role to "applicant" if the checkbox is not checked 

  const handleRoleChange = (newRole) => { 

    setRole(newRole); 

    setIsSignupOpen(false); // Close signup form after role change 

    setDimBackground(false); // Reset dim background 

  }; 

 

  return ( 

    <div className="relative z-50"> 

      <div className="bg-gray-100 py-4 fixed top-0 left-0 right-0 w-full"> 

        <div className="w-full flex justify-between items-center px-4"> 

          <ul 

            onMouseLeave={() => { 

              if (!isSignupOpen && !isOrganisationOpen && !isJobOpen && !isApplicantOpen && !isApplicationOpen && !isApplicationListOpen && !isAppliedOpen) { 

                setPosition((prev) => ({ 

                  ...prev, 

                  opacity: 0, 

                })); 

              } 

            }} 

            className="relative flex rounded-full border-4 border-blue-700 bg-transparent p-1 w-full items-center" 

          > 

            <div className="flex items-center mr-6"> 

              <lord-icon 

                src="https://cdn.lordicon.com/wmwqvixz.json" 

                trigger="hover" 

                style={{ width: '40px', height: '40px', marginLeft: '10px' }} 

              ></lord-icon> 

              <div className="ml-4 font-bold text-lg"> 

                Placement-Cell 

              </div> 

            </div> 

            <div className="flex justify-center items-center flex-grow"> 

            <Tab setPosition={setPosition} setActiveTab={setActiveTab}>Home</Tab> 

              {role === "Organisation" && ( 

                <> 

                  <Tab setPosition={setPosition} setActiveTab={toggleOrganisation}>OrgProfile</Tab> 

                  <Tab setPosition={setPosition} setActiveTab={toggleJob}>Job</Tab> 

                  <Tab setPosition={setPosition} setActiveTab={toggleApplicationList}>Applications</Tab> 

                </> 

              )} 

              {role === "applicant" && ( 

                <> 

                  <Tab setPosition={setPosition} setActiveTab={toggleApplicant}>UserProfile</Tab> 

                  <Tab setPosition={setPosition} setActiveTab={toggleApplication}>Jobs</Tab> 

                  <Tab setPosition={setPosition} setActiveTab={toggleApplied}>Applied</Tab>

                </> 

              )} 

              {role !== "Organisation" && role !== "applicant" && ( 

                <> 

                  <Tab setPosition={setPosition} setActiveTab={setActiveTab}>About</Tab> 

                  <Tab setPosition={setPosition} setActiveTab={setActiveTab}>Contact</Tab> 

                </> 

              )} 

              <Tab setPosition={setPosition} setActiveTab={toggleSignup}>Signin</Tab> 

            </div> 

            <Cursor position={position} /> 

            <motion.input 

              type="text" 

              placeholder="Search" 

              className="border border-gray-400 w-80 rounded-md py-1 px-3 mr-6" 

              whileHover={{ scale: 1.1 }} 

            /> 

            <div className="ml-1 mr-2"> 

              <lord-icon 

                src="https://cdn.lordicon.com/ojnjgkun.json" 

                trigger="hover" 

                style={{ width: '40px', height: '40px' }} 

              ></lord-icon> 

            </div> 

            <div className="ml-1 mr-2"> 

              <lord-icon 

                src="https://cdn.lordicon.com/lznlxwtc.json" 

                trigger="hover" 

                style={{ width: '40px', height: '40px' }} 

              ></lord-icon> 

            </div> 

          </ul> 

        </div> 

      </div> 

 

      <AnimatePresence> 

        {isSignupOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 1 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleSignupClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ minWidth: '300px' }} 

              ref={signupFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <Signup onClose={handleSignupClose} onRoleChange={handleRoleChange} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

 

      <AnimatePresence> 

        {isJobOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 0.5 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleJobClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ 

                maxHeight: 'calc(100vh - 80px)',  

                overflow: 'auto', 

                marginTop: '80px', 

              }} 

              ref={jobFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <Job onClose={handleJobClose} onRoleChange={handleRoleChange} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

 

      <AnimatePresence> 

        {isOrganisationOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 0.5 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleOrganisationClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ 

                maxHeight: 'calc(100vh - 80px)',  

                overflow: 'auto', 

                marginTop: '80px', 

              }} 

              ref={organisationFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <Organisation onClose={handleOrganisationClose} onRoleChange={handleRoleChange} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

 

      <AnimatePresence> 

        {isApplicantOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 0.5 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleApplicantClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ 

                maxHeight: 'calc(100vh - 80px)',  

                overflow: 'auto', 

                marginTop: '80px', 

              }} 

              ref={applicantFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <Applicant onClose={handleApplicantClose} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

 

      <AnimatePresence> 

        {isApplicationOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 0.5 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleApplicationClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ 

                maxHeight: 'calc(100vh - 80px)',  

                overflow: 'auto', 

                marginTop: '80px', 

              }} 

              ref={applicationFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <Jobslist onClose={handleApplicationClose} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

      <AnimatePresence> 

        {isApplicationListOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 0.5 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleApplicationListClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ 

                maxHeight: 'calc(100vh - 80px)',  

                overflow: 'auto', 

                marginTop: '80px', 

              }} 

              ref={applicationlistFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <ApplicationList onClose={handleApplicationListClose} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

      <AnimatePresence> 

        {isAppliedOpen && ( 

          <motion.div 

            initial={{ opacity: 0 }} 

            animate={{ opacity: dimBackground ? 1 : 0.5 }} 

            exit={{ opacity: 0 }} 

            transition={{ duration: 0.3 }} 

            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" 

            onClick={handleAppliedClose} 

          > 

            <motion.div 

              initial={{ opacity: 0, scale: 0.8 }} 

              animate={{ opacity: 1, scale: 1 }} 

              exit={{ opacity: 0, scale: 0.8 }} 

              transition={{ duration: 0.3 }} 

              className="bg-transparent rounded-lg p-6 z-50" 

              style={{ 

                maxHeight: 'calc(100vh - 80px)',  

                overflow: 'auto', 

                marginTop: '80px', 

              }} 

              ref={appliedFormRef} 

              onClick={(e) => e.stopPropagation()} 

            > 

              <Applied onClose={handleAppliedClose} /> 

            </motion.div> 

          </motion.div> 

        )} 

      </AnimatePresence> 

    </div> 

  ); 

}; 

 

const Tab = ({ children, setPosition, setActiveTab }) => { 

  const ref = useRef(null); 

  return ( 

    <li 

      ref={ref} 

      onMouseEnter={() => { 

        if (!ref?.current) return; 

 

        const { width } = ref.current.getBoundingClientRect(); 

 

        setPosition({ 

          left: ref.current.offsetLeft, 

          width, 

          opacity: 1, 

        }); 

      }} 

      onClick={() => setActiveTab(children)} 

      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs font-medium text-white mix-blend-difference md:px-5 md:py-3 md:text-base" 

    > 

      {children} 

    </li> 

  ); 

}; 

 

const Cursor = ({ position }) => { 

  return ( 

    <motion.li 

      animate={{ 

        ...position, 

      }} 

      className="absolute z-0 h-7 rounded-full md:h-12 text-white" 

      style={{ 

        backgroundColor: `rgba(50, 50, 50, 0.9999)`, 

        width: "100px", 

      }} 

    /> 

  ); 

}; 


export default Navbar;