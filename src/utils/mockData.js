export const mockClassrooms = [
  {
    id: 1,
    room_number: '101',
    building_name: 'Main Building',
    capacity: 30,
    available_resources: ['Projector', 'Whiteboard', 'WiFi']
  },
  {
    id: 2,
    room_number: '202',
    building_name: 'Science Block',
    capacity: 25,
    available_resources: ['Lab Equipment', 'Sink']
  },
  {
    id: 3,
    room_number: 'A1',
    building_name: 'Annex',
    capacity: 20,
    available_resources: ['TV', 'Air Conditioning']
  }
];

export const mockStudents = [
  { id: 1, first_name: 'Juan', last_name: 'Dela Cruz', email: 'juan@email.com', class_id: 1, gender: 'male' },
  { id: 2, first_name: 'Maria', last_name: 'Santos', email: 'maria@email.com', class_id: 2, gender: 'female' },
  { id: 3, first_name: 'Pedro', last_name: 'Penduko', email: 'pedro@email.com', class_id: 1, gender: 'male' },
  { id: 4, first_name: 'Ana', last_name: 'Reyes', email: 'ana@email.com', class_id: 3, gender: 'female' },
];

export const mockClasses = [
  { id: 1, class_name: 'Math 101', subject: 'Mathematics', schedule: 'Mon 9:00-10:30', teacher: 'Mr. Cruz', classroom_id: 1 },
  { id: 2, class_name: 'Physics 201', subject: 'Physics', schedule: 'Wed 11:00-12:30', teacher: 'Ms. Santos', classroom_id: 2 },
  { id: 3, class_name: 'English 301', subject: 'English', schedule: 'Fri 14:00-15:30', teacher: 'Mr. Reyes', classroom_id: 1 },
  { id: 4, class_name: 'Biology 101', subject: 'Biology', schedule: 'Tue 10:00-11:30', teacher: 'Ms. Garcia', classroom_id: 3 },
]; 