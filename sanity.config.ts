// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {ActiveSettingsField, ActiveSettingsInput} from './schemas/activeSettingsDot'
import {structure} from './structure'
import './studio.css'

// Set by .env.noum / .env.orem via SANITY_ACTIVE_ENV (see package.json scripts).
// No fallback: a missing ID must stop the Studio, not silently open the other site.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
if (!projectId) {
  throw new Error('No site selected. Use: npm run dev:noum  or  npm run dev:orem')
}

export default defineConfig({
  name: 'default',
  title: process.env.SANITY_STUDIO_TITLE || 'StC Website',

  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({structure}), visionTool()],

  form: {
    components: {
      field: ActiveSettingsField,
      input: ActiveSettingsInput,
    },
  },
    
  schema: {
    types: schemaTypes,
    templates: (previous) => [
      ...previous,
      {
        id: 'section-for-project',
        title: 'Section',
        schemaType: 'section',
        parameters: [{name: 'projectKey', type: 'string'}],
        value: (params: {projectKey?: string}) => ({
          projectKey: params.projectKey,
        }),
      },
      {
        id: 'section-site-wide',
        title: 'Site-wide section',
        schemaType: 'section',
        value: {
          projectKey: undefined,
          bgColor: '#FFFFFF',
        },
      },
    ],
  },
})