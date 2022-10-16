import type { NextApiRequest, NextApiResponse } from "next"
import nc from 'next-connect';

import { upload, cosmicImageUploader } from "../../../services/cosmicImageUploader";

import { dbConnection } from "../../../middlewares/dbConnection"
import { corsPolicy } from "../../../middlewares/corsPolicy"


import { productsModels } from "../../../models/productsModels"


const getProductsById = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.url) {

        const idUrl = req.url.replace('/api/products/', '')

        const products = await productsModels.findById(idUrl)

        if (!products) {
            return res.status(400).json({ error: 'Product not found' })
        }

        return res.status(200).json(products)
    }
}

const putProducts = async (req: any, res: NextApiResponse) => {
    try {
        if (req.url) {

            const idUrl = req.url.replace('/api/products/', '')

            const product = await productsModels.findById(idUrl);

            if (!product) {
                res.status(404).json({ error: 'Product not found' });
            }

            const { title, price, description, category } = req.body;
            if (title && title.length > 2) {
                product.title = title;
            }
            if (price && price > 0) {
                product.price = price;
            }
            if (description && description.length > 2) {
                product.description = description;
            }
            if (category && category.length > 2) {
                product.category = category;
            }


            const { file } = req;
            if (file && file.originalname) {
                const image = await cosmicImageUploader(req);
                if (image && image.media && image.media.url) {
                    product.image = image.media.url;
                }
            }
            await productsModels.findByIdAndUpdate({ _id: product._id }, product);

            res.status(200).json({ message: 'Product updated successfully' })
        }
    } catch (e) {
        alert(e)
        return res.status(500).json({ error: 'Cannot update this product' })
    }
}

const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.url) {
            const idUrl = req.url.replace('/api/products/', '')
            const product = await productsModels.findById(idUrl);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' })
            }

            await productsModels.findByIdAndDelete(product)

            return res.status(200).json({ message: 'Product deleted successfully' })
        }

    } catch (e) {
        alert(e)
        return res.status(500).json({ error: 'Cannot delete this product' })

    }

}

const handler = nc()
    .use(upload.single('image'))
    .get(getProductsById)
    .put(putProducts)
    .delete(deleteProduct)

export const config = {
    api: {
        bodyParser: false
    }
}

export default corsPolicy(dbConnection(handler))
