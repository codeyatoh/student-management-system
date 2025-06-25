// Static options for teachers and classrooms
export const teacherOptions = [];

export const classroomOptions = [];

// Helper functions
export const getTeacherName = (id) => teacherOptions.find(t => t.id === id)?.name || id;
export const getClassroomName = (id) => classroomOptions.find(c => c.id === id)?.name || id;

// Form validation
export const validateClassForm = (formData) => {
  const errors = {};
  Object.keys(formData).forEach(key => {
    if (!formData[key]) {
      errors[key] = 'This field is required';
    }
  });
  return errors;
};

// Filter classes based on search term
export const filterClasses = (classes, searchTerm) => {
  return classes.filter(cls =>
    cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTeacherName(cls.teacher_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClassroomName(cls.classroom_id).toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Sort classes
export const sortClasses = (classes, sortBy, sortOrder) => {
  return [...classes].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'class_name' || sortBy === 'subject' || sortBy === 'schedule') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}; 