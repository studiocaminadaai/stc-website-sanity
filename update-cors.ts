import axios from 'axios';
import * as dotenv from 'dotenv';

// Load the active site's env file (.env.noum / .env.orem), chosen by SANITY_ACTIVE_ENV
// via npm run update-cors:noum / update-cors:orem.
const activeEnv = process.env.SANITY_ACTIVE_ENV;
if (!activeEnv) {
    console.error('❌ No site selected. Use: npm run update-cors:noum  or  npm run update-cors:orem');
    process.exit(1);
}
dotenv.config({ path: `.env.${activeEnv}`, quiet: true });

// --- Sanity Project Configuration ---
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) {
    console.error(`❌ SANITY_STUDIO_PROJECT_ID missing in .env.${activeEnv}`);
    process.exit(1);
}
console.log(`🎯 Target: ${process.env.SANITY_STUDIO_TITLE || activeEnv} (${projectId})`);

if (!token) {
    console.error('❌ Security Error: SANITY_AUTH_TOKEN environment variable is missing.');
    process.exit(1);
}

// --- Endpoints ---
const ngrokApiUrl = 'http://127.0.0.1:4040/api/tunnels';
// Route directly to the Management API, not the Content API
const sanityManagementUrl = `https://api.sanity.io/v2023-01-01/projects/${projectId}/cors`;

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

        const publicUrl = tunnels.find((t: any) => t.proto === 'https')?.public_url;

        if (!publicUrl) {
            console.error('❌ Ngrok Error: Could not find an active HTTPS public URL.');
            return;
        }

        console.log(`✅ Found new Ngrok URL: ${publicUrl}`);
        console.log('⏳ Adding to Sanity CORS...');

  // 2. Add the URL to Sanity's CORS list via POST
        await axios.post(
            sanityManagementUrl,
            { origin: publicUrl, allowCredentials: true },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Success! ${publicUrl} has been authorized in Sanity.`);

 } catch (error: any) {
        if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
            console.error(`❌ Connection Refused: Could not connect to the Ngrok API at ${ngrokApiUrl}. Is Ngrok running?`);
        } else {
  const sanityMsg = error.response?.data?.message || error.message;
            // If Sanity says it's already there, that's a success!
            if (sanityMsg && sanityMsg.includes('Duplicate origin already exists')) {
                console.log('✅ Success! The Ngrok URL is already authorized in Sanity.');
            } else {
                console.error('❌ Sanity API Error:', sanityMsg);
            }
        }
    }
}

updateSanityCors();