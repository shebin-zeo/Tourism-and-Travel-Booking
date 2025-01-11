import { time } from "console";
import mongoose    from "mongoose";
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
},{timestamps: true}); // The timestamps option is set to true so that the created_at and updated_at fields are automatically added to the document.
const User = mongoose.model('User', userSchema);
export default User; // User is the name of the model and userSchema is the schema that defines the model. The model is exported so that it can be used in other parts of the application.


