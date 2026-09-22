import { Router } from "express";
import pool from "../db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import axios from "axios";
import { FHIR_BASE_URL } from "../fhirServices";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    const { email, password, role, firstName, lastName, birthDate } = req.body;

    try {
        let fhirPatientId: string | null = null;

        if (role === "patient") {
            const fhirSearchUrl =
                `${FHIR_BASE_URL}/Patient` +
                `?given=${encodeURIComponent(firstName)}` +
                `&family=${encodeURIComponent(lastName)}` +
                `&birthdate=${encodeURIComponent(birthDate)}`;

            const fhirResponse = await axios.get(fhirSearchUrl, {
                headers: { Accept: "application/fhir+json" },
            });
            const bundle = fhirResponse.data;

            if (!bundle.entry || bundle.entry.length === 0) {
                return res.status(404).json({
                    error: `No matching medical record found for ${firstName} ${lastName} on the health server.`,
                });
            }

            if (bundle.entry.length > 1) {
                return res.status(409).json({
                    error: "Multiple clinical records found with those details. Identity matching is ambiguous.",
                });
            }

            fhirPatientId = bundle.entry[0].resource?.id ?? null;
            if (!fhirPatientId) {
                return res.status(502).json({ error: "Matched FHIR patient is missing an id." });
            }
        }

        const passwordHash = await argon2.hash(password);
        const healthId = role === "patient"
            ? `PAT-${Math.floor(1000 + Math.random() * 9000)}`
            : `PHY-${Math.floor(1000 + Math.random() * 9000)}`;

        const result = await pool.query(
            `INSERT INTO users (health_id, role, email, password_hash, fhir_patient_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, health_id, role, email, created_at, fhir_patient_id`,
            [healthId, role, email, passwordHash, fhirPatientId]
        );

        const user = result.rows[0];

        const token = jwt.sign(
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
            `SELECT * FROM users WHERE health_id = $1`,
            [healthId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credential" });
        }

        const user = result.rows[0];

        const validPassword = await argon2.verify(user.password_hash, password);

        if (!validPassword) {
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
