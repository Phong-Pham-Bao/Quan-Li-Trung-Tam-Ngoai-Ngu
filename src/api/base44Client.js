import { mockData, mockList, mockFilter, mockGet } from './mockData';

// Demo mode client - returns mock data for all operations
const demoClient = {
  entities: {
    User: {
      list: () => mockList(mockData.users),
      filter: (query) => mockFilter(mockData.users, (u) => {
        if (query.role) return u.role === query.role;
        return true;
      }),
      get: (id) => mockGet(mockData.users.find(u => u.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.users[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.users[0] }),
      delete: () => Promise.resolve(true),
    },
    Course: {
      list: () => mockList(mockData.courses),
      filter: () => mockList(mockData.courses),
      get: (id) => mockGet(mockData.courses.find(c => c.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.courses[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.courses[0] }),
      delete: () => Promise.resolve(true),
    },
    Enrollment: {
      list: () => mockList(mockData.enrollments),
      filter: () => mockList(mockData.enrollments),
      get: (id) => mockGet(mockData.enrollments.find(e => e.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.enrollments[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.enrollments[0] }),
      delete: () => Promise.resolve(true),
    },
    Grade: {
      list: () => mockList(mockData.grades),
      filter: () => mockList(mockData.grades),
      get: (id) => mockGet(mockData.grades.find(g => g.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.grades[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.grades[0] }),
      delete: () => Promise.resolve(true),
    },
    Attendance: {
      list: () => mockList(mockData.attendance),
      filter: () => mockList(mockData.attendance),
      get: (id) => mockGet(mockData.attendance.find(a => a.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.attendance[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.attendance[0] }),
      delete: () => Promise.resolve(true),
    },
    Classroom: {
      list: () => mockList(mockData.courses.map((c, i) => ({ id: String(i+1), name: `Room ${i+1}` }))),
      filter: () => mockList(mockData.courses.map((c, i) => ({ id: String(i+1), name: `Room ${i+1}` }))),
      get: (id) => mockGet({ id, name: `Room ${id}` }),
      create: () => Promise.resolve({ id: 'demo' }),
      update: () => Promise.resolve({ id: 'demo' }),
      delete: () => Promise.resolve(true),
    },
    Subject: {
      list: () => mockList([
        { id: '1', name: 'English' },
        { id: '2', name: 'French' },
        { id: '3', name: 'Spanish' }
      ]),
      filter: () => mockList([{ id: '1', name: 'English' }, { id: '2', name: 'French' }]),
      get: (id) => mockGet({ id, name: 'English' }),
      create: () => Promise.resolve({ id: 'demo' }),
      update: () => Promise.resolve({ id: 'demo' }),
      delete: () => Promise.resolve(true),
    },
    TuitionPayment: {
      list: () => mockList(mockData.payments),
      filter: () => mockList(mockData.payments),
      get: (id) => mockGet(mockData.payments.find(p => p.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.payments[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.payments[0] }),
      delete: () => Promise.resolve(true),
    },
    TeachingMaterial: {
      list: () => mockList(mockData.materials),
      filter: () => mockList(mockData.materials),
      get: (id) => mockGet(mockData.materials.find(m => m.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.materials[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.materials[0] }),
      delete: () => Promise.resolve(true),
    },
    Notification: {
      list: () => mockList(mockData.notifications),
      filter: () => mockList(mockData.notifications),
      get: (id) => mockGet(mockData.notifications.find(n => n.id === id)),
      create: () => Promise.resolve({ id: 'demo', ...mockData.notifications[0] }),
      update: () => Promise.resolve({ id: 'demo', ...mockData.notifications[0] }),
      delete: () => Promise.resolve(true),
    },
  },
  auth: {
    me: () => Promise.resolve({ id: 'demo-user', name: 'Demo User', email: 'demo@example.com', role: 'admin' }),
    logout: () => Promise.resolve(true),
    redirectToLogin: () => Promise.resolve(true),
    updateMe: () => Promise.resolve(true),
  },
  users: {
    inviteUser: () => Promise.resolve(true),
  },
  integrations: {
    Core: {
      UploadFile: () => Promise.resolve({ file_url: '#' })
    }
  }
};

// Export the demo client as the main client
export const base44 = demoClient;

