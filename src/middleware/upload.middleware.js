import multer from "multer";

/* =========================
   PROFILE IMAGE STORAGE
========================= */

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileimage");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

export const uploadProfile = multer({
  storage: profileStorage
});


/* =========================
   ACHIEVEMENT IMAGE STORAGE
========================= */

const achievementStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/achievements");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

export const uploadAchievement = multer({
  storage: achievementStorage
});


/* =========================
   RESUME STORAGE (PDF ONLY)
========================= */

const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resume");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const resumeFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter
});

const newsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/news");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const newsImageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadNews = multer({
  storage: newsStorage,
  fileFilter: newsImageFilter
});