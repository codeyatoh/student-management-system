import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Dashboard from './components/Dashboard/DashBoard.jsx';
// import AddClassroom from './components/AddClassroom';
// import AddStudent from './components/AddStudent';
// import AddTeacher from './components/AddTeacher';
// import AddAdmin from './components/AddAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/add-student" element={<AddStudent />} />
      <Route path="/add-classroom" element={<AddClassroom />} />
      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/add-admin" element={<AddAdmin />} /> */}
    </Routes>
  );
}

export default App; 
