import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), (req, res) => {

  const imagePath = req.file.path;

  res.json({
    message: "Image uploaded",
    image: imagePath
  });

});

export default router;