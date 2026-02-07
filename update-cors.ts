import { createClient } from '@sanity/client';
import axios from 'axios';

// --- Sanity Project Configuration ---
// ⚠️ IMPORTANT: Replace these placeholders with your actual Sanity project details!
const projectId = 'l4o0lkxd'; // e.g., 'ab1c2d3e'
const dataset = 'production';
const apiVersion = 'v2024-05-01'; // Use a recent date
const token = 'skcwnSbxW8qgb8fmqCUPrsbA1CHlsGdKG5wBEydniqZrnzW7gJa5t53KtBKArGt0zsxuyP74zgE1ONNqHTYt5qyfDCEkyYd8jELiZo2RXgVgLTwrBGW54JJXXkhZwfPQSSPckOIkn3LWnTksVStSqsiPsKBlyWneo7okYkNaetu6Mdaospgb'; // ⚠️ Must be a token with 'editor' or 'deploy' permissions

// --- Ngrok Endpoint Configuration ---
const ngrokApiUrl = 'http://127.0.0.1:4040/api/tunnels';

// --- Sanity Management Client ---
const sanityClient = createClient({
    projectId: projectId,
    dataset: dataset,
    apiVersion: apiVersion,
    token: token,
    useCdn: false,
});

async function updateSanityCors() {
    console.log('--- Starting Sanity CORS Update ---');

    try {
        // 1. Get the current Ngrok Public URL
        const ngrokResponse = await axios.get(ngrokApiUrl);
        const tunnels = ngrokResponse.data.tunnels;

        if (tunnels.length === 0) {
            console.error('❌ Ngrok Error: No active tunnels found. Ensure ngrok http 3333 is running.');
            return;
        }

        // Find the public HTTPS URL (Ngrok can sometimes start an HTTP one too)
        const publicUrl = tunnels.find((t: any) => t.proto === 'https')?.public_url;

        if (!publicUrl) {
            console.error('❌ Ngrok Error: Could not find an active HTTPS public URL.');
            return;
        }

        console.log(`✅ Found new Ngrok URL: ${publicUrl}`);

        // 2. Get the current list of CORS origins
        const currentCorsResponse = await sanityClient.request({
            url: `/projects/${projectId}/cors`,
            method: 'GET',
        });

        // 3. Prepare the new CORS list
        // Filter out any old Ngrok tunnels and keep any permanent origins (like localhost)
        const permanentOrigins = currentCorsResponse
            .filter((c: any) => !c.origin.includes('ngrok-free.app'))
            .map((c: any) => c.origin);

        const newOrigins = [...permanentOrigins, publicUrl];

        // 4. Update the CORS origins via the Sanity Management API
        // NOTE: This updates ALL CORS entries, replacing the old list entirely.
        await sanityClient.request({
            url: `/projects/${projectId}/cors`,
            method: 'PUT',
            body: newOrigins,
        });

        console.log('--- Successfully Updated CORS Origins ---');
        console.log('New allowed origins for Sanity:', newOrigins);

    } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
            console.error(`❌ Connection Refused: Could not connect to the Ngrok API at ${ngrokApiUrl}. Is Ngrok running?`);
        } else {
            console.error('❌ An unexpected error occurred during CORS update:', error);
        }
    }
}

updateSanityCors();