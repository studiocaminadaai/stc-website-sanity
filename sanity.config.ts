// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {ActiveSettingsField, ActiveSettingsInput} from './schemas/activeSettingsDot'
import {structure} from './structure'
import './studio.css'

export default defineConfig({
  name: 'default',
  title: process.env.SANITY_STUDIO_TITLE || 'StC Website',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'l4o0lkxd',
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