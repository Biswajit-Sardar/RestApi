import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Task from './models/Task.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@taskflow.com',
      password: 'demo123',
    });

    // Create demo tasks
    const tasks = [
      {
        user: user._id,
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the MERN stack project',
        status: 'in-progress',
        priority: 'high',
        category: 'work',
        dueDate: new Date('2026-10-10'),
        tags: ['documentation', 'project'],
      },
      {
        user: user._id,
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests on GitHub',
        status: 'pending',
        priority: 'medium',
        category: 'work',
        dueDate: new Date('2026-10-08'),
        tags: ['github', 'review'],
      },
      {
        user: user._id,
        title: 'Grocery shopping',
        description: 'Buy groceries for the week - fruits, vegetables, milk',
        status: 'pending',
        priority: 'low',
        category: 'shopping',
        dueDate: new Date('2026-10-06'),
        tags: ['shopping', 'weekly'],
      },
      {
        user: user._id,
        title: 'Morning workout routine',
        description: '30 min cardio + 20 min strength training',
        status: 'completed',
        priority: 'medium',
        category: 'health',
        completedAt: new Date(),
        tags: ['fitness', 'daily'],
      },
      {
        user: user._id,
        title: 'Study React hooks',
        description: 'Deep dive into useCallback, useMemo, and custom hooks',
        status: 'in-progress',
        priority: 'high',
        category: 'education',
        dueDate: new Date('2026-10-12'),
        tags: ['react', 'learning'],
      },
      {
        user: user._id,
        title: 'Pay electricity bill',
        description: 'Due before end of month',
        status: 'pending',
        priority: 'urgent',
        category: 'finance',
        dueDate: new Date('2026-10-05'),
        tags: ['bills', 'monthly'],
      },
      {
        user: user._id,
        title: 'Team meeting preparation',
        description: 'Prepare slides and agenda for weekly team meeting',
        status: 'pending',
        priority: 'high',
        category: 'work',
        dueDate: new Date('2026-10-07'),
        tags: ['meeting', 'presentation'],
      },
      {
        user: user._id,
        title: 'Update resume',
        description: 'Add latest project experience and skills',
        status: 'pending',
        priority: 'low',
        category: 'personal',
        tags: ['career', 'personal'],
      },
    ];

    await Task.insertMany(tasks);

    console.log(' Demo data seeded successfully!');
    console.log(' Demo Login: demo@taskflow.com / demo123');
    process.exit();
  } catch (error) {
    console.error(` Error: ${error.message}`);
    process.exit(1);
  }
};

// Run with: npm run seed
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Task.deleteMany();
    console.log(' All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}

