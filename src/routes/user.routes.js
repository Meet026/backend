import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, updateUserAvatar, getCurrentUser, getUserChannel} from "../controllers/user.controller.js";
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

router.route("/update-avatar").post(updateUserAvatar)

router.route("/get-channel/:username").get(getUserChannel)




export default router