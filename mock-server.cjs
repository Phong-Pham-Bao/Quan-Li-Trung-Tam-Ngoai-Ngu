// Simple Mock API Server
const http = require('http');
const url = require('url');

// Mock data
const mockData = {
  User: [
    { id: 1, email: 'student@example.com', role: 'student', full_name: 'Học viên Demo', name: 'Học viên A', phone: '0123456789' },
    { id: 2, email: 'teacher@example.com', role: 'teacher', full_name: 'Giáo viên Demo', name: 'Giáo viên B', phone: '0987654321', specialization: 'English', hourly_rate: 50 },
    { id: 3, email: 'admin@example.com', role: 'admin', full_name: 'Admin Demo', name: 'Admin C' }
  ],
  Course: [
    { id: 1, name: 'English Basic', teacher_email: 'teacher@example.com', subject: 'English', subject_id: 1, classroom_id: 1, status: 'active', level: 'beginner' },
    { id: 2, name: 'English Advanced', teacher_email: 'teacher@example.com', subject: 'English', subject_id: 1, classroom_id: 2, status: 'active', level: 'advanced' },
    { id: 3, name: 'Vietnamese Basic', teacher_email: 'teacher@example.com', subject: 'Vietnamese', subject_id: 2, classroom_id: 1, status: 'active', level: 'beginner' }
  ],
  Enrollment: [
    { id: 1, student_email: 'student@example.com', student_name: 'Học viên Demo', course_id: 1, course_name: 'English Basic', status: 'active' },
    { id: 2, student_email: 'student@example.com', student_name: 'Học viên Demo', course_id: 2, course_name: 'English Advanced', status: 'active' }
  ],
  Grade: [
    { id: 1, student_email: 'student@example.com', student_name: 'Học viên Demo', course_id: 1, course_name: 'English Basic', assessment_type: 'final', score: 85, max_score: 100, graded_by: 'teacher@example.com', grade_date: '2026-03-01' },
    { id: 2, student_email: 'student@example.com', student_name: 'Học viên Demo', course_id: 2, course_name: 'English Advanced', assessment_type: 'midterm', score: 90, max_score: 100, graded_by: 'teacher@example.com', grade_date: '2026-03-05' }
  ],
  Classroom: [
    { id: 1, name: 'Lớp A1', capacity: 30 },
    { id: 2, name: 'Lớp A2', capacity: 30 }
  ],
  Subject: [
    { id: 1, name: 'English', code: 'EN01' },
    { id: 2, name: 'Vietnamese', code: 'VN01' }
  ],
  TuitionPayment: [
    { id: 1, student_email: 'student@example.com', amount: 1000000, status: 'paid' },
    { id: 2, student_email: 'student@example.com', amount: 500000, status: 'pending' }
  ],
  Attendance: [
    { id: 1, student_email: 'student@example.com', course_id: 1, date: '2026-03-07', status: 'present' }
  ],
  TeachingMaterial: [
    { id: 1, title: 'Lesson 1', course_id: 1, uploaded_by: 'teacher@example.com', file_url: '/files/lesson1.pdf' }
  ],
  Notification: [
    { id: 1, title: 'Welcome', message: 'Welcome to the system', content: 'Welcome to the system', target_email: 'student@example.com', target_role: 'all', is_read: false, type: 'info', created_date: '2026-03-01T10:00:00Z' },
    { id: 2, title: 'New Course', message: 'New courses available', content: 'New courses available', target_role: 'student', is_read: false, type: 'info', created_date: '2026-03-05T14:30:00Z' }
  ]
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`);

  // API Routes
  if (pathname === '/api/auth/me') {
    // Get current user
    // Simple token check (mock)
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      id: 1,
      email: 'student@example.com',
      name: 'Học viên Demo',
      role: 'student'
    }));
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
      const user = mockData.User.find(u => u.email === email);
      
      if (user) {
        // Mock password check (accept any password for now or specific one)
        // In real app: bcrypt.compare(password, user.password_hash)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          token: 'mock-jwt-token-' + user.id,
          user: user
        }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Invalid email or password' }));
      }
    });
    return;
  }

  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { email, password, name, role } = JSON.parse(body);
      
      if (mockData.User.find(u => u.email === email)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Email already exists' }));
        return;
      }

      const newUser = {
        id: Math.max(...mockData.User.map(u => u.id), 0) + 1,
        email,
        name,
        role: role || 'student', // Default to student
        full_name: name
      };
      
      mockData.User.push(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        token: 'mock-jwt-token-' + newUser.id,
        user: newUser
      }));
    });
    return;
  }

  if (pathname.startsWith('/api/entities/')) {
    const entityName = pathname.split('/')[3];
    const entityId = pathname.split('/')[4];

    if (!mockData[entityName]) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Entity not found' }));
      return;
    }

    if (req.method === 'GET') {
      if (entityId) {
        // Get single entity
        const entity = mockData[entityName].find(e => e.id == entityId);
        if (entity) {
          res.writeHead(200);
          res.end(JSON.stringify(entity));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      } else {
        // List entities with filtering
        let result = mockData[entityName];
        
        // Apply filters from query
        Object.keys(query).forEach(key => {
          if (key !== 'sort') {
            result = result.filter(item => item[key] == query[key]);
          }
        });

        res.writeHead(200);
        res.end(JSON.stringify(result));
      }
      return;
    }

    if (req.method === 'POST') {
      // Create entity
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const newEntity = JSON.parse(body);
        newEntity.id = Math.max(...mockData[entityName].map(e => e.id), 0) + 1;
        newEntity.created_date = new Date().toISOString();
        mockData[entityName].push(newEntity);
        
        res.writeHead(201);
        res.end(JSON.stringify(newEntity));
      });
      return;
    }

    if (req.method === 'PUT') {
      // Update entity
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const updates = JSON.parse(body);
        const entity = mockData[entityName].find(e => e.id == entityId);
        if (entity) {
          Object.assign(entity, updates);
          res.writeHead(200);
          res.end(JSON.stringify(entity));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      });
      return;
    }

    if (req.method === 'DELETE') {
      // Delete entity
      const index = mockData[entityName].findIndex(e => e.id == entityId);
      if (index > -1) {
        mockData[entityName].splice(index, 1);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
      }
      return;
    }
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 3000;
const HOST = '127.0.0.1';
server.listen(PORT, HOST, () => {
  console.log(`Mock API Server running on http://${HOST}:${PORT}`);
  console.log(`Available at http://${HOST}:${PORT}/api/entities/{Entity}`);
});
