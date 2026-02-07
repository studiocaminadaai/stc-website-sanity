// stc-website-sanity/schemas/section.ts ID 194.41
import {defineField, defineType} from 'sanity'

const linkAnnotation = {
  name: 'link',
  title: 'External URL',
  type: 'object',
  fields: [
    defineField({title: 'URL', name: 'href', type: 'url'}),
    defineField({
      title: 'Link Label (Optional)', 
      name: 'linkText', 
      type: 'string', 
      description: 'If set, this text will be displayed instead of the highlighted text.'
    }),
    defineField({title: 'Open in new tab', name: 'blank', type: 'boolean', initialValue: false}),
  ],
};

const internalLinkAnnotation = {
  name: 'internalLink', 
  title: 'Internal Link',
  type: 'object',
  icon: () => '🔗', 
  fields: [
    defineField({
      name: 'targetSection', 
      title: 'Target Section ID',
      type: 'string',
      description: 'The exact ID of the section (e.g. "A1").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetProject',
      title: 'Target Project Key (Optional)',
      type: 'string',
      description: 'Enter Project Key ONLY if jumping to a different project.',
    }),
  ],
};

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

// UPDATED: Use References for Typography instead of hardcoded strings
const createResponsiveTypeFields = (prefix: string, title: string) => [
  defineField({
    name: `${prefix}Font`,
    title: `${title} Font Family`,
    type: 'reference', // <--- CHANGED TO REFERENCE
    to: [{type: 'fontResource'}], // <--- POINTS TO YOUR FONT LIBRARY
    description: 'Select a font from the Font Resources. Leave empty to inherit.',
    fieldset: `${prefix}Config`
  }),
  defineField({
    name: `${prefix}Color`,
    title: `${title} Color (Override)`,
    type: 'string',
    fieldset: `${prefix}Config`
  }),

  // 1. DESKTOP
  defineField({name: `${prefix}SizeDesktop`, title: 'Size (Desktop)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightDesktop`, title: 'Line Height (Desktop)', type: 'string', fieldset: `${prefix}Config`}),
  
  // 2. LAPTOP
  defineField({name: `${prefix}SizeLaptop`, title: 'Size (Laptop)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightLaptop`, title: 'Line Height (Laptop)', type: 'string', fieldset: `${prefix}Config`}),

  // 3. TABLET LANDSCAPE
  defineField({name: `${prefix}SizeTabletLandscape`, title: 'Size (Tablet Landscape)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightTabletLandscape`, title: 'Line Height (Tablet Landscape)', type: 'string', fieldset: `${prefix}Config`}),

  // 4. TABLET PORTRAIT
  defineField({name: `${prefix}SizeTabletPortrait`, title: 'Size (Tablet Portrait)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightTabletPortrait`, title: 'Line Height (Tablet Portrait)', type: 'string', fieldset: `${prefix}Config`}),

  // 5. MOBILE LANDSCAPE BIG
  defineField({name: `${prefix}SizeMobileLandscape`, title: 'Size (Mobile Landscape)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobileLandscape`, title: 'Line Height (Mobile Landscape)', type: 'string', fieldset: `${prefix}Config`}),

  // 6. MOBILE LANDSCAPE SMALL
  defineField({name: `${prefix}SizeMobileLandscapeSmall`, title: 'Size (Mobile Landscape Small)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobileLandscapeSmall`, title: 'Line Height (Mobile Landscape Small)', type: 'string', fieldset: `${prefix}Config`}),

  // 7. MOBILE PORTRAIT BIG
  defineField({name: `${prefix}SizeMobilePortrait`, title: 'Size (Mobile Portrait)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobilePortrait`, title: 'Line Height (Mobile Portrait)', type: 'string', fieldset: `${prefix}Config`}),

  // 8. MOBILE PORTRAIT SMALL
  defineField({name: `${prefix}SizeMobilePortraitSmall`, title: 'Size (Mobile Portrait Small)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobilePortraitSmall`, title: 'Line Height (Mobile Portrait Small)', type: 'string', fieldset: `${prefix}Config`}),

  // LEGACY / FALLBACKS
  defineField({name: `${prefix}SizeTablet`, title: 'Size (Legacy Tablet)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
  defineField({name: `${prefix}LineHeightTablet`, title: 'Line Height (Legacy Tablet)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
  defineField({name: `${prefix}SizeMobile`, title: 'Size (Legacy Mobile)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
  defineField({name: `${prefix}LineHeightMobile`, title: 'Line Height (Legacy Mobile)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
];

// Helper to create the granular container fields
const createContainerFields = (fieldset: string) => {
  const fields: any[] = [];
  const breakpoints = [
    { key: 'Desktop', title: 'Desktop (> 1440px)' },
    { key: 'Laptop', title: 'Laptop (1025px - 1440px)' },
    { key: 'TabletLandscape', title: 'Tablet Landscape (901px - 1024px)' },
    { key: 'TabletPortrait', title: 'Tablet Portrait (769px - 900px)' },
    { key: 'MobileLandscape', title: 'Mobile Landscape Big (< 800px H)' },
    { key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small (< 500px H)' },
    { key: 'MobilePortrait', title: 'Mobile Portrait Big (≤ 768px)' },
    { key: 'MobilePortraitSmall', title: 'Mobile Portrait Small (≤ 375px)' },
  ];

  breakpoints.forEach(bp => {
    fields.push(defineField({
      name: `containerWidth${bp.key}`,
      title: `Width - ${bp.title}`,
      type: 'string',
      description: 'e.g., 80vw, 800px, 100%',
      fieldset
    }));
    fields.push(defineField({
      name: `containerHeight${bp.key}`,
      title: `Max Height - ${bp.title}`,
      type: 'string',
      description: 'e.g., 80vh, 600px',
      fieldset
    }));
    fields.push(defineField({
      name: `verticalOffset${bp.key}`,
      title: `Vertical Offset - ${bp.title}`,
      type: 'string',
      description: 'Push container up/down. e.g. 2rem, 10vh, -50px',
      fieldset
    }));
  });

  return fields;
};

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  fieldsets: [
    {name: 'tickerConfig', title: 'TICKER / MARQUEE OVERLAY', options: {collapsible: true, collapsed: true}}, 
    {name: 'desktopMediaConfig', title: 'DESKTOP MEDIA SETTINGS', options: {collapsible: true, collapsed: false}},
    {name: 'mobileMediaConfig', title: 'MOBILE / TABLET MEDIA SETTINGS', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'id', title: 'Section ID', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'}, 
            {title: 'H5', value: 'h5'}, 
            {title: 'Quote', value: 'blockquote'}, 
          ],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              linkAnnotation,
              internalLinkAnnotation,
            ],
          },
        },
        {type: 'breakType'},
      ],
    }),
    defineField({
      name: 'template',
      title: 'Layout Template',
      type: 'string',
      options: {
        list: [
          {title: 'A: Full-width media', value: 'a'},
          {title: 'B: Wide, centered media', value: 'b'},
          {title: 'C: Square, centered media', value: 'c'},
          {title: 'D: Two Columns, portrait', value: 'd'},
          {title: 'E: Extra-wide centered media (NEW)', value: 'e'}, 
          {title: 'K: Wide, centered media (New)', value: 'k'},
          {title: 'L: Wide, centered media (New)', value: 'l'},
          {title: 'M: Two Columns, wide (New)', value: 'm'},
          {title: 'N: Copy of K (Wide, 1vw padding)', value: 'n'},
          {title: 'F: Three Columns, portrait', value: 'f'},
          {title: 'G: Two Columns, different sizes', value: 'g'},
          {title: 'H: Fullscreen background', value: 'h'},
          {title: 'V: Single Portrait (3:4, 80vh)', value: 'v'},
          {title: 'Z: Company Infos', value: 'z'},
          {title: 'T: Typography Section', value: 't'},
          {title: 'Template T New', value: 't-new'},
          {title: 'Long Scrollable Text (Awards/Terms)', value: 'long'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    
    // --- TICKER SETTINGS ---
    defineField({
      name: 'enableTicker',
      title: 'Enable Ticker/Marquee',
      type: 'boolean',
      fieldset: 'tickerConfig',
      initialValue: false
    }),
    defineField({
      name: 'tickerText',
      title: 'Ticker Content',
      type: 'array',
      fieldset: 'tickerConfig',
      of: [{type: 'string'}],
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerSpeed',
      title: 'Animation Speed (Seconds)',
      type: 'number',
      fieldset: 'tickerConfig',
      initialValue: 20,
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerDirection',
      title: 'Direction',
      type: 'string',
      fieldset: 'tickerConfig',
      options: { list: [{title: 'Right to Left (Standard)', value: 'normal'}, {title: 'Left to Right', value: 'reverse'}] },
      initialValue: 'normal',
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerVerticalPosition',
      title: 'Vertical Position (CSS)',
      type: 'string',
      fieldset: 'tickerConfig',
      initialValue: '50%',
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerGap',
      title: 'Gap Between Items',
      type: 'string',
      fieldset: 'tickerConfig',
      initialValue: '2vw',
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerItemRotation',
      title: 'Text Rotation (Degrees)',
      type: 'number',
      fieldset: 'tickerConfig',
      initialValue: 0,
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerFont',
      title: 'Font Family',
      type: 'string',
      fieldset: 'tickerConfig',
      options: { list: [{title: 'Inherit', value: 'inherit'}, {title: 'Inter', value: 'Inter'}] }, 
      initialValue: 'inherit',
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerSize',
      title: 'Font Size',
      type: 'string',
      fieldset: 'tickerConfig',
      initialValue: '5vw',
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerColor',
      title: 'Font Color',
      type: 'string',
      fieldset: 'tickerConfig',
      initialValue: '#000000',
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerOpacity',
      title: 'Opacity',
      type: 'number',
      fieldset: 'tickerConfig',
      validation: Rule => Rule.min(0).max(1),
      initialValue: 1,
      hidden: ({parent}) => !parent?.enableTicker
    }),
    defineField({
      name: 'tickerZIndex',
      title: 'Layering (Z-Index)',
      type: 'string',
      fieldset: 'tickerConfig',
      options: { list: [{title: 'Behind Content', value: '0'}, {title: 'In Front of Content', value: '10'}] },
      initialValue: '10',
      hidden: ({parent}) => !parent?.enableTicker
    }),

    // --- TRANSPARENCY & STICKY ---
    defineField({
      name: 'transparencyEffect',
      title: 'Transparency Effect (Previous Section)',
      type: 'string',
      options: {
        list: [
          {title: 'None (Default / Overlay)', value: 'none'},
          {title: 'Push Up (Standard Scroll)', value: 'push'},
          {title: 'Fade Out', value: 'fade'},
        ]
      },
      initialValue: 'none'
    }),
    defineField({
        name: 'isSticky',
        title: 'Stable / Sticky (Ignore Push Effect)',
        type: 'boolean',
        initialValue: false,
    }),

    // --- DESKTOP MEDIA SETTINGS ---
    defineField({
      name: 'desktopAspectRatio',
      title: 'Desktop Aspect Ratio',
      type: 'string',
      fieldset: 'desktopMediaConfig',
      options: {
        list: [
          {title: 'Default (Template Standard)', value: 'original'},
          {title: '1:1 (Square)', value: '1/1'},
          {title: '5:4', value: '5/4'},
          {title: '4:3', value: '4/3'},
          {title: '3:2', value: '3/2'},
          {title: '16:10', value: '16/10'},
          {title: '16:9', value: '16/9'},
          {title: '21:9', value: '21/9'},
          {title: '4:5', value: '4/5'},
          {title: '3:4', value: '3/4'},
          {title: '2:3', value: '2/3'},
          {title: '2:4', value: '2/4'},
          {title: '9:16', value: '9/16'},
        ]
      },
      initialValue: 'original',
      hidden: ({parent}) => !['a', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'd', 'f', 'g', 'm'].includes(parent?.template),
    }),
    defineField({
      name: 'desktopHeight',
      title: 'Desktop Height Override',
      type: 'string',
      fieldset: 'desktopMediaConfig',
      hidden: ({parent}) => !['a', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'd', 'f', 'g', 'm'].includes(parent?.template),
    }),

    // --- MOBILE MEDIA SETTINGS ---
    defineField({
      name: 'mobileAspectRatio',
      title: 'Mobile/Tablet Aspect Ratio',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      options: {
        list: [
          {title: 'Only Padding (Default 4vw)', value: 'original'},
          {title: 'Full Format (No Padding)', value: 'full'},
          {title: '1:1 (Square)', value: '1/1'},
          {title: '5:4', value: '5/4'},
          {title: '4:3', value: '4/3'},
          {title: '3:2', value: '3/2'},
          {title: '16:10', value: '16/10'},
          {title: '16:9', value: '16/9'},
          {title: '21:9', value: '21/9'},
          {title: '4:5', value: '4/5'},
          {title: '3:4', value: '3/4'},
          {title: '2:3', value: '2/3'},
          {title: '2:4', value: '2/4'},
          {title: '10:16', value: '10/16'},
          {title: '9:16', value: '9/16'},
          {title: '9:21', value: '9/21'},
        ]
      },
      initialValue: 'original',
      hidden: ({parent}) => !['a', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(parent?.template),
    }),
    defineField({
      name: 'mobileAdditionalPadding',
      title: 'Additional Mobile Padding (Left/Right)',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      hidden: ({parent}) => !['a', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(parent?.template),
    }),

    defineField({name: 'bgColor', title: 'Background Color', type: 'string'}),
    defineField({
      name: 'bgOpacity', 
      title: 'Background Opacity', 
      type: 'number', 
      validation: (Rule) => Rule.min(0).max(1),
      initialValue: 1
    }),

    defineField({
      name: 'customPadding',
      title: 'Custom Padding (Desktop Only)',
      type: 'string',
      hidden: ({parent}) => !['k', 'l', 'n', 'v'].includes(parent?.template),
    }),

    defineField({
      name: 'typographySettings',
      title: 'Typography Settings',
      type: 'object',
      hidden: ({parent}) => !['t', 'long', 't-new'].includes(parent?.template),
      fieldsets: [
        {name: 'h1Config', title: 'H1 SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'h2Config', title: 'H2 SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'h3Config', title: 'H3 SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'h4Config', title: 'H4 SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'h5Config', title: 'H5 SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'normalConfig', title: 'NORMAL TEXT SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'quoteConfig', title: 'QUOTE SETTINGS (RESPONSIVE)', options: {collapsible: true, collapsed: true}},
        {name: 'containerConfig', title: 'CONTAINER DIMENSIONS (WIDTH, HEIGHT & OFFSET)', options: {collapsible: true, collapsed: false}},
      ],
      fields: [
        defineField({name: 'textModeDesktop', title: 'Text Effect Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original'}),
        defineField({name: 'textColorDesktop', title: 'Text Effect Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.textModeDesktop)}),
        defineField({name: 'textModeMobile', title: 'Text Effect Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original'}),
        defineField({name: 'textColorMobile', title: 'Text Effect Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.textModeMobile)}),

        defineField({name: 'letterSpacing', title: 'Letter Spacing', type: 'number'}),
        defineField({name: 'fontColor', title: 'Font Color', type: 'string'}),
        defineField({name: 'textAlign', title: 'Text Alignment', type: 'string', options: {list: [{title: 'Left', value: 'left'}, {title: 'Center', value: 'center'}, {title: 'Right', value: 'right'}, {title: 'Justify', value: 'justify'}]}, initialValue: 'center'}),
        
        ...createContainerFields('containerConfig'),
        
        // LEGACY (Hidden)
        defineField({name: 'desktopWidth', title: 'Legacy Desktop Width', type: 'string', hidden: true}),
        defineField({name: 'desktopHeight', title: 'Legacy Desktop Height', type: 'string', hidden: true}),
        defineField({name: 'tabletWidth', title: 'Legacy Tablet Width', type: 'string', hidden: true}),
        defineField({name: 'tabletHeight', title: 'Legacy Tablet Height', type: 'string', hidden: true}),
        defineField({name: 'mobileWidth', title: 'Legacy Mobile Width', type: 'string', hidden: true}),
        defineField({name: 'mobileHeight', title: 'Legacy Mobile Height', type: 'string', hidden: true}),
        defineField({name: 'verticalOffset', title: 'Legacy Vertical Offset', type: 'string', hidden: true}),
        
        // RESPONSIVE FIELDS
        ...createResponsiveTypeFields('h1', 'H1'),
        ...createResponsiveTypeFields('h2', 'H2'),
        ...createResponsiveTypeFields('h3', 'H3'),
        ...createResponsiveTypeFields('h4', 'H4'),
        ...createResponsiveTypeFields('h5', 'H5'),
        ...createResponsiveTypeFields('normal', 'Normal Text'),
        ...createResponsiveTypeFields('quote', 'Quote'),

        // LEGACY SIZES
        defineField({name: 'normalSize', title: 'Legacy Normal Size', type: 'string', hidden: true}), 
        defineField({name: 'h1Size', title: 'Legacy H1 Size', type: 'string', hidden: true}),
        defineField({name: 'h2Size', title: 'Legacy H2 Size', type: 'string', hidden: true}),
        defineField({name: 'h3Size', title: 'Legacy H3 Size', type: 'string', hidden: true}),

        defineField({name: 'paddingTop', title: 'Padding Top (Long Text)', type: 'string'}),
        defineField({name: 'paddingBottom', title: 'Padding Bottom (Long Text)', type: 'string'}),
        defineField({name: 'fontSize', title: 'Legacy Font Size', type: 'string', hidden: true}),
      ],
    }),
    defineField({name: 'singleMedia', title: 'Single Media Item / Background', type: 'mediaItem', hidden: ({parent}) => !['a', 'b', 'c', 'e', 'k', 'l', 't', 'h', 'n', 'v', 't-new'].includes(parent?.template)}),
    defineField({name: 'twoMedia', title: 'Two Media Items', type: 'twoColumnMedia', hidden: ({parent}) => !['d', 'g', 'm'].includes(parent?.template)}),
    defineField({name: 'threeMedia', title: 'Three Media Items', type: 'threeColumnMedia', hidden: ({parent}) => parent?.template !== 'f'}),
    defineField({
      name: 'contactDetails',
      title: 'Company Infos Details',
      type: 'object',
      hidden: ({parent}) => parent?.template !== 'z',
      fields: [
        defineField({
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({name: 'platform', title: 'Platform', type: 'string', options: {list: [{title: 'X', value: 'bommel-x'}, {title: 'Instagram', value: 'bommel-i'}, {title: 'LinkedIn', value: 'bommel-l'}, {title: 'Tiktok', value: 'bommel-t'}]}}),
              defineField({ name: 'url', title: 'URL', type: 'url' }),
              defineField({ name: 'icon', title: 'SVG Icon', type: 'file', options: { accept: 'image/svg+xml' } })
            ]
          }]
        }),
        defineField({ name: 'column1Text', title: 'Column 1 Text', type: 'array', of: [{ type: 'block', marks: { annotations: [linkAnnotation, internalLinkAnnotation] } }] }),
        defineField({ name: 'column2Text', title: 'Column 2 Text', type: 'array', of: [{ type: 'block', marks: { annotations: [linkAnnotation, internalLinkAnnotation] } }] }),
        defineField({ name: 'column3Text', title: 'Column 3 Text', type: 'array', of: [{ type: 'block', marks: { annotations: [linkAnnotation, internalLinkAnnotation] } }] })
      ]
    })
  ],
})