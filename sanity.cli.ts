// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

// --- ACTIVE PROJECT CONFIGURATION ---
// Toggle comment (//) to switch between NOUM and OREM

// 1. NOUM SETTINGS (Currently Active)
const ACTIVE_PROJECT_ID = 'idoh4jie'
const ACTIVE_STUDIO_HOST = 'noum'

// 2. OREM SETTINGS
// const ACTIVE_PROJECT_ID = 'l4o0lkxd'
// const ACTIVE_STUDIO_HOST = 'orem'

export default defineCliConfig({
  api: {
    projectId: ACTIVE_PROJECT_ID,
    dataset: 'production'
  },
  studioHost: ACTIVE_STUDIO_HOST
})