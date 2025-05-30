import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishVideo,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/publishVideo").post(
    upload.fields([
        {
            name: "videoFile",
            max: 1
        },
        {
            name: "thumbnail",
            max: 1
        }
    ]),
    publishVideo
)

router.route("/:videoId").get(getVideoById)

router.route("/get-videos").get(getAllVideos)

router.route("/update-video/:Id").patch(
    upload.single("thumbnail"), 
    updateVideo
)

router.route("/delete-video/:videoId").delete(deleteVideo)

export default router