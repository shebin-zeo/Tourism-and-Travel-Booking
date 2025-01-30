import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      // Reset the form after successful update
      setFormData({ ...formData, password: '' });
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  //delete user functionality
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }; 





  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <div className='flex flex-col items-center'>
        <img
          src={currentUser?.avatar || '/default-avatar.png'}
          alt='Profile'
          className='rounded-full h-24 w-24 object-cover mb-4'
        />
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='border p-3 rounded-lg'
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='border p-3 rounded-lg'
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='border p-3 rounded-lg'
          value={formData.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
      {updateSuccess && (
        <p className='text-green-700 mt-5'>Profile updated successfully!</p>
      )}
    </div>
  );
}