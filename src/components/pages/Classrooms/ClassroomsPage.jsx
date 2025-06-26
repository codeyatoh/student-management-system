import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import Sidebar from '../../layout/Sidebar/Sidebar';
import AddClassroomForm from '../../forms/AddClassroomForm';
import ViewClassroomModal from '../../modals/ViewClassroomModal';
import './ClassroomsPage.css';
import { db } from '../../../config/firebase-config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const ClassroomsPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true';
  });
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewClassroom, setViewClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const classroomsPerPage = 10;

  // Fetch classrooms from Firestore (real-time)
  useEffect(() => {
    const classroomsCollection = collection(db, 'classrooms');
    const q = query(classroomsCollection, orderBy('room_number'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classroomList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(room => !room.archived);
      setClassrooms(classroomList);
    });
    return () => unsubscribe();
  }, []);

  // Fetch students (real-time)
  useEffect(() => {
    const studentsCollection = collection(db, 'students');
    const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
      const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);
    });
    return () => unsubscribe();
  }, []);

  // Fetch classes (real-time)
  useEffect(() => {
    const classesCollection = collection(db, 'classes');
    const unsubscribe = onSnapshot(classesCollection, (snapshot) => {
      const classList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(classList);
    });
    return () => unsubscribe();
  }, []);

  // Fetch teachers (real-time)
  useEffect(() => {
    const teachersCollection = collection(db, 'teachers');
    const unsubscribe = onSnapshot(teachersCollection, (snapshot) => {
      const teacherList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachers(teacherList);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      localStorage.setItem('sidebarCollapsed', !prev);
      return !prev;
    });
  };

  // Add or Edit classroom
  const handleAddOrEdit = async (data, id) => {
    if (id) {
      // Edit
      const classroomRef = doc(db, 'classrooms', id);
      await updateDoc(classroomRef, data);
    } else {
      // Add
      await addDoc(collection(db, 'classrooms'), data);
    }
    setShowModal(false);
    setEditingClassroom(null);
    // No need to call fetchClassrooms, real-time listener will update
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setShowModal(true);
  };

  // Delete classroom
  const handleDelete = (classroom) => {
    setClassroomToDelete(classroom);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (classroomToDelete) {
      await updateDoc(doc(db, 'classrooms', classroomToDelete.id), { archived: true });
      setShowDeleteModal(false);
      setClassroomToDelete(null);
      // No need to call fetchClassrooms, real-time listener will update
    }
  };

  const openAddModal = () => {
    setEditingClassroom(null);
    setShowModal(true);
  };

  const filteredClassrooms = classrooms.filter(c =>
    c.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.building_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClassrooms = [...filteredClassrooms].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedClassrooms.length / classroomsPerPage);
  const paginatedClassrooms = sortedClassrooms.slice((currentPage - 1) * classroomsPerPage, currentPage * classroomsPerPage);

  // When opening the view modal, filter students and classes for the selected classroom
  const handleViewClassroom = (classroom) => {
    setViewClassroom(classroom);
    if (classroom) {
      // Assigned students: enrolled in a class assignment for this classroom
      const assignedStudents = students.filter(student => {
        if (!Array.isArray(student.enrollments)) return false;
        return student.enrollments.some(enrollment => {
          const cls = classes.find(c => c.id === enrollment.classId);
          if (!cls || !Array.isArray(cls.assignments)) return false;
          const assignment = cls.assignments.find(a => a.id === enrollment.assignmentId);
          return assignment && assignment.classroom_id === classroom.id;
        });
      });
      setFilteredStudents(assignedStudents);
      // Classes assigned to this classroom (by assignment)
      const assignedClasses = classes
        .map(cls => {
          const assignment = Array.isArray(cls.assignments)
            ? cls.assignments.find(a => a.classroom_id === classroom.id)
            : null;
          if (!assignment) return null;
          let teacherName = 'N/A';
          if (assignment.teacher_id) {
            const teacher = teachers.find(t => t.id === assignment.teacher_id);
            if (teacher) {
              teacherName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim();
            }
          }
          return {
            ...cls,
            schedule: assignment.schedule ? `${assignment.schedule.day} ${assignment.schedule.time}` : '',
            teacher: teacherName
          };
        })
        .filter(Boolean);
      setFilteredClasses(assignedClasses);
    } else {
      setFilteredStudents([]);
      setFilteredClasses([]);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        location={location} 
      />
      
      <div className="main-content">
        <div className="students-container">
          <div className="students-header">
            <div className="traffic-lights">
              <span className="traffic-light red"></span>
              <span className="traffic-light yellow"></span>
              <span className="traffic-light green"></span>
            </div>
            <h2>Classrooms</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="id">Sort by ID</option>
                <option value="room_number">Sort by Room Number</option>
                <option value="building_name">Sort by Building Name</option>
                <option value="capacity">Sort by Capacity</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
              <button className="add-student-btn" onClick={openAddModal}>
                <FaPlus /> Add Room
              </button>
            </div>
          </div>
          <div className="search-container">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          {/* Classrooms Table */}
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Room Number</th>
                  <th>Building Name</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClassrooms.map((room, idx) => (
                  <tr key={room.id}>
                    <td>{(currentPage - 1) * classroomsPerPage + idx + 1}</td>
                    <td>{room.room_number}</td>
                    <td>{room.building_name}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn" 
                          title="View Details"
                          onClick={() => handleViewClassroom(room)}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="action-btn edit-btn" 
                          onClick={() => handleEdit(room)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDelete(room)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &#8592; Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next &#8594;
                </button>
              </div>
            )}
            {filteredClassrooms.length === 0 && (
              <div className="no-students">
                <p>No classrooms found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Add/Edit Classroom Form */}
        <AddClassroomForm
          open={showModal}
          onClose={() => { setShowModal(false); setEditingClassroom(null); }}
          onSubmit={handleAddOrEdit}
          classroomToEdit={editingClassroom}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="pixel-alert-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="pixel-alert-box" onClick={e => e.stopPropagation()}>
              <div className="pixel-alert-header">
                <h3>Confirm Deletion</h3>
                <button className="pixel-alert-close" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="pixel-alert-message">
                <p>Are you sure you want to delete classroom "{classroomToDelete?.room_number}"?</p>
                <p>This action cannot be undone.</p>
              </div>
              <div className="confirmation-buttons">
                <button onClick={confirmDelete} className="confirm-btn-delete">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* View Classroom Modal */}
        <ViewClassroomModal
          classroom={viewClassroom}
          students={filteredStudents}
          classes={filteredClasses}
          onClose={() => setViewClassroom(null)}
        />
      </div>
    </div>
  );
};

export default ClassroomsPage; 