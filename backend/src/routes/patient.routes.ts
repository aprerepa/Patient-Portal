import { Router } from "express";
import pool from "../db";
import { authenticateToken } from "../middleware";

export const patientRouter = Router();

patientRouter.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT id, health_id, role, email, first_name, last_name, date_of_birth, phone, created_at
            FROM users
            WHERE id = $1` ,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});