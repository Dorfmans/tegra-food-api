import type { NextApiRequest, NextApiResponse } from 'next'
import type { signUpTypes } from '../../types/signUpTypes'
import { userModels } from '../../models/userModels'
import { dbConnection } from '../../middlewares/dbConnection'
import { upload, cosmicImageUploader } from '../../services/cosmicImageUploader'
import nc from 'next-connect'
import { corsPolicy } from '../../middlewares/corsPolicy'


const signUp = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const user = req.body as signUpTypes

        if (!user.name || user.name.length < 2) { return res.status(400).json({ error: 'Invalid Username' }) }

        if (!user.email
            || user.email.length < 5
            || !user.email.includes('@')
            || !user.email.includes('.')) { return res.status(400).json({ error: 'Invalid Email' }) }

        if (!user.password || user.password.length < 4) { return res.status(400).json({ error: 'Invalid Password' }) }

        const image = await cosmicImageUploader(req)


        const savingUser = {
            name: user.name,
            email: user.email,
            password: user.password,
            image: image?.media?.url
        }

        const sameUserEmail = await userModels.find({ email: user.email })
        if (sameUserEmail && sameUserEmail.length > 0) { return res.status(400).json({ error: 'Email already signed up' }) }

        await userModels.create(savingUser)
        return res.status(201).json({ message: 'User Created' })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Something went wrong...' })
    }
}

const handler = nc()
    .use(upload.single('image'))
    .post(signUp)


export const config = {
    api: {
        bodyParser: false
    }
}

export default corsPolicy(dbConnection(handler))
