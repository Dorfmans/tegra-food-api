import type { NextApiRequest, NextApiResponse } from "next"
import nc from 'next-connect';

import { dbConnection } from "../../middlewares/dbConnection"
import { corsPolicy } from "../../middlewares/corsPolicy"

import { upload, cosmicImageUploader } from '../../services/cosmicImageUploader'

import { productsModels } from "../../models/productsModels"

import { products } from "../../types/products"

const postProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const products = req.body as products

        if (!products.title || !products.price || !products.category) {
            return res.status(400).json({ error: 'Missing Info' })
        }

        const image = await cosmicImageUploader(req)


        const savingProduct = {
            title: products.title,
            price: products.price,
            description: products.description,
            image: image?.media?.url,
            category: products.category,
        }

        const sameTitle = await productsModels.find({ title: products.title })

        if (sameTitle && sameTitle.length > 0) {
            return res.status(400).json({ error: 'Product already registred' })
        }

        await productsModels.create(savingProduct)

        return res.status(201).json({ message: 'Product Created' })

    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: 'Cannot post your product' })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const query = req.query
        let order = null
        let filterResult = {}
        let categoryResult = {}
        let minAndMaxPrice = {}
        let minOrMaxPrice = {}
        let page = Number

        if (!query.page) {
            return res.status(400).json({ error: 'Page not found' })
        }

        page = query.page as any

        if (query?.order) {
            const orderBy = query.order as any
            if (orderBy == 'DESC') {
                order = -1
            }
            if (orderBy == 'ASC') {
                order = 1
            }

        }

        if (query?.filter) {
            const filter = query.filter
            filterResult = {
                $or: [
                    {
                        title: {
                            $regex: filter,
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: filter,
                            $options: 'i'
                        }
                    },
                ]
            }
        }

        if (query?.category) {
            const category = query.category
            categoryResult = { category: category }
        }

        if (query?.min && query?.max) {
            const min = query.min as any
            const max = query.max as any

            minAndMaxPrice = {
                $and: [
                    {
                        price: { $gte: min }
                    },
                    {
                        price: { $lte: max }
                    }
                ]
            }
        }

        if (query?.min || query?.max) {
            const min = query.min as any
            const max = query.max as any

            minOrMaxPrice = {
                $nor: [
                    {
                        price: { $gt: max }
                    },
                    {
                        price: { $lt: min }
                    }
                ]
            }
        }



        const products = await productsModels
            .find(minOrMaxPrice)
            .find(minAndMaxPrice)
            .find(categoryResult)
            .find(filterResult)
            .sort(order ? { title: order } : null)
            .limit(10)
            .skip((page - 1) * 10)


        if (!products || products.length < 1) {
            return res.status(404).json({ message: 'Could not get any product' })
        }
        return res.status(200).json(products)

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Cannot get products' })
    }
}



const handler = nc()
    .use(upload.single('image'))
    .post(postProducts)
    .get(getProducts)


export const config = {
    api: {
        bodyParser: false
    }
}

export default corsPolicy(dbConnection(handler))
