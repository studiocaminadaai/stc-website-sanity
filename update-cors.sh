#!/bin/bash
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
sanity cors add "$NGROK_URL" --credentials --project YOUR_PROJECT_ID
echo "CORS updated: $NGROK_URL"