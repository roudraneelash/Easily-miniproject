import multer from "multer";

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    //the callback function receives ,1. the error, i.e null and the path where it will be stored
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    //to unqiue the file name
    const name = Date.now() + "" + file.originalname;
    cb(null, name);
  },
});

export const uploadFile = multer({
  storage: storageConfig,
});
