// Mock data for demo mode

export const mockData = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'teacher', phone: '0912345678', address: 'Hanoi, Vietnam' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'student', phone: '0987654321', address: 'Ho Chi Minh City, Vietnam' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', phone: '0912121212', address: 'Da Nang, Vietnam' },
  ],
  courses: [
    { id: '1', name: 'English A1', subject: 'English', level: 'beginner', teacher_name: 'John Doe', status: 'active', max_students: 30, current_students: 25, tuition_fee: 500000, start_date: '2024-01-15', end_date: '2024-03-15' },
    { id: '2', name: 'English B1', subject: 'English', level: 'intermediate', teacher_name: 'John Doe', status: 'active', max_students: 28, current_students: 20, tuition_fee: 600000, start_date: '2024-01-20', end_date: '2024-04-20' },
    { id: '3', name: 'French A1', subject: 'French', level: 'beginner', teacher_name: 'Jane Smith', status: 'upcoming', max_students: 25, current_students: 18, tuition_fee: 450000, start_date: '2024-02-01', end_date: '2024-04-01' },
  ],
  enrollments: [
    { id: '1', student_id: '2', course_id: '1', status: 'active', enrollment_date: '2024-01-10' },
    { id: '2', student_id: '2', course_id: '2', status: 'active', enrollment_date: '2024-01-15' },
  ],
  grades: [
    { id: '1', student_id: '2', course_id: '1', assessment_type: 'quiz', score: 85, max_score: 100 },
    { id: '2', student_id: '2', course_id: '1', assessment_type: 'midterm', score: 78, max_score: 100 },
  ],
  attendance: [
    { id: '1', student_id: '2', course_id: '1', date: '2024-01-20', status: 'present' },
    { id: '2', student_id: '2', course_id: '1', date: '2024-01-22', status: 'absent' },
    { id: '3', student_id: '2', course_id: '1', date: '2024-01-25', status: 'present' },
  ],
  payments: [
    { id: '1', student_id: '2', course_id: '1', amount: 500000, status: 'paid', payment_date: '2024-01-10' },
    { id: '2', student_id: '2', course_id: '2', amount: 300000, status: 'pending', payment_date: null },
  ],
  materials: [
    { id: '1', course_id: '1', title: 'Lesson 1: Introduction', type: 'document', file_url: '#' },
    { id: '2', course_id: '1', title: 'Lesson 2: Pronunciation', type: 'video', file_url: '#' },
  ],
  notifications: [
    { id: '1', user_id: '2', title: 'New course assignment', message: 'You have been assigned to English B1 course', type: 'info', created_at: '2024-01-20' },
    { id: '2', user_id: '2', title: 'Payment reminder', message: 'Your payment for English B1 is pending', type: 'warning', created_at: '2024-01-19' },
  ]
};

// Mock API response for list operations
export const mockList = (entities) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(entities || []), 300);
  });
};

// Mock API response for filter operations
export const mockFilter = (entities, filterFn) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve((entities || []).filter(filterFn)), 300);
  });
};

// Mock API response for single item
export const mockGet = (entity) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(entity || null), 300);
  });
};
