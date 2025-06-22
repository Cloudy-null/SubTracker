import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'Username is required'], trim: true, minlength: 2, maxLength: 64},
    email: {type: String, unique:true ,required: [true, 'Email is required'],trim: true, lowercase: true, match:[/\S+@\S+\.\S+/,'please enter a valid email address']},
    password: {type: String, required: [true, 'Password is required'], minlength: 6, maxLength: 64},
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;