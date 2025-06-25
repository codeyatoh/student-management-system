// Filter students based on search term
export const filterStudents = (students, searchTerm) => {
  if (!searchTerm) return students;
  return students.filter(student =>
    (student.first_name && student.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.last_name && student.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

// Sort students
export const sortStudents = (students, sortBy, sortOrder) => {
  return [...students].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'first_name' || sortBy === 'last_name') {
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
export const validateStudentForm = (formData, step = null) => {
  const errors = {};

  if (step === 1) {
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.contact_number) {
      errors.contact_number = 'Contact number is required';
    } else if (!/^\d{11}$/.test(formData.contact_number)) {
      errors.contact_number = 'Contact number must be exactly 11 digits';
    }
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.enrollment_date) errors.enrollment_date = 'Enrollment date is required';
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (step === 3 || step === null) { // Validate on final step or if no step is provided
    if (!formData.class_ids || formData.class_ids.length === 0) {
      errors.class_ids = 'At least one class must be selected';
    }
  }
  
  // Full validation if no step is provided (for backward compatibility if needed)
  if (step === null) {
      if (!formData.first_name) errors.first_name = 'First name is required';
      if (!formData.last_name) errors.last_name = 'Last name is required';
      if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
      if (!formData.gender) errors.gender = 'Gender is required';
      if (!formData.contact_number) {
        errors.contact_number = 'Contact number is required';
      } else if (!/^\d{11}$/.test(formData.contact_number)) {
        errors.contact_number = 'Contact number must be exactly 11 digits';
      }
      if (!formData.address) errors.address = 'Address is required';
      if (!formData.enrollment_date) errors.enrollment_date = 'Enrollment date is required';
      if (!formData.email) {
          errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Please enter a valid email address';
      }
  }

  return errors;
}; 