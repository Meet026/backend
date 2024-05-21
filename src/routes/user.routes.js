import { Router } from "express";
import { 
        registerUser, 
        loginUser, 
        logoutUser, 
        refreshAccessToken, 
        updateUserAvatar, 
        getCurrentUser, getUserChannel, 
        changeCurrentpassword, 
        updateAccountDetails, updateUserCoverImage, 
        getWatchHistory
    } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { ApiError } from "../utils/apiError.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentpassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails) // patch - jetli details update thay chhe e j database ma update thase badhi details update thase nay

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/get-channel/:username").get(verifyJWT, getUserChannel)

router.route("/history").get(verifyJWT, getWatchHistory)




export default router