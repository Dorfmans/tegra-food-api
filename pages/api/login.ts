import type { NextApiRequest, NextApiResponse } from "next"
import { dbConnection } from '../../middlewares/dbConnection'
import { userModels } from '../../models/userModels'
import nc from 'next-connect'
import { corsPolicy } from "../../middlewares/corsPolicy"

const logIn = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const user = await userModels.find({ email: req.query.email })

        if (!user || user.length < 1) {
            return res.status(400).json({ error: 'Did you sign up?' })
        }

        return res.status(200).json(user)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong...' })
    }
}


const handler = nc()
    .get(logIn)


export default corsPolicy(dbConnection(handler))