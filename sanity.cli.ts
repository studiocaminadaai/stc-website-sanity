// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'
import {config as loadEnvFile} from 'dotenv'

// Which site is active comes from SANITY_ACTIVE_ENV, set by the npm scripts:
//   npm run dev:noum / deploy:noum  -> .env.noum
//   npm run dev:orem / deploy:orem  -> .env.orem
// The file is loaded here explicitly so this config never depends on load order.
const activeEnv = process.env.SANITY_ACTIVE_ENV
if (activeEnv) {
  loadEnvFile({path: `.env.${activeEnv}`, quiet: true})
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const studioHost = process.env.SANITY_STUDIO_HOST

if (!projectId) {
  throw new Error('No site selected. Use: npm run site -- dev <site>  (e.g. noum, orem), or npm run dev:noum / dev:orem')
}

export default defineCliConfig({
  api: {projectId, dataset},
  studioHost,
})
