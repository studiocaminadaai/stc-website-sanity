// update-sanity-cors.js
const fetch = require('node-fetch');
const { execSync } = require('child_process');

async function updateCors() {
  const ngrokUrl = execSync('curl -s http://localhost:4040/api/tunnels | jq -r .tunnels[0].public_url').toString().trim();
  // Then use Sanity API to update CORS origins
  // (requires SANITY_AUTH_TOKEN)
}