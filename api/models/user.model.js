import { time } from "console";
import mongoose    from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // The unique option is set to true so that the username is unique and cannot be duplicated in the database.
    },
    email: {
        type: String,
        required: true,
        unique: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
    },
    role: {
        type: String,
        enum: ["user", "admin","guide"],
        default: "user" // Default role is user. Set to "admin" when necessary.
      }
},{timestamps: true});
// The timestamps option is set to true so that the created_at and updated_at fields are automatically added to the document.

// Pre-save hook that hashes the password if it’s not already hashed
userSchema.pre('save', async function (next) {
    // If password field isn't modified, skip
    if (!this.isModified('password')) return next();
  
    // If password already starts with '$2', assume it is already hashed
    if (this.password && this.password.startsWith('$2')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }


    // Set a default avatar if not provided
  if (!this.avatar || this.avatar.trim() === "") {
    if (this.role === "guide") {
      // Replace with your guide default image URL
      this.avatar = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg";
    } else {
      this.avatar = "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";
    }
  }
  next();
  });
  
 
  



const User = mongoose.model('User', userSchema);
export default User; // User is the name of the model and userSchema is the schema that defines the model. The model is exported so that it can be used in other parts of the application.


