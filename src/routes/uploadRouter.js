const uploadImageRouter = require("express").Router();

const isLogin = require("../middleware/checkedLogin");
const upload = require("../middleware/uploadFile");
const { uploadImageService } = require("../services/uploadImage");


uploadImageRouter.post('/upload', isLogin, upload.single('file'), uploadImageService)


module.exports = uploadImageRouter;