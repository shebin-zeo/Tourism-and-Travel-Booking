import e from 'express';
import User from '../models/user.model.js';//The controller imports the User model from the models/user.model.js file.
import bcrypt from 'bcrypt';//The controller imports the bcrypt library to hash the password before saving it to the database.

export const signup= async(req,res)=>{
    const {username,email,password}=req.body;
    const hashedPassword=bcrypt.hashSync(password,10);
    const newUser=new User({username,email,password:hashedPassword});

    try{
        await newUser.save();
        res.status(201).json({message:'User created successfully'});
    }catch(error)
    {
        res.status(500).json(error.message);

    }
};


 