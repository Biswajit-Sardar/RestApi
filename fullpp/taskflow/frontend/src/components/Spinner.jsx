import { ClipLoader } from 'react-spinners';

const Spinner = ({ size = 40, color = '#6366f1', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <ClipLoader color={color} size={size} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="spinner">
      <ClipLoader color={color} size={size} />
    </div>
  );
};

export default Spinner;

