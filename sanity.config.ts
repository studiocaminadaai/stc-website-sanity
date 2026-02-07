// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
// This path MUST be plural to match your folder
import {schemaTypes} from './schemas' 

export default defineConfig({
  name: 'default',
  title: 'StC Website',

  projectId: 'l4o0lkxd',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})