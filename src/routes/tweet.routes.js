import { Router } from "express";
import mongoose from "mongoose";
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js" 

import { verifyJWT } from "../middlewares/auth.middleware.js"

const tweetRouter = Router()

tweetRouter.route("/createTweet").post(createTweet)
tweetRouter.route("/getUserTweets").get(getUserTweets)
tweetRouter.route("/updateTweet/:tweetId").patch(updateTweet)
tweetRouter.route("/deleteTweet/:tweetId").delete(deleteTweet)

export default tweetRouter