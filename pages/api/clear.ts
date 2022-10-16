import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnection } from '../../middlewares/dbConnection'
import { userModels } from '../../models/userModels'
import nc from 'next-connect'
import { corsPolicy } from "../../middlewares/corsPolicy"

const clearAllCart = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const user = await userModels.findById(req.query.userId)
        const { data } = user
        const [realData] = data

        await userModels.updateOne({ _id: req.query.userId }, { $pullAll: { cart: realData.cart } })

        return res.status(200).json({ message: "Enjoy your Meal" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const handler = nc()
    .delete(clearAllCart)


export default corsPolicy(dbConnection(handler))