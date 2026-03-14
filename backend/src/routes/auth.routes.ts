import { Router } from "express";
import pool from "../db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/register", async(req, res) => {
    const { firstName, lastName, email, password, role, dateOfBirth, phone } = req.body;
    try {
        const passwordHash = await argon2.hash(password);
        const healthId = role === "patient"
        ? `PAT-${Math.floor(1000 + Math.random() * 9000)}`
        : `PHY-${Math.floor(1000 + Math.random() * 9000)}`;

        const result = await pool.query(
            `INSERT INTO users (health_id, role, email, password_hash, first_name, last_name, date_of_birth, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, health_id, role, first_name, last_name`,
            [healthId, role, email, passwordHash, firstName, lastName, dateOfBirth, phone]
        );

        const user = result.rows[0];
        
        const token = jwt.sign (
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" }); 
    }
});

authRouter.post("/login", async (req, res) => {
    const { healthId, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM users Where health_id = $1`,
            [healthId]
        );

        if(result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credential" });    
        }

        const user = result.rows[0];

        const validPassword = await argon2.verify(user.password_hash, password);

        if(!validPassword) {
            return res.status(401).json({ error: "Invalid credential" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        const { password_hash, ...safeUser } = user;
        res.json({ token, user: safeUser });

    } catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});
