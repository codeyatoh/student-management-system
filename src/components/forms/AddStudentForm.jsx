import React, { useState, useEffect, useRef } from 'react';
import { validateStudentForm } from '../../utils/studentHelpers';
import Select from 'react-select';
import { db } from '../../config/firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const AddStudentForm = ({ open, onClose, onSubmit, studentToEdit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    email: '',
    address: '',
    enrollment_date: new Date().toISOString().split('T')[0], // Default to today
    enrollments: {}, // Changed from Array to Object/Map
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [classData, setClassData] = useState([]);
  const [teacherData, setTeacherData] = useState({});
  const [classroomData, setClassroomData] = useState({});
  const [activeAccordion, setActiveAccordion] = useState(null);
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [videoKey, setVideoKey] = useState(0); // Key to force re-mounting

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        // Fetch all data concurrently
        const [classSnapshot, teacherSnapshot, classroomSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'classes'), orderBy('class_name'))),
          getDocs(collection(db, 'teachers')),
          getDocs(collection(db, 'classrooms'))
        ]);

        const teachers = teacherSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        setTeacherData(teachers);

        const classrooms = classroomSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        setClassroomData(classrooms);

        const classes = classSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClassData(classes);

      } catch (error) {
        console.error("Failed to fetch enrollment data:", error);
      }
    };
    fetchEnrollmentData();
  }, []);

  useEffect(() => {
    if (open) {
      if (studentToEdit) {
        // Convert enrollments array from DB to object/map for the form state
        const enrollmentsArray = studentToEdit.enrollments || [];
        const enrollmentsMap = enrollmentsArray.reduce((acc, enrollment) => {
          acc[enrollment.classId] = enrollment.assignmentId;
          return acc;
        }, {});

        const formattedData = {
          ...studentToEdit,
          date_of_birth: studentToEdit.date_of_birth?.toDate ? studentToEdit.date_of_birth.toDate().toISOString().split('T')[0] : (studentToEdit.date_of_birth || ''),
          enrollment_date: studentToEdit.enrollment_date?.toDate ? studentToEdit.enrollment_date.toDate().toISOString().split('T')[0] : (studentToEdit.enrollment_date || ''),
          enrollments: enrollmentsMap,
        };
        setFormData(formattedData);
        if (studentToEdit.photo_url) {
          setPhotoPreview(studentToEdit.photo_url);
        }
        setStep(1);
      } else {
        // Load from localStorage for a new student
        const savedData = localStorage.getItem('tempStudentData');
        const savedStep = localStorage.getItem('tempStudentStep');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData({ ...parsedData, enrollments: parsedData.enrollments || {} });
        } else {
          resetForm(false); // Reset if no saved data
        }
        if (savedStep) {
          setStep(JSON.parse(savedStep));
        }
      }
    } else {
      stopCamera();
    }
  }, [open, studentToEdit]);

  // Save form data to localStorage on change
  useEffect(() => {
    if (open && !studentToEdit) {
      const dataToSave = { ...formData, photo: null }; // Don't save the file object
      localStorage.setItem('tempStudentData', JSON.stringify(dataToSave));
      localStorage.setItem('tempStudentStep', JSON.stringify(step));
    }
  }, [formData, step, open, studentToEdit]);

  if (!open) return null;

  const resetForm = (clearStorage = true) => {
    setStep(1);
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      contact_number: '',
      email: '',
      address: '',
      enrollment_date: new Date().toISOString().split('T')[0],
      enrollments: {},
      photo: null
    });
    setPhotoPreview(null);
    setErrors({});
    if (clearStorage) {
      localStorage.removeItem('tempStudentData');
      localStorage.removeItem('tempStudentStep');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const basicErrors = validateStudentForm(formData, step);
      setErrors(basicErrors);
      if (Object.keys(basicErrors).length === 0) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };
  
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, photo: file }));
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else if (name === 'contact_number') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 11) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEnrollmentChange = (classId, assignmentId) => {
    setFormData(prev => {
      const newEnrollments = { ...prev.enrollments };
      
      if (newEnrollments[classId] === assignmentId) {
        // If the same assignment is clicked again, un-select it by deleting the key.
        delete newEnrollments[classId];
      } else {
        // Otherwise, select this new assignment for the class.
        newEnrollments[classId] = assignmentId;
      }
      
      return { ...prev, enrollments: newEnrollments };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalErrors = validateStudentForm(formData, step);
    setErrors(finalErrors);
    
    if (Object.keys(finalErrors).length === 0) {
      // Convert enrollments map back to array of objects for Firestore
      const enrollmentsArray = Object.entries(formData.enrollments).map(([classId, assignmentId]) => ({
        classId,
        assignmentId,
      }));

      const submissionData = {
        ...formData,
        enrollments: enrollmentsArray,
      };
      
      onSubmit(submissionData, studentToEdit?.id);
    }
  };

  const handleCancel = () => {
    stopCamera(); // Stop camera if it's on
    onClose(); // Just close the modal, don't reset the form
  };

  const startCamera = async () => {
    console.log("Attempting to start camera...");
    setCameraError('');
    setVideoKey(prevKey => prevKey + 1); // Change key to force re-mount

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Check for devices first
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          console.error("No video input devices found.");
          setCameraError("No camera found on this device.");
          return;
        }
        console.log("Video devices found:", videoDevices);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Stream acquired:", stream);
        
        setIsCameraOn(true);
        
        // Use a short timeout to ensure the video element is in the DOM
        setTimeout(() => {
          if (videoRef.current) {
            console.log("Attaching stream to video element.");
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
              console.error("Video play() failed:", err);
              setCameraError(`Could not play camera stream. Error: ${err.message}`);
            });
          } else {
            console.error("videoRef.current is null after timeout.");
          }
        }, 100);

      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError("Camera permission denied. Please check your browser settings.");
        } else {
          setCameraError(`Error accessing camera: ${err.message}`);
        }
      }
    } else {
      console.error("getUserMedia not supported by this browser.");
      setCameraError("Camera access is not supported by this browser.");
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera.");
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };
  
  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setFormData(prev => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }, 'image/jpeg');
    stopCamera();
  };

  const renderStep1 = () => (
    <>
      <p className="step-description">Please enter the student's basic information:</p>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className={errors.first_name ? 'error' : ''} placeholder="e.g., Juan" />
          {errors.first_name && <span className="error-message">{errors.first_name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className={errors.last_name ? 'error' : ''} placeholder="e.g., Dela Cruz" />
          {errors.last_name && <span className="error-message">{errors.last_name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className={errors.date_of_birth ? 'error' : ''} />
          {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={errors.gender ? 'error' : ''}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="contact_number">Contact Number</label>
          <input type="tel" id="contact_number" name="contact_number" value={formData.contact_number} onChange={handleChange} className={errors.contact_number ? 'error' : ''} maxLength="11" placeholder="e.g., 09123456789" />
          {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} placeholder="e.g., juan.delacruz@example.com" />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group full-width">
          <label htmlFor="address">Address</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} className={errors.address ? 'error' : ''} rows="3" placeholder="e.g., 123 Rizal St, Brgy. Uno, Quezon City" />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="enrollment_date">Enrollment Date</label>
          <input type="date" id="enrollment_date" name="enrollment_date" value={formData.enrollment_date} onChange={handleChange} className={errors.enrollment_date ? 'error' : ''} />
          {errors.enrollment_date && <span className="error-message">{errors.enrollment_date}</span>}
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <p className="step-description">Please upload the student's photo:</p>
      <div className="form-group photo-upload-group">
        {isCameraOn ? (
          <div className="camera-container">
            <video key={videoKey} ref={videoRef} autoPlay playsInline muted className="camera-feed" />
            <div className="camera-actions">
              <button type="button" onClick={takePhoto} className="submit-button">Take Photo</button>
              <button type="button" onClick={stopCamera} className="cancel-button camera-cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="photo-actions">
                <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="file-input" />
                <label htmlFor="photo" className="file-upload-label">Upload File</label>
                <button type="button" onClick={startCamera} className="submit-button">Take a Photo</button>
            </div>
            {cameraError && <span className="error-message" style={{ textAlign: 'center', width: '100%' }}>{cameraError}</span>}
            {errors.photo && <span className="error-message">{errors.photo}</span>}
            <div className="photo-preview-container">
              {photoPreview ? (
                <img src={photoPreview} alt="Student Preview" className="photo-preview" />
              ) : (
                <div className="photo-preview-placeholder"><span>Preview</span></div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <p className="step-description">Select the specific class assignments for the student:</p>
      <div className="form-group full-width">
        <label>Class Assignments</label>
        <div className="assignments-accordion-container">
          {classData.map(cls => (
            <div key={cls.id} className="accordion-item">
              <button
                type="button"
                className={`accordion-header ${activeAccordion === cls.id ? 'active' : ''}`}
                onClick={() => setActiveAccordion(activeAccordion === cls.id ? null : cls.id)}
              >
                {cls.class_name} - {cls.subject}
              </button>
              {activeAccordion === cls.id && (
                <div className="accordion-content">
                  <table className="mini-table assignments-table">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Teacher</th>
                        <th>Classroom</th>
                        <th>Schedule</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.assignments?.map(assignment => {
                        const classroom = classroomData[assignment.classroom_id];
                        const isChecked = formData.enrollments?.[cls.id] === assignment.id;
                        return (
                          <tr key={assignment.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleEnrollmentChange(cls.id, assignment.id)}
                              />
                            </td>
                            <td>{assignment.teacher_name || 'N/A'}</td>
                            <td>{classroom ? `${classroom.room_number} (${classroom.building_name})` : 'N/A'}</td>
                            <td>{`${assignment.schedule.day} ${assignment.schedule.time}`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="pixel-alert-overlay" onClick={handleCancel}>
      <div className="pixel-alert-box student-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>{studentToEdit ? 'Edit Student' : `Add New Student - Step ${step} of 3`}</h3>
          <button className="pixel-alert-close" onClick={handleCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="add-student-form">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          
          <div className="form-actions">
            {step > 1 && <button type="button" onClick={handleBack} className="cancel-button">Back</button>}
            {step < 3 && <button type="button" onClick={handleNext} className="submit-button">Next</button>}
            {step === 3 && <button type="submit" className="submit-button">{studentToEdit ? 'Update Student' : 'Add Student'}</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm; 