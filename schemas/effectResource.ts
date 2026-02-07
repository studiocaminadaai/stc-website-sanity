// stc-website-sanity/schemas/effectResource.ts ID 212.1
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'effectResource',
  title: 'Effect Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Effect Name',
      type: 'string',
      description: 'e.g., "Standard Liquid", "Dark Glass", "Neon RGB"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'effectType',
      title: 'Effect Logic',
      type: 'string',
      options: {
        list: [
          {title: 'Liquid Metal (Distortion)', value: 'liquid'},
          {title: 'Apple Glass (Blur/Frost)', value: 'glass'},
          {title: 'RGB Split (Chromatic)', value: 'rgb'},
          {title: 'Custom CSS', value: 'custom'},
        ],
      },
      initialValue: 'liquid',
    }),
    
    // --- LIQUID SETTINGS ---
    defineField({
      name: 'liquidDistortion',
      title: 'Distortion Amount',
      type: 'number',
      description: 'How much the element "melts". Default: 50.',
      initialValue: 50,
      hidden: ({parent}) => parent?.effectType !== 'liquid',
      validation: Rule => Rule.min(0).max(100)
    }),
    defineField({
      name: 'liquidSpeed',
      title: 'Flow Speed',
      type: 'number',
      description: 'Speed of the animation. Default: 1.',
      initialValue: 1,
      hidden: ({parent}) => parent?.effectType !== 'liquid',
    }),

    // --- GLASS SETTINGS ---
    defineField({
      name: 'glassBlur',
      title: 'Blur Strength (px)',
      type: 'number',
      description: 'iOS default is around 20px.',
      initialValue: 20,
      hidden: ({parent}) => parent?.effectType !== 'glass',
    }),
    defineField({
      name: 'glassOpacity',
      title: 'Surface Opacity',
      type: 'number',
      description: '0.0 to 1.0. Default 0.2.',
      initialValue: 0.2,
      hidden: ({parent}) => parent?.effectType !== 'glass',
    }),
    defineField({
      name: 'glassOutline',
      title: 'Outline Strength',
      type: 'number',
      description: '0.0 to 1.0. Default 0.3.',
      initialValue: 0.3,
      hidden: ({parent}) => parent?.effectType !== 'glass',
    }),

    // --- CSS OVERRIDE ---
    defineField({
      name: 'customCss',
      title: 'Custom CSS Code',
      type: 'text',
      rows: 5,
      hidden: ({parent}) => parent?.effectType !== 'custom',
      description: 'Write raw CSS here. Use "&" to target the element.'
    }),
  ],
})