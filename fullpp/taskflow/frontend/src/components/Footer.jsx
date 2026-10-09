import { FiHeart, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>
          © {new Date().getFullYear()} TaskFlow. Made with{' '}
          <FiHeart className="heart-icon" /> using MERN Stack
        </p>
        <div className="footer-links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiGithub size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

