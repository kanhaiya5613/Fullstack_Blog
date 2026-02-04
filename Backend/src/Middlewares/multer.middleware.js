import multer from "multer";

// steps
// configure storage location and filename
// export the multer upload middleware
const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null, "./public/temp")
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})
export const upload = multer({
    storage
})