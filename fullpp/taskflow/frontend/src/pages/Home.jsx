import { Link } from 'react-router-dom';
import {
  FiCheckSquare,
  FiBarChart2,
  FiShield,
  FiZap,
  FiArrowRight,
} from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FiCheckSquare size={32} />,
      title: 'Task Management',
      desc: 'Create, organize, and track your tasks with ease. Set priorities, categories, and due dates.',
    },
    {
      icon: <FiBarChart2 size={32} />,
      title: 'Analytics Dashboard',
      desc: 'Get insights into your productivity with detailed statistics and completion rates.',
    },
    {
      icon: <FiShield size={32} />,
      title: 'Secure & Private',
      desc: 'Your data is protected with JWT authentication and encrypted passwords.',
    },
    {
      icon: <FiZap size={32} />,
      title: 'Fast & Responsive',
      desc: 'Built with modern technologies for a smooth and responsive experience on any device.',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Your Tasks
            <span className="gradient-text"> Effortlessly</span>
          </h1>
          <p className="hero-subtitle">
            TaskFlow is a powerful task management application built with the MERN
            stack. Organize your work, track your progress, and boost your
            productivity.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <FiArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <FiArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why TaskFlow?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <h2 className="section-title">Built With</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <strong>M</strong>ongoDB Atlas
          </div>
          <div className="tech-item">
            <strong>E</strong>xpress.js
          </div>
          <div className="tech-item">
            <strong>R</strong>eact + Vite
          </div>
          <div className="tech-item">
            <strong>N</strong>ode.js
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

