import express from "express"
import {
    getUser, 
    getUserFriends,
    addRemoveFriend
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
//all user-related routes; getting profiles, adding friends, etc

//read routes:
router.get("/:id", verifyToken, getUser)
router.get("/:id/friends", verifyToken, getUserFriends) //for adding/removing friends

//update routes:
router.patch("/:id/:friendId", verifyToken, addRemoveFriend)


export default router;