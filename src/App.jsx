import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/pages/Dashboard/DashBoard.jsx';
import StudentsPage from './components/pages/Students/StudentsPage';
import ClassesPage from './components/pages/Classes/ClassesPage';
import ClassroomsPage from './components/pages/Classrooms/ClassroomsPage';
// import AddClassroom from './components/AddClassroom';
// import AddStudent from './components/AddStudent';
// import AddTeacher from './components/AddTeacher';
// import AddAdmin from './components/AddAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/add-classroom" element={<ClassroomsPage />} />
      {/* <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/add-admin" element={<AddAdmin />} /> */}
    </Routes>
  );
}

export default App; 
