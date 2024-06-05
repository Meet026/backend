import mongoose from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!videoId){
        throw new ApiError(400, "Unable to get videoId")
    }

    const liked = await Like.findOne({
        video: videoId,
        likedBy:req.user?._id
    })

    if(!liked){
        const newLike = await Like.create({
            video: videoId,
            likedBy: req.user?._id
        })

        if(!newLike){
            throw new ApiError(400, "unable to toggleLike")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200, newLike, "You Liked this video")
        )
    }else{
        const removeLike = await Like.findOneAndDelete({video: videoId})

        if(!removeLike){
            throw new ApiError(400, "Failed...unable to toggle like")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200, removeLike, "You unliked this video")
        )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!commentId){
        throw new ApiError(400, "unable to get commentId")
    }

    const commentLike = await Like.findOne({comment: commentId, likedBy: req.user?._id})

    if(!commentLike){
        const newLike = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })

        if(!newLike){
            throw new ApiError(400, "unable to toggle like")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200, newLike, "you liked this comment")
        )
    }else{
        const removeLike = await Like.findOneAndDelete({comment:commentId})

        if(!removeLike){
            throw new ApiError(400, "Failed..unable to toggle like")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200, removeLike, "you unliked ths comment")
        )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!tweetId){
        throw new ApiError(400, "unable to get commentId")
    }

    const tweetLike = await Like.findOne({tweet: tweetId, likedBy: req.user?._id})

    if(!tweetLike){
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })

        if(!newLike){
            throw new ApiError(400, "unable to toggle like")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200, newLike, "you liked this tweet")
        )
    }else{
        const removeLike = await Like.findOneAndDelete({tweet:tweetId})

        if(!removeLike){
            throw new ApiError(400, "Failed..unable to toggle like")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200, removeLike, "you unliked ths tweet")
        )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const allVideo = await Like.aggregate([
        {
            $match: {
                likedBy: req.user?._id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "allLikedVideo",

                pipeline: [
                    {
                        $project: {
                            videoFile: 1,
                            description: 1,
                            thumbnail: 1,
                            duration: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalLikedVideos:{
                    $size: "$allLikedVideo"
                }
            }
        },
        {
            $project: {
                likedBy: 1,
                allLikedVideo: 1,
                totalLikedVideos: 1
            }
        }
    ])

    if(!allVideo){
        throw new ApiError(400, "Unable to fetch liked video list")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, allVideo, "All Liked Videoo fetched successsfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}