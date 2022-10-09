import multer from "multer"
import cosmicjs from "cosmicjs"

const {
    IMAGE_SLUG,
    IMAGE_WRITE_KEY } = process.env

const Cosmic = cosmicjs()
const imageBucket = Cosmic.bucket({
    slug: IMAGE_SLUG,
    write_key: IMAGE_WRITE_KEY
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const cosmicImageUploader = async (req: any) => {
    if (req?.file?.originalname) {

        if (!req.file.originalname.includes('.png')
            && !req.file.originalname.includes('.jpg')
            && !req.file.originalname.includes('.jpeg')
            && !req.file.originalname.includes('.svg')
        ) {
            throw new Error('Invalid File')
        }
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        }

        return await imageBucket.addMedia({ media: media_object })
    }
}

export { upload, cosmicImageUploader }