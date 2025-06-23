import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import LoginPage from './login';
import AddClassroom from './components/AddClassroom';
import AddStudent from './components/AddStudent';
import AddTeacher from './components/AddTeacher';
import AddAdmin from './components/AddAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/add-classroom" element={<AddClassroom />} />
      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/add-admin" element={<AddAdmin />} />
    </Routes>
  );
}

export default App; 
