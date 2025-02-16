import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Request both profile and email scopes
      provider.addScope('profile');
      provider.addScope('email');

      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Use a fallback avatar if the photoURL is missing
      const photoURL = result.user.photoURL || "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";

      // Send user data to your backend Google endpoint
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: photoURL,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google sign in failed on server');
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Google sign-in was cancelled. Please try again.");
      } else {
        toast.error(error.message);
      }
      console.error('Could not sign in with Google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
