import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <FiAlertTriangle size={64} className="not-found-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <FiHome size={18} /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

