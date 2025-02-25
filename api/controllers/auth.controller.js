import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET
    ); 
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res) => {
try{
  res.clearCookie('access_token');
  res.status(200).json('User has been logged out!');

}catch(error){
  next(error);

}
};

// In auth.controller.js

export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validAdmin = await User.findOne({ email });
    if (!validAdmin) return next(errorHandler(404, 'Admin not found!'));

    // Check if the user is actually an admin
    if (validAdmin.role !== 'admin')
      return next(errorHandler(403, 'Access denied, not an admin'));

    const validPassword = bcrypt.compareSync(password, validAdmin.password);
    if (!validPassword)
      return next(errorHandler(401, 'Wrong credentials!'));

    // Include role in the token
    const token = jwt.sign(
      { id: validAdmin._id, role: validAdmin.role },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validAdmin._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//Guide sign in
export const guideSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find a user with the provided email and role "guide"
    const guide = await User.findOne({ email, role: 'guide' });
    if (!guide) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, guide.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: guide._id, role: guide.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.status(200).json({
      _id: guide._id,
      username: guide.username,
      email: guide.email,
      role: guide.role,
      token,
    });
  } catch (error) {
    next(error);
  }
};