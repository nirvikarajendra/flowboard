import pool from '../../config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const registerUser = async (name: string, email: string, password: string) =>{
    const existingUser = await pool.query(
        'Select * from users where email = $1',
        [email]
    )

    if(existingUser.rows.length > 0){
        throw new Error('Email already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, passwordHash]
      )

      const user = result.rows[0]

      const token = jwt.sign(
        { userId: user.id},
        process.env.JWT_SECRET!,
        { expiresIn: '7d'}
      )
      return {user, token}
}

export const loginUser = async (email: string, password: string) => {
    const result = await pool.query(
        'Select * from users where email = $1',
        [email]
    )

    if(result.rows.length === 0){
        throw new Error('Invalid credentials')
    }

    const user = result.rows[0]

   const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
        throw new Error('Invalid credentials')
      }

    const token = jwt.sign(
        { userId: user.id},
        process.env.JWT_SECRET!,
        { expiresIn : '7d'}
    )

    return { user: { id: user.id, name: user.name, email: user.email }, token }
}