import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Client } from 'pg';
import * as argon2 from 'argon2';

dotenv.config();

const FHIR_SERVER = process.env.FHIR_BASE_URL || 'http://localhost:8080/fhir';
const SYNTHEA_DIR = path.join(__dirname, '../../synthea-generator/output/fhir');

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function uploadToFhir(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const bundle: fhir4.Bundle = JSON.parse(fileContent);
    return await axios.post(FHIR_SERVER, bundle, {
        headers: { 'Content-Type': 'application/fhir+json' }
    });
}


async function seedServer() {
    try {
        await pgClient.connect();
        console.log('Connected to PostgreSQL database');

        const files = fs.readdirSync(SYNTHEA_DIR);
        const infraFiles = files.filter(file => file.startsWith('hospital') || file.startsWith('practitioner'));
        const patientFiles = files.filter(file => file.endsWith('.json') && !file.startsWith('hospital') && !file.startsWith('practitioner'));

        console.log(`Found ${infraFiles.length} infrastructure logs and ${patientFiles.length} patient records.`);
        console.log('Uploading infrastructure logs...');
        for (const file of infraFiles) {
            await uploadToFhir(path.join(SYNTHEA_DIR, file));
        }
        console.log('Uploading patient records...');
        let userCount = 1;
        for (const file of patientFiles) {
            const fhirResponse = await uploadToFhir(path.join(SYNTHEA_DIR, file));
            const patientLocation = fhirResponse.data.entry?.find(
                (e: any) => e.response?.location?.includes('Patient/')
            )?.response?.location;
            if(patientLocation) {
                const fhirPatientId = patientLocation.split('/')[1];
                const mockEmail = `patient_${userCount}@portal.com`;
                const password = 'Password123';
                const mockPasswordHash = await argon2.hash(password);
                const randomInt = Math.floor(1000 + Math.random() * 9000);
                const mockHealthId = `PAT-${randomInt}`;
                const mockRole = 'patient';
                const sqlInsert = 
                    `INSERT INTO users (health_id, role, email, password_hash, fhir_patient_id)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (email) DO NOTHING;`;
                await pgClient.query(sqlInsert, [mockHealthId, mockRole, mockEmail, mockPasswordHash, fhirPatientId]);
                console.log(`User ${mockEmail} linked to FHIR ID ${fhirPatientId} in database`);
                userCount++;
            } else {
                console.log(`No patient location found for ${file}`);
            }
        }
        console.log('All files uploaded successfully!');
    } catch (error: any) {
        console.error('Error seeding FHIR server:', error.message);
    } finally {
        await pgClient.end();
        console.log('Disconnected from PostgreSQL database');
    }
}

seedServer();