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
groups: [
    { name: 'logoScaling', title: 'Logo Scaling' }
  ],  fieldsets: [
    {name: 'logoConfig', title: 'Project Logo Art Direction', description: 'Scale and offsets per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},
    {name: 'audioConfig', title: 'Project Sound', options: {collapsible: true, collapsed: true}},
    {name: 'semanticConfig', title: 'Semantic Credits (SEO / AIO)', options: {collapsible: true, collapsed: true}},
    {name: 'seoConfig', title: 'Project SEO', options: {collapsible: true, collapsed: true}},
    {
      name: 'sectionLoad',
      title: 'Section Load Order',
      description: 'Drag to set the order sections play in this project. Close this fold to keep a long list out of the way.',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'isOffline',
      title: 'Offline / Draft Mode (Hide from Production)',
      type: 'boolean',
      description: 'When enabled (ON), this project is visible on Localhost (localhost:3333) for testing, but HIDDEN from www.noum.studio and sitemaps.',
      initialValue: false,
    }),
    defineField({
      name: 'isUnlisted',
      title: 'Unlisted (only via direct link)',
      type: 'boolean',
      description: 'ON: the project is online, but not in the overview, not in the project order and not in the sitemap. Anyone with its direct link can open it, e.g. https://www.noum.studio/#R (R = Project Key). No password: treat the link as shareable. Offline above still wins.',
      initialValue: false,
    }),
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

// --- RESTORED & UPGRADED THUMBNAIL LOGIC ---
    defineField({
        name: 'thumbnailImageSource',
        title: 'Thumbnail Image Source',
        type: 'string',
        options: {
            list: [
                { title: 'Sanity (Upload directly)', value: 'sanity' },
                { title: 'External URL (StC Server / Direct Link)', value: 'external' },
            ],
            layout: 'radio',
        },
        initialValue: 'sanity',
    }),
    defineField({ 
        name: 'thumbnail', 
        title: 'Thumbnail Image (Sanity)', 
        type: 'image', 
        options: { hotspot: true },
        hidden: ({parent}) => parent?.thumbnailImageSource === 'external',
    }),
    defineField({
        name: 'thumbnailImageUrl',
        title: 'External Thumbnail URL',
        type: 'url',
        hidden: ({parent}) => !parent?.thumbnailImageSource || parent?.thumbnailImageSource === 'sanity',
    }),
    defineField({
        name: 'thumbnailVideoSource',
        title: 'Thumbnail Video Source',
        type: 'string',
        options: {
            list: [
                { title: 'Sanity (Small MP4/GIF)', value: 'sanity' },
                { title: 'StC Server (Direct MP4)', value: 'external' },
                { title: 'Vimeo', value: 'vimeo' },
                { title: 'YouTube', value: 'youtube' },
            ]
        },
        description: 'Choose "Sanity" for small files (<5MB). For high-end backgrounds, use Vimeo or StC Server.'
    }),
    defineField({
        name: 'thumbnailVideo',
        title: 'Thumbnail Video File (Sanity)',
        type: 'file',
        hidden: ({ parent }) => parent?.thumbnailVideoSource !== 'sanity',
        options: { accept: 'video/*' }
    }),
    defineField({
        name: 'thumbnailVideoUrl',
        title: 'Thumbnail Video URL (Vimeo / YouTube / StC)',
        type: 'url',
        hidden: ({ parent }) => !['vimeo', 'youtube', 'external'].includes(parent?.thumbnailVideoSource)
    }),

// --- PROJECT AUDIO ---
    defineField({
        name: 'projectAudioSource',
        title: 'Project Audio Source',
        type: 'string',
        options: { list: [{ title: 'Sanity (Upload directly)', value: 'sanity' }, { title: 'External URL (StC Server / Direct Link)', value: 'external' }], layout: 'radio' },
        fieldset: 'audioConfig',
    }),
    defineField({
        name: 'projectAudio',
        title: 'Project Background Audio (Sanity)',
        type: 'file',
        description: 'Audio file (MP3/WAV). Only plays if NO global audio is set in Site Config.',
        options: { accept: 'audio/*' },
        hidden: ({parent}) => parent?.projectAudioSource === 'external',
        fieldset: 'audioConfig',
    }),
    defineField({
        name: 'projectAudioUrl',
        title: 'External Project Audio URL',
        type: 'url',
        description: 'Paste the direct link to the .mp3 or .wav file.',
        hidden: ({parent}) => !parent?.projectAudioSource || parent?.projectAudioSource === 'sanity',
        fieldset: 'audioConfig',
    }),
    defineField({
        name: 'projectAudioVolume',
        title: 'Project Audio Volume',
        type: 'number',
        description: 'Volume level from 0 to 1.',
        validation: Rule => Rule.min(0).max(1),
        fieldset: 'audioConfig',
    }),
    defineField({
      name: 'filters',
      title: 'Filter Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      fieldset: 'semanticConfig',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      fieldset: 'semanticConfig',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g. 2026 or 2024–2026',
      fieldset: 'semanticConfig',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'e.g. Creative Direction, Motion, Design',
      fieldset: 'semanticConfig',
    }),
    defineField({
      name: 'seo',
      title: 'SEO / AIO',
      type: 'seoObject',
      fieldset: 'seoConfig',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'section'}]}],
      fieldset: 'sectionLoad',
    }),
    
  ],
});