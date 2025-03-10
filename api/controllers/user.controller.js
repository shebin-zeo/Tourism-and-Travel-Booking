import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10); // Hash the password before saving it to the database.
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { // Use the $set operator to update the any one user's username, email, password, and avatar.
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,// Update the user's username, email, password, and avatar in the database.but avatar is not connected .
        },
      },
      { new: true } // Use the new option to return the updated user document.
    );
    const { password, ...rest } = updatedUser._doc; // Destructure the password from the updated user document.
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }

};

//Admin user management

export const getUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const updateUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};