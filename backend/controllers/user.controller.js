import { request, response } from "express"
import { UserModel } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

export const login = async (req = request, res = response) => {
    try {
        const { email, password } = req.body

        //validaciones
        if (!email || !password) return res.status(400).json({ ok: false, msg: 'todos los campos son obligatorios' })

        const [user] = await UserModel.getUserByEmail(email)
        if (!user) return res.status(400).json({ ok: false, msg: 'El usuario no existe' })

        const match = await bcryptjs.compare(password, user.password)

        if (!match) return res.status(400).json({ ok: false, msg: 'Credenciales incorrectos' })

        const token = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        return res.status(200).json({ ok: true, msg: token })
    } catch (error) {
        return res.status(500).json({ ok: false, msg: error.message })
    }
}

export const register = async (req = request, res = response) => {
    try {
        const { email, password, username } = req.body

        //validaciones
        if (!email || !password || !username) return res.status(400).json({ ok: false, msg: 'todos los campos son obligatorios' })

        const [user] = await UserModel.getUserByEmail(email)
        if (user) return res.status(400).json({ ok: false, msg: 'El usuario ya esta registrado' })

        const SALT = +process.env.SALT

        const hashPassword = await bcryptjs.hash(password, SALT)

        const [newUser] = await UserModel.create(username, email, hashPassword)

        const token = jwt.sign(
            {
                email: newUser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        return res.status(200).json({ ok: true, msg: token })
    } catch (error) {
        return res.status(500).json({ ok: false, msg: error.message })
    }
}
