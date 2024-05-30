import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const userId = req.user?._id;
    console.log(userId);
    
    const videos = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerOfVideos" 
            }
        },
        {
            $project: {
                _id: 1,
                videoFile: 1,
                title: 1,
                thumbnail: 1,
                owner: 1,
                description: 1,
                duration: 1
            }
        }
    ])



    res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title && !description){
        throw new ApiError(400, "Please provide title and description")
    }

    const videoLocalPath = req.files?.videoFile[0].path
    const thumbnailLocalPath = req.files?.thumbnail[0].path

    console.log("video local path :", videoLocalPath)
    console.log("thumbnail local path :", thumbnailLocalPath)

    if(!videoLocalPath){
        throw new ApiError(400, "Video  file is required")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail file is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    console.log("videoFile path :", videoFile.url)
    console.log("thumbnail path :", thumbnail.url)

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile?.url,
        thumbnail: thumbnail?.url,
        duration: videoFile.duration,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "video Publish successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId)

    if(req.user?._id.toString() !== video.owner.toString()){
        throw new ApiError(400, "unauthorized request")
    }

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    console.log(video);

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "video found successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { Id } = req.params
    //TODO: update video details like title, description, thumbnail

    console.log(Id);
    if(!Id){
        throw new ApiError(400, "videoId not found")
    }

    const { title, description } = req.body

    if(!(title && description)){
        throw new ApiError(400, "All fields are required");
    }
    console.log(title, description)

    const thumbnailLocalPath = req.file?.path

    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail required")
    }

    // const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    console.log(thumbnail);

    const updatedVideo = await Video.findByIdAndUpdate(
        Id,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: thumbnail.url
            }
        },
        {new: true}
    )

    console.log(req.user?._id)
    console.log(updatedVideo.owner);

    if(req.user._id.toString() !== updatedVideo.owner.toString()){
        throw new ApiError(400, "unauthorized request")
    }    

    res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "details updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findById(videoId)

    if(req.user?._id.toString() !== video.owner.toString()){
        throw new ApiError(400, "Unauthorized request")
    }

    if(!video){
        throw new ApiError(404, "video not found")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if(!deleteVideo){
        throw new ApiError(400, "unable to delete video")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, deletedVideo, "Video delete succesfully")
    )
})



export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}