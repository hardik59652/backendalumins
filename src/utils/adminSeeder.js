import bcrypt from "bcrypt"
import { User } from "../models/user.model.js"

export const createAdminIfNotExists = async () => {

    try {

        const existingAdmin = await User.findOne({
            role: "admin"
        })

        if (existingAdmin) {
            console.log("Admin already exists")
            return
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        )

        await User.create({
            fullName: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password:  process.env.ADMIN_PASSWORD,
            role: "admin"
        })

        console.log("Admin created successfully")

    } catch (error) {
        console.log("Admin creation error:", error)
    }

}