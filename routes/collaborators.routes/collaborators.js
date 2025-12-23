import authenticateToken from "../../middleware/authenticateToken.js";
import {
  acceptPost,
  rejectPost,
  get_collaborator
} from "../../controllers/posts/collabrators.js";
import express from "express";
const router = express.Router();

router.use(authenticateToken);

router.post("/reject_post", rejectPost);
router.post("/accept_post/:id/:postId", acceptPost);
router.get('/get',get_collaborator)

export default router;
