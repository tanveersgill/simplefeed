import { format } from "morgan";
import User from "../models/User";

//read
export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if(!user) {
            throw new Error("Error; user not found")
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}

export const getUserFriends = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)

        const friends = await Promise.all( //takes in array of promises and resolves if all promises are resolved
            user.friends.map((id) => { //for each friend id the user has, map and create an array of the friends
                User.findById(id)
            })
        )
        const formattedFriends = friends.map( //putting together the response we will send to the frontend
            (friend) => {
                return {_id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json({formattedFriends})
    } catch (err) {
       res.status(404).json({error: err.message})
    } 
}

//update
export const addRemoveFriend = async (req, res, next) => {
    try {
        const {id, friendId} = req.params
        const userId = id;
        const user = await User.findById(userId)
        const friend = await User.findById(friendId)

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => {
                id !== friendId //filters out the friend from the user's friend list
            })
            friend.friends = friend.friends.filter((id) => {
                id !== userId //filter out the user from the friend's friend list
            })
        } else { //they're trying to add
            user.friends.push(friendId)
            friend.friends.push(userId)
        }
        await user.save()
        await friend.save()

        const friends = await Promise.all( //once again format the response
            user.friends.map((id) => { 
                User.findById(id)
            })
        )
        const formattedFriends = friends.map( 
            (friend) => {
                return {_id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json({formattedFriends})
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}