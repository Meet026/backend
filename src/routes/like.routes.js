import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/toggleVideoLike/:videoId").post(toggleVideoLike)
router.route("/toggleCommentLike/:commentId").post(toggleCommentLike)
router.route("/toggleTweetLike/:tweetId").post(toggleTweetLike)
router.route("/likedVideo").get(getLikedVideos)

export default router
