import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnection } from '../../middlewares/dbConnection'
import { userModels } from '../../models/userModels'
import nc from 'next-connect'
import { corsPolicy } from "../../middlewares/corsPolicy"
import { productsModels } from "../../models/productsModels"
import { upload } from "../../services/cosmicImageUploader"
import { ALL } from "dns"

const logIn = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const user = await userModels.find({ email: req.query.email })

        if (!user || user.length < 1) {
            return res.status(400).json({ error: 'Did you sign up?' })
        }

        return res.status(200).json(user)
    } catch (e) {
        alert(e)
        res.status(500).json({ error: 'Something went wrong...' })
    }
}

const addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const product = await productsModels.findById(req.query.productId)

        if (!product || product.length < 1) {
            return res.status(400).json({ error: 'Could not add to cart' })
        }

        const user = await userModels.findById(req.query.userId)

        if (!user || user.length < 1) {
            return res.status(400).json({ error: 'Could not add to cart' })
        }

        user.cart.push(product)
        await userModels.findByIdAndUpdate({ _id: user._id }, user)

        return res.status(200).json({ message: "Product added to cart" })

    } catch (e) {
        alert(e)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const clearCart = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const product = await productsModels.findById(req.query.productId)

        if (!product || product.length < 1) {
            return res.status(400).json({ error: 'Something went wrong' })
        }

        await userModels.updateOne({ _id: req.query.userId }, { $pull: { cart: product } })

        return res.status(200).json({ message: "Product removed from cart" })
    } catch (e) {
        alert(e)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const clearAllCart = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        await userModels.updateOne({ _id: req.query.userId }, { $pullAll: { cart: [] } })

        return res.status(200).json({ message: "Product removed from cart" })
    } catch (e) {
        alert(e)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}


const handler = nc()
    .use(upload.single('cart'))
    .get(logIn)
    .put(addToCart)
    .delete(clearCart)
    .delete(clearAllCart)


export default corsPolicy(dbConnection(handler))