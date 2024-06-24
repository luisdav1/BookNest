import { db } from "../database/conection.database.js"


const getAll = async () => {
    const {rows} = await db.query('SELECT * FROM users')
    return rows
}

const getUserByEmail = async email => {
    const {rows} = await db.query(
        {
            text:'SELECT * FROM users WHERE email = $1',
            values:[email]
        }
    )
    return rows
}

const create = async (name,email,password) => {
    const {rows} = await db.query(
        {
            text: `
                INSERT INTO users (email,password,username)
                VALUES ($1,$2,$3)
                RETURNING email, username, uid
            `,
            values:[email,password,name]
        }
    )
    return rows
}


export const UserModel = {
    getAll,
    getUserByEmail,
    create
}