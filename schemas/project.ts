// stc-website-sanity/schemas/project.ts ID 216.1
import {defineField, defineType} from 'sanity';

const modeOptions = [
  {title: 'Original Colors', value: 'original'},
  {title: 'White (Flat)', value: 'white'},
  {title: 'Black (Flat)', value: 'black'},
  {title: 'Contrast (Difference)', value: 'contrast'},
  {title: 'Liquid Metal (Overlay)', value: 'liquid'},
  {title: 'Apple Glass (Blur/Glow)', value: 'glass'},
  {title: 'RGB (Chromatic)', value: 'rgb'},
  {title: 'Custom Color (Solid)', value: 'custom'},
];

// Helper for Responsive Offsets & Scaling
const createResponsiveFields = (prefix: string, titlePrefix: string, fieldset: string) => {
  const fields: any[] = []; 
  const breakpoints = [
    { key: 'Desktop', title: '1. Big Screen (> 1600px)' },
    { key: 'Laptop', title: '2. Laptop / Mid (1025px - 1600px)' },
    { key: 'TabletLandscape', title: '3. Tablet Landscape (901px - 1024px)' },
    { key: 'TabletPortrait', title: '4. Tablet Portrait (769px - 900px)' },
    { key: 'MobileLandscape', title: '5. Mobile Landscape Big' },
    { key: 'MobileLandscapeSmall', title: '6. Mobile Landscape Small' },
    { key: 'MobilePortrait', title: '7. Mobile Portrait Big (376px - 768px)' },
    { key: 'MobilePortraitSmall', title: '8. Mobile Portrait Small (≤ 375px)' }, 
  ];

  breakpoints.forEach(bp => {
      // FIX: Default scale is 100. In CSS, 100 = Base Size (6.4rem height).
      fields.push(defineField({ 
          name: `${prefix}Scale${bp.key}`, 
          title: `${titlePrefix} Scale (${bp.title})`, 
          type: 'number', 
          description: 'Percentage size (default 100).', 
          initialValue: 100,
          validation: Rule => Rule.min(0).max(500),
          fieldset 
      }));

      fields.push(defineField({ 
          name: `${prefix}Top${bp.key}`, 
          title: `${titlePrefix} Top Offset (${bp.title})`, 
          type: 'string', 
          description: 'Vertical offset (default 2rem).',
          initialValue: '2rem',
          fieldset 
      }));
  });

  return fields;
};

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fieldsets: [
    {name: 'logoConfig', title: 'PROJECT LOGO ART DIRECTION', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'projectKey',
      title: 'Project Key',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
    }),
    defineField({
      name: 'projectLogo',
      title: 'Project Logo',
      type: 'image',
      description: 'Upload SVG or PNG.',
      fieldset: 'logoConfig',
    }),
    defineField({
      name: 'logoModeDesktop',
      title: 'Logo Mode (Desktop)',
      type: 'string',
      options: { list: modeOptions },
      initialValue: 'original',
      fieldset: 'logoConfig',
    }),
    defineField({
      name: 'logoColorDesktop',
      title: 'Custom Color (Desktop)',
      type: 'string',
      fieldset: 'logoConfig',
      hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.logoModeDesktop),
    }),
    defineField({
      name: 'logoModeMobile',
      title: 'Logo Mode (Mobile)',
      type: 'string',
      options: { list: modeOptions },
      initialValue: 'original',
      fieldset: 'logoConfig',
    }),
    defineField({
      name: 'logoColorMobile',
      title: 'Custom Color (Mobile)',
      type: 'string',
      fieldset: 'logoConfig',
      hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.logoModeMobile),
    }),
    
    // RESPONSIVE LOGO SETTINGS
    ...createResponsiveFields('logo', 'Logo', 'logoConfig'),

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
    }),
    
    // --- PROJECT AUDIO ---
    defineField({
        name: 'projectAudio',
        title: 'Project Background Audio',
        type: 'file',
        description: 'Audio file (MP3/WAV). Only plays if NO global audio is set in Site Config.',
        options: { accept: 'audio/*' },
    }),
    defineField({
        name: 'projectAudioVolume',
        title: 'Project Audio Volume',
        type: 'number',
        description: 'Volume level from 0 to 1 (default 0.5).',
        initialValue: 0.5,
        validation: Rule => Rule.min(0).max(1),
    }),

    defineField({
      name: 'filters',
      title: 'Filter Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'section'}]}],
    }),
  ],
});