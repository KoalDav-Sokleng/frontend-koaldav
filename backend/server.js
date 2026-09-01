const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock database for goals and milestones
let goals = [
  {
    id: 1,
    title: 'learn english',
    deadline: '2026-08-31',
    status: 'IN_PROGRESS',
    milestones: [
      { id: 1, title: 'vocabulary', status: 'IN_PROGRESS', focusSessions: [{ durationMinutes: 16 }, { durationMinutes: 1 }] },
      { id: 2, title: 'vocabulary', status: 'IN_PROGRESS', focusSessions: [] },
      { id: 3, title: 'grammar', status: 'IN_PROGRESS', focusSessions: [] },
      { id: 4, title: 'essay', status: 'IN_PROGRESS', focusSessions: [] },
    ],
  },
  {
    id: 2,
    title: 'booking management system',
    deadline: '2026-08-26',
    status: 'MISSED',
    milestones: [],
  },
  {
    id: 3,
    title: 'mobile app',
    deadline: '2026-08-27',
    status: 'MISSED',
    milestones: [],
  },
  {
    id: 4,
    title: 'learning springboot',
    deadline: '2026-08-31',
    status: 'IN_PROGRESS',
    milestones: [],
  },
];

// GET all goals with optional status filter
app.get('/api/goals', (req, res) => {
  const { status } = req.query;
  let filtered = goals;
  if (status) {
    filtered = goals.filter(g => g.status === status);
  }
  res.json(filtered);
});

// GET specific goal
app.get('/api/goals/:goalId', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.goalId));
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  res.json(goal);
});

// CREATE goal
app.post('/api/goals', (req, res) => {
  const { title, deadline } = req.body;
  const newGoal = {
    id: Math.max(...goals.map(g => g.id), 0) + 1,
    title,
    deadline,
    status: 'IN_PROGRESS',
    milestones: [],
  };
  goals.push(newGoal);
  res.status(201).json(newGoal);
});

// UPDATE goal
app.put('/api/goals/:goalId', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.goalId));
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  
  const { title, deadline } = req.body;
  if (title) goal.title = title;
  if (deadline) goal.deadline = deadline;
  
  res.json(goal);
});

// DELETE goal
app.delete('/api/goals/:goalId', (req, res) => {
  const index = goals.findIndex(g => g.id === parseInt(req.params.goalId));
  if (index === -1) return res.status(404).json({ message: 'Goal not found' });
  
  goals.splice(index, 1);
  res.json({ message: 'Goal deleted' });
});

// ADD milestone
app.post('/api/goals/:goalId/milestones', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.goalId));
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  
  const { title } = req.body;
  const newMilestone = {
    id: Math.max(...goal.milestones.map(m => m.id), 0) + 1,
    title,
    status: 'IN_PROGRESS',
    focusSessions: [],
  };
  goal.milestones.push(newMilestone);
  res.status(201).json(newMilestone);
});

// UPDATE milestone
app.put('/api/goals/:goalId/milestones/:milestoneId', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.goalId));
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  
  const milestone = goal.milestones.find(m => m.id === parseInt(req.params.milestoneId));
  if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
  
  const { title } = req.body;
  if (title) milestone.title = title;
  
  res.json(milestone);
});

// DELETE milestone
app.delete('/api/goals/:goalId/milestones/:milestoneId', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.goalId));
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  
  const index = goal.milestones.findIndex(m => m.id === parseInt(req.params.milestoneId));
  if (index === -1) return res.status(404).json({ message: 'Milestone not found' });
  
  goal.milestones.splice(index, 1);
  res.json({ message: 'Milestone deleted' });
});

// COMPLETE milestone
app.patch('/api/goals/:goalId/milestones/:milestoneId/complete', (req, res) => {
  const goal = goals.find(g => g.id === parseInt(req.params.goalId));
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  
  const milestone = goal.milestones.find(m => m.id === parseInt(req.params.milestoneId));
  if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
  
  milestone.status = 'COMPLETED';
  
  // Check if all milestones are completed
  const allCompleted = goal.milestones.every(m => m.status === 'COMPLETED');
  if (allCompleted && goal.milestones.length > 0) {
    goal.status = 'COMPLETED';
  }
  
  res.json(milestone);
});

// LOG focus session
app.post('/api/milestones/:milestoneId/sessions', (req, res) => {
  const { durationMinutes } = req.body;
  const session = {
    id: Date.now(),
    durationMinutes,
    createdAt: new Date().toISOString(),
  };
  
  // Find and update the milestone
  for (const goal of goals) {
    const milestone = goal.milestones.find(m => m.id === parseInt(req.params.milestoneId));
    if (milestone) {
      milestone.focusSessions.push(session);
      return res.status(201).json(session);
    }
  }
  
  res.status(404).json({ message: 'Milestone not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('✓ PUT endpoint for milestone updates enabled');
  console.log('✓ DELETE endpoint for milestone deletion enabled');
});
