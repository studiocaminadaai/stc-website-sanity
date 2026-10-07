// stc-website-sanity/schemas/customSpacing.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customSpacing',
  title: 'Break / Spacing',
  type: 'object',
  fields: [
    defineField({
      name: 'preset',
      title: 'Spacing Type',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Line Break', value: 'br' },
          { title: 'Small Space (1rem)', value: '1rem' },
          { title: 'Medium Space (2rem)', value: '2rem' },
          { title: 'Large Space (4rem)', value: '4rem' },
          { title: 'Custom Value', value: 'custom' },
        ],
      },
      initialValue: '2rem',
    }),
    defineField({
      name: 'height',
      title: 'Custom Spacing Height',
      type: 'string',
      description: 'Enter distance (e.g., "3.5rem", "-1.5rem" to pull text closer!).',
      // Only show the custom input field if "Custom Value" is selected, 
      // or if it's a legacy block that doesn't have a preset saved yet.
      hidden: ({ parent }) => parent?.preset !== 'custom' && parent?.preset !== undefined, 
    }),
  ],
  preview: {
    select: {
      preset: 'preset',
      height: 'height',
    },
    prepare({ preset, height }) {
      if (preset === 'br') return { title: '↵ Line Break' };
      if (preset === 'custom' || (!preset && height)) return { title: `↕ Custom Spacing: ${height || 'Empty'}` };
      return { title: `↕ Spacing: ${preset || '2rem'}` };
    },
  },
});