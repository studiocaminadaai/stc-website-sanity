// stc-website-sanity/schemas/fontResource.ts ID 194.51
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'fontResource',
  title: 'Font Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Display Name',
      type: 'string',
      description: 'Internal label for YOU (e.g., "Inter Bold" or "SangBleu Empire Regular").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'family',
      title: 'CSS Font Family Name',
      type: 'string',
      description: 'IMPORTANT: Use the EXACT SAME name here for all cuts of the same font (e.g., "Inter") so the browser groups them.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {
        list: [
          {title: 'Google Fonts', value: 'google'},
          {title: 'Adobe Typekit', value: 'adobe'},
          {title: 'Custom / Upload', value: 'custom'},
        ],
      },
      initialValue: 'custom',
    }),
    
    // --- FILE UPLOADS ---
    defineField({
      name: 'fontFile',
      title: 'Font File (WOFF2) - Primary',
      type: 'file',
      options: { accept: '.woff2' },
      hidden: ({parent}) => parent?.provider !== 'custom',
      description: 'Upload the modern .woff2 file here (Required).'
    }),
    defineField({
      name: 'fontFileWoff',
      title: 'Font File (WOFF) - Fallback',
      type: 'file',
      options: { accept: '.woff' },
      hidden: ({parent}) => parent?.provider !== 'custom',
      description: 'Upload the older .woff file here (Optional, for older browsers).'
    }),

    // --- STYLE DEFINITIONS (Unhidden for all providers) ---
    defineField({
      name: 'fontWeight',
      title: 'Font Weight',
      type: 'string',
      description: 'Select the weight this specific resource represents.',
      options: {
        list: [
          {title: '100 - Thin', value: '100'},
          {title: '200 - Extra Light', value: '200'},
          {title: '300 - Light', value: '300'},
          {title: '400 - Regular', value: '400'},
          {title: '500 - Medium', value: '500'},
          {title: '600 - Semi Bold', value: '600'},
          {title: '700 - Bold', value: '700'},
          {title: '800 - Extra Bold', value: '800'},
          {title: '900 - Black', value: '900'},
        ]
      },
      initialValue: '400',
    }),
    defineField({
      name: 'fontStyle',
      title: 'Font Style',
      type: 'string',
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Italic', value: 'italic'},
        ]
      },
      initialValue: 'normal',
    }),
    
    // EXTERNAL LINKS
    defineField({
      name: 'externalUrl',
      title: 'External Embed URL',
      type: 'url',
      hidden: ({parent}) => parent?.provider === 'custom',
      description: 'The href URL for Google or Adobe (e.g. https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap).'
    }),
  ],
})