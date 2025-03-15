import Subscription from '../models/subscription.model.js';

export const subscribeUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Check if the email is already subscribed.
    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }
    const subscription = await Subscription.create({ email });
    return res.status(201).json({ message: "Subscription successful", subscription });
  } catch (err) {
    next(err);
  }
};
