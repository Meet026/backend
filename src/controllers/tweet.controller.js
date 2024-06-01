import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if(!tweet){
        throw new ApiError(400, "Tweet not created")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const id = req.user?._id

    const allTweet = await Tweet.aggregate([
        {
            $match: {
                owner: id
            }
        }
    ])

    if(!allTweet){
        throw new ApiError(400, "No tweets found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, allTweet, "All tweet fetched successfuflly")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    const content = "Hello, this tweet from aakanksha vora"

    if(!content){
        throw new ApiError(400, "content is required")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if(updatedTweet.owner !== req.user?._id){
        throw new ApiError(400, "you cannot change others tweet")
    }

    if(!updateTweet){
        throw new ApiError(200, "Something went wrong while updating tweet")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet update successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(deletedTweet.owner !== req.user?._id){
        throw new ApiError(400, "you cannot delete others tweet")
    }

    if(!deletedTweet){
        throw new ApiError(400, "Something went wrong while deleting Tweet")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, deletedTweet, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}