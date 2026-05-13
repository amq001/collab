import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const { fullname, email, password } = req.body;

    try {
        if(!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email:email });
        if (user) {
            return res.status(400).json({message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        })

        if (newUser) {
            const savedUser = await newUser.save();
            const token = generateToken(savedUser._id, res);
            
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullname, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }
            
            return res.status(201).json({
                _id: savedUser._id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req,res)=>{
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email:email });

        if (!user) {
            return res.status(400).json({message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.error("Error in login: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (_,res)=>{
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: 'Logged out successfully' });
}

export const updateProfile = async (req,res)=>{
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateProfile: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

