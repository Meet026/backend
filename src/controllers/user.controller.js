import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndrefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        console.log("access",accessToken, "refresh",refreshToken);
        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    console.log("in registerUser");
    // get User details from frontend
    // res.send('Email received: ' + email);
    // console.log(password);
    // res.send('password received: ' + password);
    // validation - not empty
    // check if user already exist: username, eamil
    // check for images and avatar
    // upload them to cloudinary, avatar
    // user user object -- create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res 

    const {fullname, email, username, password } = req.body
    console.log("body", req.body)
    console.log("email: ", email, password, username, fullname);

    // if(fullname === ""){
    //     throw new apiError(400, "fullname is required")
    // }

    // if(
    // [fullname, email, username, password].some((feild) => 
    // field?.trim() === "")
    // ){
    //     throw new ApiError(400, "all fields are required")
    // }

    const existedUser = await User.findOne({
        $or: [{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409, "user with username or email already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.path;
    console.log(avatarLocalPath);

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
        console.log(coverImageLocalPath)
    }

    if(!avatarLocalPath){
        console.log("avatar url", avatarLocalPath)
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        
        throw new ApiError(400, "avatar file is required")
    }

     const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //those two field are not selected when we get response back
     )

     if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
     }

     return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
     )
}) 

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or mail
    // find the user
    // password check
    // access and refresh token 
    // send cookie

    const {email, username , password} = req.body
    console.log(email, password);
    if(!username && !email){
        throw new ApiError(400, "username or email is required");
    }

    // if any one field is mandatory
    if(!(username || email)){
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or : [{ email }, { username }]
    })

    if(!user){
        throw new ApiError(400, "user doesn't exist")
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndrefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            }, "user loggedIn successfully  "
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, 
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefresshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefresshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const dekodedToken = jwt.verify(
            incomingRefresshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(dekodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid request Token")
        }
    
        if(incomingRefresshToken !== user?.refreshToken){
            throw new ApiError(401, "refreshToken if Expired or used")
        }
    
        const option = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndrefreshToken(user._id)
    
        return res.status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken
                },
                "Access tokrn refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, "invalid request token")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
    
