import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../layout/Sidebar/Sidebar';
import AddClassForm from '../../forms/AddClassForm';
import ViewClassModal from '../../modals/ViewClassModal';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import { db } from '../../../config/firebase-config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './ClassesPage.css';
import '../../modals/PixelAlert.css';
import { useLocation } from 'react-router-dom';
import PixelAlert from '../../modals/PixelAlert';
import { 
  filterClasses, 
  sortClasses 
} from '../../../utils/classHelpers';

const ClassesPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalState, setModalState] = useState({ view: false, add: false, edit: false, delete: false });
  const [selectedClass, setSelectedClass] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  // Fetch classes from Firestore (real-time)
  useEffect(() => {
    const classesCollection = collection(db, 'classes');
    const q = query(classesCollection, orderBy('class_name'));
    const unsubscribe = onSnapshot(q, (classSnapshot) => {
      const classList = classSnapshot.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,
        classNumber: index + 1
      })).filter(cls => !cls.archived);
      setClasses(classList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (alertInfo.show) {
      const timer = setTimeout(() => {
        setAlertInfo({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo.show]);

  const handleAddOrUpdateClass = async (classData, classId) => {
    setIsUploading(true);
    try {
      if (classId) {
        // Update existing class
        const classDoc = doc(db, 'classes', classId);
        await updateDoc(classDoc, classData);
        setAlertInfo({ show: true, message: 'Class updated successfully!', type: 'success' });
      } else {
        // Add new class
        await addDoc(collection(db, 'classes'), classData);
        setAlertInfo({ show: true, message: 'Class added successfully!', type: 'success' });
      }
      // No need to call fetchClasses, real-time listener will update
      closeAllModals();
    } catch (error) {
      console.error("Error saving class:", error);
      setAlertInfo({ show: true, message: 'Error saving class. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;
    setIsUploading(true);
    try {
      await updateDoc(doc(db, 'classes', selectedClass.id), { archived: true });
      // No need to call fetchClasses, real-time listener will update
      closeAllModals();
      setAlertInfo({ show: true, message: 'Class archived successfully!', type: 'success' });
    } catch (error) {
      console.error("Error archiving class: ", error);
      setAlertInfo({ show: true, message: 'Error archiving class. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = (type, classItem = null) => {
    setSelectedClass(classItem);
    setModalState({ view: type === 'view', add: type === 'add', edit: type === 'edit', delete: type === 'delete' });
  };

  const closeAllModals = () => {
    setModalState({ view: false, add: false, edit: false, delete: false });
    setSelectedClass(null);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      localStorage.setItem('sidebarCollapsed', !prev);
      return !prev;
    });
  };

  // Use utility functions for filtering and sorting
  const filteredClasses = filterClasses(classes, searchTerm);
  const sortedClasses = sortClasses(filteredClasses, sortBy, sortOrder);

  return (
    <div className="classes-page">
      <div className={`dashboard-layout`}>
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} location={location} />
        <div className="main-content">
          <div className="classes-container">
            <div className="classes-header">
              <div className="traffic-lights">
                <span className="traffic-light red"></span>
                <span className="traffic-light yellow"></span>
                <span className="traffic-light green"></span>
              </div>
              <h2>View Classes</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select
                  className="sort-dropdown"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="id">Sort by ID</option>
                  <option value="class_name">Sort by Name</option>
                  <option value="subject">Sort by Subject</option>
                  <option value="schedule">Sort by Schedule</option>
                </select>
                <button
                  className="sort-order-btn"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                <button className="add-class-btn" onClick={() => openModal('add')}>
                  <FaPlus /> Add Class
                </button>
              </div>
            </div>
            <div className="search-container">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="classes-table-container">
              <table className="classes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Class Name</th>
                    <th>Subject</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClasses.map(cls => (
                    <tr key={cls.id}>
                      <td>{cls.classNumber || cls.id}</td>
                      <td style={{ paddingLeft: '1.5rem', fontWeight: 'bold' }}>{cls.class_name}</td>
                      <td style={{ paddingLeft: '1.5rem' }}>{cls.subject}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn" 
                            title="View"
                            onClick={() => openModal('view', cls)}
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="action-btn edit-btn" 
                            title="Edit"
                            onClick={() => openModal('edit', cls)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete-btn" 
                            title="Delete"
                            onClick={() => openModal('delete', cls)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedClasses.length === 0 && (
                <div className="no-classes">
                  <p>No classes found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Use separated modal components */}
          {(modalState.add || modalState.edit) && (
            <AddClassForm
              open={modalState.add || modalState.edit}
              onClose={closeAllModals}
              onSubmit={handleAddOrUpdateClass}
              classToEdit={modalState.edit ? selectedClass : null}
            />
          )}

          {modalState.delete && (
            <DeleteConfirmationModal 
              onConfirm={handleDelete} 
              onCancel={closeAllModals}
              title="Delete Class"
              message={`Are you sure you want to archive "${selectedClass?.class_name}"?`}
              subMessage="This action cannot be undone."
            />
          )}

          {modalState.view && (
            <ViewClassModal 
              classData={selectedClass} 
              onClose={closeAllModals} 
            />
          )}

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

export default ClassesPage; 