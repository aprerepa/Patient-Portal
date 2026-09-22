import { Router } from "express";
import { authenticateToken } from "../middleware";

export const physicianRouter = Router();

// TODO: Replace with FHIR Appointment search → unique Patient refs (+ last/next visit from Appointment dates)
const mockPatients = [
    {
        id: 1,
        health_id: "PAT-2847",
        first_name: "Sarah",
        last_name: "Johnson",
        date_of_birth: "1973-04-12",
        last_visit: "2024-11-10T15:00:00.000Z",
        next_appointment: "2024-12-16T14:00:00.000Z",
    },
    {
        id: 2,
        health_id: "PAT-3921",
        first_name: "Michael",
        last_name: "Chen",
        date_of_birth: "1980-08-22",
        last_visit: "2024-10-05T16:30:00.000Z",
        next_appointment: "2024-12-20T15:00:00.000Z",
    },
    {
        id: 3,
        health_id: "PAT-4103",
        first_name: "Emily",
        last_name: "Rodriguez",
        date_of_birth: "1987-01-30",
        last_visit: null,
        next_appointment: "2025-01-08T18:00:00.000Z",
    },
    {
        id: 4,
        health_id: "PAT-2156",
        first_name: "Robert",
        last_name: "Martinez",
        date_of_birth: "1964-06-18",
        last_visit: "2024-09-14T13:00:00.000Z",
        next_appointment: null,
    },
];

physicianRouter.get("/patients", authenticateToken, async (_req, res) => {
    try {
        res.json({ patients: mockPatients });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch patients" });
    }
});
