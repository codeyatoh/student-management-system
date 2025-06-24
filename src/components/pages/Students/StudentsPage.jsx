import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../layout/Sidebar/Sidebar';
import AddStudentForm from '../../forms/AddStudentForm';
import ViewStudentModal from '../../modals/ViewStudentModal';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import { db } from '../../../config/firebase-config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import nightbyteLogo from '../../../assets/images/nightbyte.png';
import './StudentsPage.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PixelAlert from '../../modals/PixelAlert';

const StudentsPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalState, setModalState] = useState({ view: false, add: false, edit: false, delete: false });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  const fetchStudents = useCallback(async () => {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy("enrollment_date"));
    const studentSnapshot = await getDocs(q);
    const studentList = studentSnapshot.docs.map((doc, index) => ({
      ...doc.data(),
      id: doc.id,
      studentNumber: index + 1
    }));
    setStudents(studentList);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (alertInfo.show) {
      const timer = setTimeout(() => {
        setAlertInfo({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo.show]);

  const handleAddOrUpdateStudent = async (studentData, studentId) => {
    setIsUploading(true);
    try {
      let photoUrl = studentData.photo_url || '';

      // Check if a new photo file is being uploaded
      if (studentData.photo && typeof studentData.photo !== 'string') {
        const formData = new FormData();
        formData.append('file', studentData.photo);
        formData.append('upload_preset', 'student-management-system');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dztwssq5c/image/upload',
          formData
        );
        photoUrl = response.data.secure_url;
      }

      const studentPayload = { ...studentData, photo_url: photoUrl };
      delete studentPayload.photo; // Remove the file object before saving

      if (studentId) {
        // Update existing student
        const studentDoc = doc(db, 'students', studentId);
        await updateDoc(studentDoc, studentPayload);
        setAlertInfo({ show: true, message: 'Student updated successfully!', type: 'success' });
      } else {
        // Add new student
        await addDoc(collection(db, 'students'), studentPayload);
        setAlertInfo({ show: true, message: 'Student added successfully!', type: 'success' });
      }
      
      fetchStudents(); // Re-fetch students to update the list
      closeAllModals();
    } catch (error) {
      console.error("Error saving student:", error);
      setAlertInfo({ show: true, message: 'Error saving student. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsUploading(true);
    try {
      // Deleting the image from Cloudinary would require a backend with credentials.
      // For now, we will just delete the reference from Firestore.
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'students', selectedStudent.id));
      
      fetchStudents(); // Re-fetch students to update the list
      closeAllModals();
      setAlertInfo({ show: true, message: 'Student deleted successfully!', type: 'success' });
    } catch (error) {
      console.error("Error deleting student: ", error);
      setAlertInfo({ show: true, message: 'Error deleting student. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = (type, student = null) => {
    setSelectedStudent(student);
    setModalState({ view: type === 'view', add: type === 'add', edit: type === 'edit', delete: type === 'delete' });
  };

  const closeAllModals = () => {
    setModalState({ view: false, add: false, edit: false, delete: false });
    setSelectedStudent(null);
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'first_name' || sortBy === 'last_name' || sortBy === 'class_id') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="students-page">
      <div className={`dashboard-layout`}>
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} location={location} />
        <div className="main-content">
          <div className="students-container">
            <div className="students-header">
              <div className="traffic-lights">
                <span className="traffic-light red"></span>
                <span className="traffic-light yellow"></span>
                <span className="traffic-light green"></span>
              </div>
              <h2>View Students</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select
                  className="sort-dropdown"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="id">Sort by ID</option>
                  <option value="first_name">Sort by Name</option>
                  <option value="class_id">Sort by Class</option>
                  <option value="enrollment_date">Sort by Date</option>
                </select>
                <button
                  className="sort-order-btn"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                <button className="add-student-btn" onClick={() => openModal('add')}>
                  <FaPlus /> Add Student
                </button>
              </div>
            </div>
            <div className="search-container">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Class ID</th>
                    <th>Enrollment Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map(student => (
                    <tr key={student.id}>
                      <td>{`STUDENT-${String(student.studentNumber).padStart(4, '0')}`}</td>
                      <td style={{ paddingLeft: '1.5rem', fontWeight: 'bold' }}>{`${student.first_name} ${student.last_name}`}</td>
                      <td style={{ paddingLeft: '1.5rem' }}>{student.email}</td>
                      <td style={{ paddingLeft: '1.5rem' }}>{student.contact_number}</td>
                      <td style={{ paddingLeft: '1.5rem' }}>{student.class_id}</td>
                      <td style={{ paddingLeft: '1.5rem' }}>
                        {student.enrollment_date?.toDate ? student.enrollment_date.toDate().toLocaleDateString() : student.enrollment_date}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view-btn" title="Read/View" onClick={() => openModal('view', student)}>
                            <FaEye />
                          </button>
                          <button className="action-btn edit-btn" title="Edit" onClick={() => openModal('edit', student)}>
                            <FaEdit />
                          </button>
                          <button className="action-btn delete-btn" title="Delete" onClick={() => openModal('delete', student)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedStudents.length === 0 && (
                <div className="no-students">
                  <p>No students found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
          {modalState.view && <ViewStudentModal student={selectedStudent} onClose={closeAllModals} />}
          {(modalState.add || modalState.edit) && (
            <AddStudentForm
              open={modalState.add || modalState.edit}
              onClose={closeAllModals}
              onSubmit={handleAddOrUpdateStudent}
              studentToEdit={modalState.edit ? selectedStudent : null}
            />
          )}
          {modalState.delete && <DeleteConfirmationModal onConfirm={handleDelete} onCancel={closeAllModals} />}
          
          {isUploading && (
            <div className="loading-overlay">
              <div className="loading-box">
                Saving...
              </div>
            </div>
          )}

          {alertInfo.show && (
            <PixelAlert 
              message={alertInfo.message}
              type={alertInfo.type}
              onClose={() => setAlertInfo({ show: false, message: '', type: 'success' })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage; 