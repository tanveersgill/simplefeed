import bcrypt from "bcrypt"
import {sign, verify} from "jsonwebtoken"
import User from "../models/User.js"

//registration 
export const register = async (req, res, next) => {
    try {
        const { //destructure the following from the request body
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation 
        } = req.body

        const salt = await bcrypt.genSalt()
        const hashedPw = await bcrypt.hash(password, salt)
        const newUser = new User(
            {
                firstName,
                lastName,
                email,
                password: hashedPw,
                picturePath,
                friends,
                location,
                occupation,
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000)
            }
        )
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) { //any potential error from mongodb
        res.status(500).json({error: err.message})
    }
}

//login
export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body 
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: "User does not exist"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        delete user.password
        res.status(200).json({token,user})
    } catch (err) {
        res.status(500).json({error: err})
    }
}