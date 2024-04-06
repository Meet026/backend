import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
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

    const {fullname, email, username, password } = req.query
    console.log("email: ", email, password);

    // if(fullname === ""){
    //     throw new apiError(400, "fullname is required")
    // }

    if(
    [fullname, email, username, password].some((feild) => 
    field?.trim() === "")
    ){
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409, "user with username or email already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
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
        username: username.toLowercase()
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

export { 
    registerUser,
}