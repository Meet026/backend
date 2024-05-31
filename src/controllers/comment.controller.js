import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    
    const commentList = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as :"AllComments" ,
            }
        },
        {
            $addFields: {
                totalComments: {
                    $size: "$AllComments"
                }
            }
        },
        // {
        //     $project: {
        //         title: 1,
        //         content:1,
        //         description: 1,
        //         totalComments: 1,
        //         owner: 1    
        //     }
        // }
    ])

    res
    .status(200)
    .json(
        new ApiResponse(200, commentList, "All comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video id is required")
    }

    const { content } =  req.body

    if(!content){
        throw new ApiError(400, "cannot left content empty")
    }

    const newComment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id
    })

    if(!newComment){
        throw new ApiError(400, "Something went wrong while posting Comment")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, newComment, "Comment post seccessfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } =req.params

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "Comment doesn't exist")
    }

    const  { content } = req.body

    if(!content){
        throw new ApiError(400, "cannot left content empty")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content
            }
        },
        {
            new: true
        }
    )

    if(req.user?._id.toString() !== comment.owner.toString()){
        throw new ApiError(400, "You cannot update others comment")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "comment updated Succesfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "Comment doesn't exist")
    }    

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(!deletedComment){
        throw new ApiError(400, "Somrthing went wrong while deleting comment")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, deletedComment, "comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }