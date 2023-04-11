import express from "express"
import Post from "../../models/Post.js"
import User from "../../models/User.js"

//create 
export const createPost = async (req, res, next) => {
    try {
        const {userId, description, picturePath} = req.body
        const user = await User.findById(userId)
        const newPost = new Post({
            userId, 
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description, 
            userPicturePath: user.picturePath,
            picturePath,
            like: {},
            comments: {}
        })
        await newPost.save()
        
        const post = await Post.find() //returns an updated list of all the posts
        res.status(201).json(post) //send all the posts to the frontend so it has an updated list

    } catch (err) {
        res.status(409).json({error : err.message})
    }
}

//read
export const getFeedPosts = async (req, res, next) => {
    try {
        const post = await Post.find()
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}

export const getUserPosts = async (req, res, next) => {
    
    try {
        const userId = req.params.userId
        const post = await Post.find({userId})
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}

//update 

export const likePost = async (req, res, next) => {
    try {
        const id = req.params.id
        const userId = req.body.userId

        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId)
        if(isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            {likes: post.likes},
            { new: true }
        )

        res.status(200).json(updatedPost)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}