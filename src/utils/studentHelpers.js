// Filter students based on search term
export const filterStudents = (students, searchTerm) => {
  return students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Sort students
export const sortStudents = (students, sortBy, sortOrder) => {
  return [...students].sort((a, b) => {
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
};

// Format student name
export const formatStudentName = (student) => {
  return `${student.first_name} ${student.last_name}`;
};

// Format enrollment date
export const formatEnrollmentDate = (date) => {
  if (!date) return 'N/A';
  if (date.toDate) {
    return date.toDate().toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
};

// Validate student form data
export const validateStudentForm = (formData) => {
  const errors = {};
  
  if (!formData.first_name) errors.first_name = 'First name is required';
  if (!formData.last_name) errors.last_name = 'Last name is required';
  if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
  if (!formData.gender) errors.gender = 'Gender is required';
  if (!formData.contact_number) errors.contact_number = 'Contact number is required';
  if (!formData.email) errors.email = 'Email is required';
  if (!formData.address) errors.address = 'Address is required';
  if (!formData.enrollment_date) errors.enrollment_date = 'Enrollment date is required';
  if (!formData.class_id) errors.class_id = 'Class ID is required';
  
  // Email validation
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Contact number validation
  if (formData.contact_number && !/^\+?[\d\s-]{10,}$/.test(formData.contact_number)) {
    errors.contact_number = 'Please enter a valid contact number';
  }
  
  return errors;
}; 