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