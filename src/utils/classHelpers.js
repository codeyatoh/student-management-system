export const filterClasses = (classes, searchTerm) => {
  if (!searchTerm) {
    return classes;
  }
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return classes.filter(cls => {
    // Also search through assignments' schedules
    const assignmentSchedules = (cls.assignments || [])
      .map(a => `${a.schedule.day || ''} ${a.schedule.time || ''}`)
      .join(', ')
      .toLowerCase();

    return (
      (cls.class_name && cls.class_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (cls.subject && cls.subject.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (assignmentSchedules.includes(lowerCaseSearchTerm))
    );
  });
};

export const sortClasses = (classes, sortBy, sortOrder) => {
  return [...classes].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'id') {
      valA = a.classNumber;
      valB = b.classNumber;
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const validateClassForm = (formData) => {
  const newErrors = {};
  if (!formData.class_name) newErrors.class_name = 'Class name is required';
  if (!formData.subject) newErrors.subject = 'Subject is required';

  if (!formData.assignments || formData.assignments.length === 0) {
    newErrors.assignments = 'At least one assignment is required.';
  } else {
    const areAllAssignmentsValid = formData.assignments.every(a => 
      a.teacher_id && a.classroom_id && a.schedule.day && a.schedule.time
    );

    if (!areAllAssignmentsValid) {
      newErrors.assignments = 'Each assignment must have a teacher, classroom, day, and time.';
    }
  }

  return newErrors;
};
