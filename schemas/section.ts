// stc-website-sanity/schemas/section.ts ID 212.42
import {useEffect} from 'react'
import {defineField, defineType, PatchEvent, set, unset, useFormValue, type FieldProps} from 'sanity'
import {ProjectKeyInput} from './ProjectKeyInput'
import {SectionRefInput} from './SectionRefInput'
import {BareObjectField} from './activeSettingsDot'

const idSortKey = (id?: string) => {
  const raw = String(id || '').trim()
  if (!raw) return ''
  const match = raw.match(/^([A-Za-z]*)(\d+)(.*)$/)
  if (!match) return `~${raw.toLowerCase()}`
  const prefix = (match[1] || '#').toUpperCase()
  return `${prefix}-${String(Number(match[2])).padStart(8, '0')}-${match[3].toLowerCase()}`
}

const IdSortField = (props: FieldProps) => {
  const sectionId = useFormValue(['id']) as string | undefined
  const next = idSortKey(sectionId)
  const current = typeof props.value === 'string' ? props.value : ''

  useEffect(() => {
    if (next === current) return
    const onChange = props.inputProps?.onChange
    if (!onChange) return
    onChange(PatchEvent.from(next ? set(next) : unset()))
  }, [current, next, props.inputProps])

  return null
}

const linkAnnotation = {
  name: 'link',
  title: 'External URL',
  type: 'object',
  fields: [
    defineField({
      title: 'URL', 
      name: 'href', 
      type: 'url',
      // This explicitly tells Sanity to accept mailto: and tel: links
      validation: Rule => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel'],
        allowRelative: true
      })
    }),
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

const customBlockEditor = [
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
      annotations: [linkAnnotation, internalLinkAnnotation],
    },
  },
  {type: 'customSpacing'}
];

const MEDIA_TEXT_TEMPLATES = ['a', 'a-tall', 'b', 'c', 'e', 'k', 'l', 'n', 'v', 'h', 'd', 'g', 'm', 'fs2', 'f', 'fs3', 'fs4', 'p', 'logo'];
const TYPE_TEMPLATES = ['t', 'long', 't-new', 'z'];
const mediaColumnCount = (template: string) => {
  if (['d', 'g', 'm', 'fs2'].includes(template)) return 2;
  if (['f', 'fs3'].includes(template)) return 3;
  if (template === 'fs4') return 4;
  return 1;
};
const showsTypography = (document: any) => TYPE_TEMPLATES.includes(document?.template);
const showsMediaText = (document: any) =>
  MEDIA_TEXT_TEMPLATES.includes(document?.template) && document?.enableMediaText;
const mediaTextColumns = (document: any) => {
  if (document?.mediaTextPlacement === 'edges') {
    const mediaCols = mediaColumnCount(document?.template);
    return Math.min(6, Math.max(1, mediaCols <= 1 ? 1 : mediaCols - 1));
  }
  return Math.min(6, Math.max(1, Number(document?.mediaTextGrid) || 1));
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

const blendModeOptions = [
  {title: 'Normal', value: 'normal'},
  {title: 'Darken (Abdunkeln)', value: 'darken'},
  {title: 'Multiply (Multiplizieren)', value: 'multiply'},
  {title: 'Color Burn (Farbig nachbelichten)', value: 'color-burn'},
  {title: 'Lighten (Aufhellen)', value: 'lighten'},
  {title: 'Screen (Negativ Multiplizieren)', value: 'screen'},
  {title: 'Color Dodge (Farbig abwedeln)', value: 'color-dodge'},
  {title: 'Overlay (Ineinanderkopieren)', value: 'overlay'},
  {title: 'Soft Light (Weiches Licht)', value: 'soft-light'},
  {title: 'Hard Light (Hartes Licht)', value: 'hard-light'},
  {title: 'Difference (Differenz)', value: 'difference'},
  {title: 'Exclusion (Ausschluss)', value: 'exclusion'},
  {title: 'Hue (Farbton)', value: 'hue'},
  {title: 'Saturation (Sättigung)', value: 'saturation'},
  {title: 'Color (Farbe)', value: 'color'},
  {title: 'Luminosity (Luminanz)', value: 'luminosity'},
];

const createMediaScaleFields = (fieldset: string) => {
  const fields: any[] = [];
  const breakpoints = [
    { key: 'Desktop', title: 'Desktop (> 1600px)' },
    { key: 'Laptop', title: 'Laptop (1025px - 1600px)' },
    { key: 'TabletLandscape', title: 'Tablet Landscape (901px - 1024px)' },
    { key: 'TabletPortrait', title: 'Tablet Portrait (769px - 900px)' },
    { key: 'MobileLandscape', title: 'Mobile Landscape Big' },
    { key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small' },
    { key: 'MobilePortrait', title: 'Mobile Portrait Big' },
    { key: 'MobilePortraitSmall', title: 'Mobile Portrait Small' },
  ];

  breakpoints.forEach(bp => {
    fields.push(defineField({
      name: `mediaScale${bp.key}`,
      title: `Media Zoom/Scale - ${bp.title}`,
      type: 'number',
      description: 'Optical zoom. 100 = Original. 120 = 20% Zoom In. 80 = 20% Zoom Out.',
      fieldset,
    }));
  });

  return fields;
};

const createResponsiveTypeFields = (prefix: string, title: string) => [
    defineField({
    name: `${prefix}Font`,
    title: `${title} Font Family`,
    type: 'reference', 
    to: [{type: 'fontResource'}], 
    description: 'Select a font from the Font Resources. Leave empty to inherit.',
    fieldset: `${prefix}Config`
  }),
  defineField({
    name: `${prefix}Color`,
    title: `${title} Color (Override)`,
    type: 'string',
    fieldset: `${prefix}Config`
  }),
  defineField({
    name: `${prefix}UnderlineThickness`,
    title: `${title} Underline Thickness`,
    type: 'string',
    description: 'e.g., 1px, 0.05em',
    fieldset: `${prefix}Config`
  }),
  defineField({
    name: `${prefix}UnderlineOffset`,
    title: `${title} Underline Offset`,
    type: 'string',
    description: 'e.g., 4px, 0.2em',
    fieldset: `${prefix}Config`
  }),

  defineField({name: `${prefix}SizeDesktop`, title: 'Size (Desktop)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightDesktop`, title: 'Line Height (Desktop)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingDesktop`, title: 'Letter Spacing (Desktop)', type: 'string', description: 'e.g., "-0.05em", "2px"', fieldset: `${prefix}Config`}),
  
  defineField({name: `${prefix}SizeLaptop`, title: 'Size (Laptop)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightLaptop`, title: 'Line Height (Laptop)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingLaptop`, title: 'Letter Spacing (Laptop)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeTabletLandscape`, title: 'Size (Tablet Landscape)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightTabletLandscape`, title: 'Line Height (Tablet Landscape)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingTabletLandscape`, title: 'Letter Spacing (Tablet Landscape)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeTabletPortrait`, title: 'Size (Tablet Portrait)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightTabletPortrait`, title: 'Line Height (Tablet Portrait)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingTabletPortrait`, title: 'Letter Spacing (Tablet Portrait)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeMobileLandscape`, title: 'Size (Mobile Landscape)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobileLandscape`, title: 'Line Height (Mobile Landscape)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingMobileLandscape`, title: 'Letter Spacing (Mobile Landscape)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeMobileLandscapeSmall`, title: 'Size (Mobile Landscape Small)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobileLandscapeSmall`, title: 'Line Height (Mobile Landscape Small)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingMobileLandscapeSmall`, title: 'Letter Spacing (Mobile Landscape Small)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeMobilePortrait`, title: 'Size (Mobile Portrait)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobilePortrait`, title: 'Line Height (Mobile Portrait)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingMobilePortrait`, title: 'Letter Spacing (Mobile Portrait)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeMobilePortraitSmall`, title: 'Size (Mobile Portrait Small)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LineHeightMobilePortraitSmall`, title: 'Line Height (Mobile Portrait Small)', type: 'string', fieldset: `${prefix}Config`}),
  defineField({name: `${prefix}LetterSpacingMobilePortraitSmall`, title: 'Letter Spacing (Mobile Portrait Small)', type: 'string', fieldset: `${prefix}Config`}),

  defineField({name: `${prefix}SizeTablet`, title: 'Size (Legacy Tablet)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
  defineField({name: `${prefix}LineHeightTablet`, title: 'Line Height (Legacy Tablet)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
  defineField({name: `${prefix}SizeMobile`, title: 'Size (Legacy Mobile)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
  defineField({name: `${prefix}LineHeightMobile`, title: 'Line Height (Legacy Mobile)', type: 'string', fieldset: `${prefix}Config`, hidden: true}),
];

const createContainerFields = (fieldset: string) => {
  const fields: any[] = [];
  const breakpoints = [
    { key: 'Desktop', title: 'Desktop (> 1600px)' },
    { key: 'Laptop', title: 'Laptop (1025px – 1600px)' },
    { key: 'TabletLandscape', title: 'Tablet Landscape (901px – 1024px)' },
    { key: 'TabletPortrait', title: 'Tablet Portrait (769px – 900px)' },
    { key: 'MobileLandscape', title: 'Mobile Landscape (height under 900px)' },
    { key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small (height under 400px)' },
    { key: 'MobilePortrait', title: 'Mobile Portrait (376px – 768px)' },
    { key: 'MobilePortraitSmall', title: 'Mobile Portrait Small (≤ 375px)' },
  ];

  breakpoints.forEach(bp => {
    fields.push(defineField({
      name: `containerWidth${bp.key}`,
      title: `Width - ${bp.title}`,
      type: 'string',
      fieldset,
      hidden: ({document}: any) => document?.template === 'z' 
    }));
    fields.push(defineField({
      name: `containerHeight${bp.key}`,
      title: `Max Height - ${bp.title}`,
      type: 'string',
      fieldset,
      hidden: ({document}: any) => document?.template === 'z' 
    }));
    fields.push(defineField({
      name: `verticalOffset${bp.key}`,
      title: `Vertical Offset - ${bp.title}`,
      type: 'string',
      fieldset,
      hidden: ({document}: any) => document?.template === 'z' 
    }));
  });

  return fields;
};

const createLogoTemplateFields = (fieldset: string) => {
  const fields: any[] = [];
  const breakpoints = [
    { key: 'Desktop', title: 'Desktop (> 1440px)' },
    { key: 'Laptop', title: 'Laptop (1025px - 1440px)' },
    { key: 'TabletLandscape', title: 'Tablet Landscape (901px - 1024px)' },
    { key: 'TabletPortrait', title: 'Tablet Portrait (769px - 900px)' },
    { key: 'MobileLandscape', title: 'Mobile Landscape Big' },
    { key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small' },
    { key: 'MobilePortrait', title: 'Mobile Portrait Big' },
    { key: 'MobilePortraitSmall', title: 'Mobile Portrait Small' },
  ];

  fields.push(defineField({
    name: 'logoTopScale',
    title: 'Logo Size at Top',
    type: 'number',
    description: 'Percentage of the project\'s top logo size, for this logo only, once it has moved to the top (default 100). Use it when two logo drawings fill their file differently.',
    fieldset,
    hidden: ({document}: any) => document?.template !== 'logo'
  }));

  breakpoints.forEach(bp => {
    fields.push(defineField({
      name: `logoTopOffsetY${bp.key}`,
      title: `Logo at Top: Vertical Offset - ${bp.title}`,
      type: 'string',
      description: 'Moves this logo once it sits at the top, e.g. "-0.25rem" (up) or "0.25rem" (down). Empty = no change.',
      fieldset,
      hidden: ({document}: any) => document?.template !== 'logo'
    }));
    fields.push(defineField({
      name: `logoTopOffsetX${bp.key}`,
      title: `Logo at Top: Horizontal Offset - ${bp.title}`,
      type: 'string',
      description: 'Moves this logo once it sits at the top, e.g. "-0.25rem" (left) or "0.25rem" (right). Empty = no change.',
      fieldset,
      hidden: ({document}: any) => document?.template !== 'logo'
    }));
  });

  breakpoints.forEach(bp => {
    fields.push(defineField({
      name: `logoTemplateScale${bp.key}`,
      title: `Logo Scale - ${bp.title}`,
      type: 'number',
      description: 'Percentage size (default 100).',
      initialValue: 100,
      fieldset,
      hidden: ({document}: any) => document?.template !== 'logo'
    }));
    fields.push(defineField({
      name: `logoTemplateOffset${bp.key}`,
      title: `Logo Vertical Offset - ${bp.title}`,
      type: 'string',
      description: 'e.g. 0px, -5vh, 2rem',
      initialValue: '0px',
      fieldset,
      hidden: ({document}: any) => document?.template !== 'logo'
    }));
    fields.push(defineField({
      name: `logoTemplateOffsetX${bp.key}`,
      title: `Logo Horizontal Offset - ${bp.title}`,
      type: 'string',
      description: 'e.g. 0px, -5vw, 2rem',
      initialValue: '0px',
      fieldset,
      hidden: ({document}: any) => document?.template !== 'logo'
    }));
  });
  return fields;
};

const closedFold = {collapsible: true, collapsed: true} as const

const typographyLookFieldsets = [
  {name: 'lookDesktop', title: 'Desktop', options: closedFold},
  {name: 'lookMobile', title: 'Mobile', options: closedFold},
  {name: 'lookSurface', title: 'Background surface', description: 'Filter or blend the video / image / color plate, then optionally knock type through it as windows.', options: {collapsible: true, collapsed: false}},
  {name: 'lookBlend', title: 'Blend', options: closedFold},
  {name: 'lookType', title: 'Font & Alignment', options: closedFold},
]

const typographyStyleFieldsets = [
  {
    name: 'containerConfig',
    title: 'Container Dimensions',
    description: 'Width, max height and vertical offset per screen size. Empty keeps the default.',
    options: closedFold,
  },
  {name: 'h1Config', title: 'H1 Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
  {name: 'h2Config', title: 'H2 Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
  {name: 'h3Config', title: 'H3 Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
  {name: 'h4Config', title: 'H4 Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
  {name: 'h5Config', title: 'H5 Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
  {name: 'normalConfig', title: 'Normal Text Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
  {name: 'quoteConfig', title: 'Quote Settings', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: closedFold},
]

const overlayLookFields = () => [
  defineField({name: 'textModeDesktop', title: 'Text Effect Mode', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'lookDesktop', description: 'Liquid metal, glass, contrast, RGB, or custom color on the glyphs. Knockout (Background surface) replaces this — holes in the plate instead of a fill effect.', hidden: ({document, parent}: any) => document?.template === 'z' || parent?.textKnockout}),
  defineField({name: 'textColorDesktop', title: 'Custom Color / Text Effect Color', type: 'string', fieldset: 'lookDesktop', hidden: ({document, parent}: any) => document?.template === 'z' || parent?.textKnockout || !['custom', 'glass', 'liquid'].includes(parent?.textModeDesktop)}),
  defineField({name: 'textModeMobile', title: 'Text Effect Mode', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'lookMobile', hidden: ({document, parent}: any) => document?.template === 'z' || parent?.textKnockout}),
  defineField({name: 'textColorMobile', title: 'Custom Color / Text Effect Color', type: 'string', fieldset: 'lookMobile', hidden: ({document, parent}: any) => document?.template === 'z' || parent?.textKnockout || !['custom', 'glass', 'liquid'].includes(parent?.textModeMobile)}),
  defineField({
    name: 'surfaceModeDesktop',
    title: 'Background Effect Mode',
    type: 'string',
    options: {list: modeOptions},
    initialValue: 'original',
    fieldset: 'lookSurface',
    description: 'Override for this type overlay. Section-wide filter and blend live on Background.',
    hidden: ({document}: any) => document?.template === 'z',
  }),
  defineField({
    name: 'surfaceColorDesktop',
    title: 'Background Effect Color',
    type: 'string',
    fieldset: 'lookSurface',
    hidden: ({document, parent}: any) => document?.template === 'z' || !['custom', 'glass', 'liquid'].includes(parent?.surfaceModeDesktop),
  }),
  defineField({
    name: 'surfaceModeMobile',
    title: 'Background Effect Mode (Mobile)',
    type: 'string',
    options: {list: modeOptions},
    initialValue: 'original',
    fieldset: 'lookSurface',
    hidden: ({document}: any) => document?.template === 'z',
  }),
  defineField({
    name: 'surfaceColorMobile',
    title: 'Background Effect Color (Mobile)',
    type: 'string',
    fieldset: 'lookSurface',
    hidden: ({document, parent}: any) => document?.template === 'z' || !['custom', 'glass', 'liquid'].includes(parent?.surfaceModeMobile),
  }),
  defineField({
    name: 'textKnockout',
    title: 'Knock out type (windows through the color)',
    type: 'boolean',
    initialValue: false,
    fieldset: 'lookSurface',
    description: 'Turn on: letters become holes in this section’s Background color (and media). You see the section behind through the type. Opacity on the color still tints the plate; the glyphs stay fully open.',
    hidden: ({document}: any) => document?.template === 'z',
  }),
  defineField({name: 'textUnderlayBlendMode', title: 'Blend mode', type: 'string', options: { list: blendModeOptions }, fieldset: 'lookBlend', description: 'Photoshop / Illustrator blend over the media. Same list as sticky logo look. Used on the background plate, or instead of a filter effect.', hidden: ({document}: any) => document?.template === 'z'}),
  defineField({name: 'textUnderlayColor', title: 'Blend color', type: 'string', fieldset: 'lookBlend', hidden: ({document, parent}: any) => document?.template === 'z' || !parent?.textUnderlayBlendMode, description: 'Fill this blend mixes with the image, e.g. #FFFFFF.'}),
  defineField({name: 'textUnderlayOpacity', title: 'Blend transparency', type: 'number', fieldset: 'lookBlend', initialValue: 1, validation: (Rule: any) => Rule.min(0).max(1), hidden: ({document, parent}: any) => document?.template === 'z' || !parent?.textUnderlayBlendMode}),
  defineField({name: 'letterSpacing', title: 'Legacy Letter Spacing', type: 'number', hidden: true}),
  defineField({name: 'fontColor', title: 'Global Font Color (Overrides Default)', type: 'string', fieldset: 'lookType'}),
  defineField({name: 'textAlign', title: 'Text Alignment', type: 'string', options: {list: [{title: 'Left', value: 'left'}, {title: 'Center', value: 'center'}, {title: 'Right', value: 'right'}, {title: 'Justify', value: 'justify'}]}, initialValue: 'center', fieldset: 'lookType', hidden: ({document}: any) => document?.template === 'z'}),
  defineField({
    name: 'flattersatz',
    title: 'Flattersatz (long / short rag)',
    type: 'number',
    fieldset: 'lookType',
    description: '0 = even wrap (off). Higher = stronger long, short, long, short. Responsive. Centered rag uses both sides; left/right rag flutters the open edge. Does not apply to Justify.',
    validation: (Rule: any) => Rule.min(0).max(100),
    initialValue: 0,
    hidden: ({document}: any) => document?.template === 'z',
  }),
];

const overlayTypographyFieldsets = [
  {name: 'copy', title: 'Type', options: closedFold},
  {name: 'motion', title: 'Text Motion (Empty = Static)', options: closedFold},
  ...typographyLookFieldsets,
  ...typographyStyleFieldsets,
];

const overlayTypographyFields = () => [
  ...overlayLookFields(),
  ...createContainerFields('containerConfig'),
  ...createResponsiveTypeFields('h1', 'H1'),
  ...createResponsiveTypeFields('h2', 'H2'),
  ...createResponsiveTypeFields('h3', 'H3'),
  ...createResponsiveTypeFields('h4', 'H4'),
  ...createResponsiveTypeFields('h5', 'H5'),
  ...createResponsiveTypeFields('normal', 'Normal Text'),
  ...createResponsiveTypeFields('quote', 'Quote'),
];

const mediaTextMotionItem = {
  type: 'object',
  initialValue: {phase: 'enter', delay: 1, duration: 0.9, motion: 'from-left'},
  fields: [
    {
      name: 'phase',
      title: 'Step',
      type: 'string',
      options: {list: [
        {title: 'Entrance', value: 'enter'},
        {title: 'Stay', value: 'stay'},
        {title: 'Exit', value: 'exit'},
      ]},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'delay',
      title: 'Wait before this step (seconds)',
      type: 'number',
      initialValue: 0,
      hidden: ({parent}: any) => parent?.phase === 'stay',
      description: 'Entrance: wait after this section is on screen. Exit: wait after Entrance (and Stay) finish. Example: Exit delay 3 + duration 1.5 = fade out 3s after the type has arrived.',
    },
    {
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      initialValue: 0.9,
      description: 'Stay: 0 or empty = keep the type on screen while you scroll this section. A number holds that long, then Exit runs. Exit duration is the fade / slide out.',
    },
    {
      name: 'motion',
      title: 'Move',
      type: 'string',
      options: {list: [
        {title: 'Fade', value: 'fade'},
        {title: 'From left', value: 'from-left'},
        {title: 'From right', value: 'from-right'},
        {title: 'From top', value: 'from-top'},
        {title: 'From bottom', value: 'from-bottom'},
        {title: 'To left', value: 'to-left'},
        {title: 'To right', value: 'to-right'},
        {title: 'To top', value: 'to-top'},
        {title: 'To bottom', value: 'to-bottom'},
      ]},
      hidden: ({parent}: any) => parent?.phase === 'stay',
    },
  ],
  preview: {
    select: {phase: 'phase', delay: 'delay', duration: 'duration', motion: 'motion'},
    prepare: ({phase, delay, duration, motion}: any) => {
      const title = ({enter: 'Entrance', stay: 'Stay', exit: 'Exit'} as Record<string, string>)[phase] || phase || 'Step';
      const bits = [
        phase !== 'stay' && delay ? `after ${delay}s` : '',
        duration || duration === 0 ? `${duration}s` : '',
        phase !== 'stay' && motion ? String(motion).replace(/-/g, ' ') : '',
      ].filter(Boolean);
      return {title, subtitle: bits.join(' · ') || 'On this section'};
    },
  },
};

const mediaTextColumnFields = [
  defineField({
    name: 'content',
    title: 'Text',
    type: 'array',
    of: customBlockEditor,
    fieldset: 'copy',
    description: 'Type for this overlay column. Same editor as Template T.',
  }),
  defineField({
    name: 'motionSteps',
    title: 'Text motion',
    type: 'array',
    of: [mediaTextMotionItem],
    fieldset: 'motion',
    description: 'Leave empty for static type that stays while you scroll. Add Entrance, then Stay, then Exit in order. Exit always runs after the steps above it — it is not skipped. Stay 0 = hold on screen until Exit (if any) or until this section is pushed off.',
  }),
  ...overlayTypographyFields(),
];

const mediaTextColumnTitles = [
  'Left text template',
  'Mid / right text template',
  'Right text template',
  'Column 4 text template',
  'Column 5 text template',
  'Column 6 text template',
];

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  orderings: [
    {
      title: 'Section ID',
      name: 'sectionIdAsc',
      by: [{field: 'idSort', direction: 'asc'}, {field: 'id', direction: 'asc'}],
    },
    {
      title: 'Latest change',
      name: 'updatedDesc',
      by: [{field: '_updatedAt', direction: 'desc'}],
    },
    {
      title: 'Project -> Section',
      name: 'projectSectionAsc',
      by: [
        {field: 'projectKey', direction: 'asc'},
        {field: 'idSort', direction: 'asc'},
        {field: 'id', direction: 'asc'}
      ]
    },
    {
      title: 'Project -> Section -> Template',
      name: 'projectSectionTemplateAsc',
      by: [
        {field: 'projectKey', direction: 'asc'},
        {field: 'idSort', direction: 'asc'},
        {field: 'id', direction: 'asc'},
        {field: 'template', direction: 'asc'}
      ]
    },
    {
      title: 'Project -> Latest Updated',
      name: 'projectUpdatedDesc',
      by: [
        {field: 'projectKey', direction: 'asc'},
        {field: '_updatedAt', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'id',
      template: 'template',
      projectKey: 'projectKey'
    },
    prepare({title, subtitle, projectKey}: any) {
      return {
        title: title || 'Untitled Section',
        subtitle: `${projectKey || 'Site-wide'} | ${subtitle || 'None'}`,
        media: () => '📑'
      }
    }
  },
  fieldsets: [
    {name: 'logoTemplateConfig', title: 'Logo Form (Mark / Motion)', options: {collapsible: true, collapsed: true}},
    {name: 'logoSizeConfig', title: 'Logo Size (8 Breakpoints)', description: 'Scale and offsets per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},
    {name: 'logoLookConfig', title: 'Logo Look (Color / Blend / Filter)', options: {collapsible: true, collapsed: true}},
    {name: 'tickerConfig', title: 'Ticker / Marquee Overlay', options: {collapsible: true, collapsed: true}},
    {name: 'fullscreenFrameConfig', title: 'Frame & Background', options: {collapsible: true, collapsed: true}},
    {name: 'modularGridConfig', title: 'Modular Grid Settings (Template P)', options: {collapsible: true, collapsed: true}},
    {name: 'desktopMediaConfig', title: 'Desktop', options: {collapsible: true, collapsed: true}},
    {name: 'mobileMediaConfig', title: 'Mobile / Tablet', options: {collapsible: true, collapsed: true}},
    {name: 'mediaScaleConfig', title: 'Optical Media Zoom / Scale (8-Tier)', description: 'Optical zoom per screen size. 100 = original. 120 = 20% in. 80 = 20% out.', options: {collapsible: true, collapsed: true}},
    {name: 'mediaTextConfig', title: 'T: Text Overlay (On Media)', options: {collapsible: true, collapsed: true}},
    {name: 'sectionBgConfig', title: 'Background', description: 'Color plate behind this template. Add a filter effect, or a blend with color and transparency, over the section behind (video, image, or color).', options: {collapsible: true, collapsed: true}},
  ],
    fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'id', title: 'Section ID', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'idSort',
      title: 'Section ID sort',
      type: 'string',
      components: {field: IdSortField},
    }),
    defineField({
      name: 'projectKey',
      title: 'Parent project',
      type: 'string',
      components: {input: ProjectKeyInput},
    }),
    
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: customBlockEditor,
      hidden: ({document}: any) => showsMediaText(document),
    }),

    defineField({
      name: 'template',
      title: 'Layout Template',
      type: 'string',
      options: {
        list: [
          {title: 'A: One media, fullscreen', value: 'a'},
          {title: 'A: One media, fullscreen scroll', value: 'a-tall'},
          {title: 'A: One media, landscape', value: 'b'},
          {title: 'A: One media, landscape big', value: 'k'},
          {title: 'A: One media, landscape wide', value: 'l'},
          {title: 'A: One media, landscape extra-wide', value: 'e'},
          {title: 'A: One media, landscape oversize', value: 'n'},
          {title: 'L: Logo, One media, fullscreen', value: 'logo'},
          {title: 'A: One media, square', value: 'c'},
          {title: 'A: One media, portrait', value: 'v'},
          {title: 'B: Two medias, portrait', value: 'd'},
          {title: 'B: Two medias, fullscreen', value: 'fs2'},
          {title: 'B: Two medias, landscape', value: 'm'},
          {title: 'B: Two medias, portrait, 2 sizes', value: 'g'},
          {title: 'C: Three medias, portrait', value: 'f'},
          {title: 'C: Three medias, fullscreen', value: 'fs3'},
          {title: 'D: Four medias, fullscreen', value: 'fs4'},
          {title: 'F: Multiple medias, free ratio', value: 'p'},
          {title: 'T: Typography, fullscreen 1', value: 't'},
          {title: 'T: Typography, fullscreen 2', value: 't-new'},
          {title: 'T: Typography, fullscreen scroll', value: 'long'},
          {title: 'Z: Company footer', value: 'z'},
          {title: 'H: Fullscreen background', value: 'h'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'singleMedia',
      title: 'Single Media',
      type: 'mediaItem',
      options: {collapsible: false},
      components: {field: BareObjectField},
      hidden: ({document}: any) => !['a', 'a-tall', 'b', 'c', 'e', 'k', 'l', 't', 'h', 'n', 'v', 't-new', 'logo'].includes(document?.template),
    }),
    defineField({
      name: 'iconOverallSize',
      title: 'SVG / PNG overall size control',
      type: 'number',
      description: 'One size for every SVG and PNG in this template, including every icon in a carousel. A bare number up to 10 is a factor (1 = full size). A larger number is a percent (80 = 80%). A screen size below replaces this on that screen only. Empty keeps each icon’s own size. If one icon has its own Size, that number is used for that icon.',
      hidden: ({document}: any) => !['a', 'd', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
    }),
    defineField({
      name: 'opticalIconDistance',
      title: 'Distance',
      type: 'string',
      description: 'One gap for the SVG and PNG icons in this template. The group stays in the middle of the screen. With 3 icons the center one stays centered and each side sits this far away. With 2 icons each sits half this far from the middle. Wide screens use it horizontally. Portrait uses it vertically. A plus opens the gap, a minus pulls the icons closer. Examples: 24, -12, 3vw. A bare number is pixels. Icon size is not changed. The left/right and up/down fields still move a single icon.',
      hidden: ({document}: any) => !['d', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
    }),
    defineField({
      name: 'opticalIconDistanceFineTune',
      title: 'Finetune X and Y gap distance',
      type: 'boolean',
      initialValue: false,
      description: 'Use a different gap on a wide screen than in portrait. X is the horizontal gap. Y is the vertical gap. The group stays centered either way. An empty X or Y keeps the Distance number. A screen X or Y below replaces that axis on that screen only.',
      hidden: ({document}: any) => !['d', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
    }),
    defineField({
      name: 'opticalIconDistanceX',
      title: 'X distance',
      type: 'string',
      description: 'Horizontal gap on a wide screen. A plus opens it, a minus pulls the icons closer. A bare number is pixels. Empty uses Distance. A screen X below replaces this on that screen only.',
      hidden: ({document}: any) => !document?.opticalIconDistanceFineTune || !['d', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
    }),
    defineField({
      name: 'opticalIconDistanceY',
      title: 'Y distance',
      type: 'string',
      description: 'Vertical gap in portrait. A plus opens it, a minus pulls the icons closer. A bare number is pixels. Empty uses Distance. A screen Y below replaces this on that screen only.',
      hidden: ({document}: any) => !document?.opticalIconDistanceFineTune || !['d', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
    }),
    ...[
      {key: 'Desktop', title: 'Desktop (> 1600px)'},
      {key: 'Laptop', title: 'Laptop (1025px – 1600px)'},
      {key: 'TabletLandscape', title: 'Tablet Landscape (901px – 1024px)'},
      {key: 'TabletPortrait', title: 'Tablet Portrait (769px – 900px)'},
      {key: 'MobileLandscape', title: 'Mobile Landscape (Height Under 900px)'},
      {key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small (Height Under 400px)'},
      {key: 'MobilePortrait', title: 'Mobile Portrait (376px – 768px)'},
      {key: 'MobilePortraitSmall', title: 'Mobile Portrait Small (≤ 375px)'},
    ].flatMap((bp) => [
      defineField({
        name: `iconOverallSize${bp.key}`,
        title: `Size - ${bp.title}`,
        type: 'number',
        description: 'Replaces the overall size on this screen only. Empty keeps the overall size. One icon’s own Size still replaces this.',
        hidden: ({document}: any) => !['a', 'd', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
      }),
      defineField({
        name: `opticalIconDistanceX${bp.key}`,
        title: `X distance - ${bp.title}`,
        type: 'string',
        description: 'Horizontal gap on this screen only. A plus opens it, a minus pulls the icons closer. A bare number is pixels. Empty keeps the X distance above, or Distance when that is empty.',
        hidden: ({document}: any) => !['d', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
      }),
      defineField({
        name: `opticalIconDistanceY${bp.key}`,
        title: `Y distance - ${bp.title}`,
        type: 'string',
        description: 'Vertical gap on this screen only. A plus opens it, a minus pulls the icons closer. A bare number is pixels. Empty keeps the Y distance above, or Distance when that is empty.',
        hidden: ({document}: any) => !['d', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
      }),
    ]),
    defineField({
      name: 'opticalIconBalance',
      title: 'Optical correction',
      type: 'boolean',
      initialValue: false,
      description: 'For SVG and PNG icons in this 2, 3, or multi-media row. When on, each icon shifts so its visible artwork lines up with the others. Empty space inside a file no longer makes one icon look off-center. The size you set stays exactly as it is.',
      hidden: ({document}: any) => !['a', 'd', 'g', 'm', 'f', 'fs2', 'fs3', 'fs4', 'p'].includes(document?.template),
    }),
    defineField({
      name: 'twoMedia',
      title: 'Two Media',
      type: 'twoColumnMedia',
      options: {collapsible: true, collapsed: true},
      hidden: ({document}: any) => !['d', 'g', 'm', 'fs2'].includes(document?.template),
    }),
    defineField({
      name: 'threeMedia',
      title: 'Three Media',
      type: 'threeColumnMedia',
      options: {collapsible: true, collapsed: true},
      hidden: ({document}: any) => !['f', 'fs3'].includes(document?.template),
    }),
    defineField({
      name: 'fourMedia',
      title: 'Four Media',
      type: 'fourColumnMedia',
      options: {collapsible: true, collapsed: true},
      hidden: ({document}: any) => document?.template !== 'fs4',
    }),
    defineField({
      name: 'modularMediaArray',
      title: 'Modular Media',
      type: 'array',
      of: [{type: 'modularMediaItem'}],
      hidden: ({document}: any) => document?.template !== 'p',
    }),

    defineField({
      name: 'enableMediaText',
      title: 'Add text',
      type: 'boolean',
      fieldset: 'mediaTextConfig',
      initialValue: false,
      description: 'Puts Template T on this media: one text template per overlay column, with the same filter engine, blend modes, fonts, sizes, and box as Template T. Empty motion = static type.',
      hidden: ({document}: any) => !MEDIA_TEXT_TEMPLATES.includes(document?.template),
    }),
    defineField({
      name: 'mediaTextGrid',
      title: 'Text overlay structure',
      type: 'string',
      fieldset: 'mediaTextConfig',
      options: {list: [
        {title: 'Fullscreen', value: '1'},
        {title: '2 columns', value: '2'},
        {title: '3 columns', value: '3'},
        {title: '4 columns', value: '4'},
        {title: '5 columns', value: '5'},
        {title: '6 columns', value: '6'},
      ]},
      initialValue: '1',
      description: 'Equal tracks for the type only — not locked to the media cells. 3 media columns |    |    |    | split the frame at 1/3 and 2/3. A 6-track grid puts lines on those same thirds (between tracks 2|3 and 4|5), but each text still sits in the middle of its track. To put the type axis on the media borders — |    x    x    | — use “On media column edges” below.',
      hidden: ({document}: any) => !showsMediaText(document) || document?.mediaTextPlacement === 'edges',
    }),
    defineField({
      name: 'mediaTextPlacement',
      title: 'Text axis',
      type: 'string',
      fieldset: 'mediaTextConfig',
      options: {list: [
        {title: 'In equal tracks (center of each text column)', value: 'tracks'},
        {title: 'On media column edges (between the images)', value: 'edges'},
      ]},
      initialValue: 'tracks',
      description: 'On media column edges: 3 images → 2 text templates, centers at 1/3 and 2/3 (the | between cells). 2 images → 1 template at 1/2. 4 images → 3 templates at 1/4, 2/4, 3/4. Portrait stacks the same math on Y.',
      hidden: ({document}: any) => !showsMediaText(document),
    }),
    ...[1, 2, 3, 4, 5, 6].map((index) => defineField({
      name: `mediaTextCol${index}`,
      title: mediaTextColumnTitles[index - 1],
      description: 'Text sits with the motion clock. Leave motion empty for static type at this position.',
      type: 'object',
      fieldset: 'mediaTextConfig',
      options: {collapsible: true, collapsed: true},
      fieldsets: overlayTypographyFieldsets,
      fields: mediaTextColumnFields,
      hidden: ({document}: any) => !showsMediaText(document) || mediaTextColumns(document) < index,
    })),

    // --- LOGO TEMPLATE SETTINGS ---
    defineField({
      name: 'templateLogo',
      title: 'Template Logo (SVG)',
      type: 'image',
      fieldset: 'logoTemplateConfig',
      description: 'Upload a specific logo for this template. If left blank, it will use the Project Logo.',
      hidden: ({document}: any) => document?.template !== 'logo'
    }),
    defineField({
      name: 'logoBehavior',
      title: 'Logo Scroll Behavior (legacy)',
      type: 'string',
      fieldset: 'logoTemplateConfig',
      hidden: true
    }),
    defineField({
      name: 'logoTargetSection',
      title: 'Activate behavior (legacy)',
      type: 'string',
      fieldset: 'logoTemplateConfig',
      hidden: true
    }),
    defineField({
      name: 'logoUntilSection',
      title: 'Keep state until (legacy)',
      type: 'string',
      fieldset: 'logoTemplateConfig',
      hidden: true
    }),
    defineField({
      name: 'logoBehaviorSteps',
      title: 'Logo behaviors',
      type: 'array',
      fieldset: 'logoTemplateConfig',
      description: 'Where the mark sits and when it moves. These links follow the section itself, so renaming its ID or changing the section order keeps the behavior. Color, blend, and filter live on each section in Sticky Logo Look and move with it.',
      hidden: ({document}: any) => document?.template !== 'logo',
      of: [{
        type: 'object',
        initialValue: { behavior: 'sticky' },
        fields: [
          {
            name: 'behavior',
            title: 'Behavior',
            type: 'string',
            options: { list: [
              {title: 'Covered by next section', value: 'fade'},
              {title: 'Stay Sticky in Center', value: 'sticky'},
              {title: 'Move to Top', value: 'move-to-top'}
            ]},
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'activateAtSections',
            title: 'Activate behavior at',
            type: 'array',
            description: 'Leave empty on the first behavior — it starts on this Logo section. Picking a section keeps the link if that section is renamed or moved.',
            of: [{type: 'reference', to: [{type: 'section'}]}],
            components: {input: SectionRefInput},
          },
          {
            name: 'untilSections',
            title: 'Keep this state until',
            type: 'array',
            description: 'The mark holds this behavior through the sections you pick. Renaming their IDs or moving them does not clear it.',
            of: [{type: 'reference', to: [{type: 'section'}]}],
            components: {input: SectionRefInput},
          },
          {
            name: 'activateAt',
            title: 'Activate behavior at section ID(s)',
            type: 'string',
            hidden: true,
          },
          {
            name: 'until',
            title: 'Keep this state until section ID(s)',
            type: 'string',
            hidden: true,
          }
        ],
        preview: {
          select: {
            behavior: 'behavior',
            activateAt: 'activateAt',
            until: 'until',
            at0: 'activateAtSections.0->id',
            at1: 'activateAtSections.1->id',
            at2: 'activateAtSections.2->id',
            until0: 'untilSections.0->id',
            until1: 'untilSections.1->id',
            until2: 'untilSections.2->id',
          },
          prepare: ({behavior, activateAt, until, at0, at1, at2, until0, until1, until2}: any) => {
            const at = [at0, at1, at2].filter(Boolean).join(', ') || activateAt
            const hold = [until0, until1, until2].filter(Boolean).join(', ') || until
            return {
              title: ({fade: 'Covered by next section', sticky: 'Stay Sticky in Center', 'move-to-top': 'Move to Top'} as Record<string, string>)[behavior] || behavior || 'Behavior',
              subtitle: [at && `at ${at}`, hold && `until ${hold}`].filter(Boolean).join(' · ') || 'Follows the linked sections'
            }
          }
        }
      }]
    }),
    ...createLogoTemplateFields('logoSizeConfig'),
    defineField({
      name: 'retuneLogoLook',
      title: 'Set a new look for this background',
      type: 'boolean',
      fieldset: 'logoLookConfig',
      description: 'Switch inside Sticky logo look. Off keeps the color, blend, and filter from the section before. On lets you set them for this background. A Logo template always shows these fields and does not need the switch. Renaming this section’s ID or moving it in the project keeps this look.',
      initialValue: false,
      hidden: ({document}: any) => document?.template === 'logo'
    }),
    defineField({
      name: 'logoEffectMode',
      title: 'Logo Effect Mode',
      type: 'string',
      options: { list: modeOptions },
      fieldset: 'logoLookConfig',
      hidden: ({document}: any) => document?.template !== 'logo' && !document?.retuneLogoLook
    }),
    defineField({
      name: 'logoEffectColor',
      title: 'Logo Color',
      type: 'string',
      description: 'Main fill / filter color. Used when Effect Mode is custom, glass, or liquid.',
      fieldset: 'logoLookConfig',
      hidden: ({document, parent}: any) => (document?.template !== 'logo' && !document?.retuneLogoLook) || !['custom', 'glass', 'liquid'].includes(parent?.logoEffectMode)
    }),
    defineField({
      name: 'logoEffectColorOpacity',
      title: 'Logo Color Transparency',
      type: 'number',
      description: '0.0 (Transparent) to 1.0 (Solid). Applies to the color above.',
      validation: Rule => Rule.min(0).max(1),
      fieldset: 'logoLookConfig',
      hidden: ({document, parent}: any) => (document?.template !== 'logo' && !document?.retuneLogoLook) || !['custom', 'glass', 'liquid'].includes(parent?.logoEffectMode)
    }),
    defineField({
      name: 'logoUnderlayBlendMode',
      title: 'Logo Underlay Blend Mode',
      type: 'string',
      description: 'Photoshop / Illustrator blend. Pick one and the color for that blend appears below.',
      options: { list: blendModeOptions },
      fieldset: 'logoLookConfig',
      hidden: ({document}: any) => document?.template !== 'logo' && !document?.retuneLogoLook
    }),
    defineField({
      name: 'logoUnderlayColor',
      title: 'Blend color',
      type: 'string',
      description: 'The fill this blend mode mixes with the background, e.g. #FFFFFF. This color is what changes the blend.',
      fieldset: 'logoLookConfig',
      hidden: ({document, parent}: any) => (document?.template !== 'logo' && !document?.retuneLogoLook) || !parent?.logoUnderlayBlendMode
    }),
    defineField({
      name: 'logoUnderlayOpacity',
      title: 'Logo Underlay Transparency',
      type: 'number',
      description: 'Photoshop Opacity (0–1), applied AFTER the blend. 1 = full blend, 0.4 = 40% strength.',
      validation: Rule => Rule.min(0).max(1),
      fieldset: 'logoLookConfig',
      hidden: ({document, parent}: any) => (document?.template !== 'logo' && !document?.retuneLogoLook) || !parent?.logoUnderlayBlendMode
    }),
    defineField({
      name: 'logoOpacity',
      title: 'Logo Transparency (Overall)',
      type: 'number',
      description: '0.0 (Invisible) to 1.0 (Fully visible). Fades the entire logo.',
      validation: Rule => Rule.min(0).max(1),
      fieldset: 'logoLookConfig',
      hidden: ({document}: any) => document?.template !== 'logo' && !document?.retuneLogoLook
    }),
    defineField({
      name: 'logoKnockout',
      title: 'Knock out logo from background',
      type: 'boolean',
      initialValue: false,
      fieldset: 'logoLookConfig',
      description: 'Punch the logo through the background surface (video, image, or color), like knockout on filter buttons.',
      hidden: ({document}: any) => document?.template !== 'logo' && !document?.retuneLogoLook
    }),
    defineField({ name: 'logoTargetEffectMode', title: 'Target Logo Effect Mode (legacy)', type: 'string', hidden: true }),
    defineField({ name: 'logoTargetEffectColor', title: 'Target Logo Color (legacy)', type: 'string', hidden: true }),
    defineField({ name: 'logoTargetEffectColorOpacity', title: 'Target Logo Color Transparency (legacy)', type: 'number', hidden: true }),
    defineField({ name: 'logoTargetUnderlayColor', title: 'Target Logo Underlay Color (legacy)', type: 'string', hidden: true }),
    defineField({ name: 'logoTargetUnderlayOpacity', title: 'Target Logo Underlay Transparency (legacy)', type: 'number', hidden: true }),
    defineField({ name: 'logoTargetUnderlayBlendMode', title: 'Target Logo Underlay Blend Mode (legacy)', type: 'string', hidden: true }),
    defineField({ name: 'logoTargetOpacity', title: 'Target Logo Transparency (legacy)', type: 'number', hidden: true }),
    // ------------------------------
        
    // --- TICKER SETTINGS ---
    defineField({ 
      name: 'enableTicker', 
      title: 'Enable Ticker/Marquee', 
      type: 'boolean', 
      fieldset: 'tickerConfig', 
      initialValue: false 
    }),
    defineField({ 
      name: 'tickerItems', 
      title: 'Ticker Items', 
      type: 'array', 
      fieldset: 'tickerConfig',
      hidden: ({document}: any) => !document?.enableTicker,
      of: [{
        type: 'object',
        name: 'tickerItem',
        title: 'Ticker Item',
        preview: {
          select: {
            text: 'text',
            direction: 'direction',
            effectMode: 'textEffectMode'
          },
          prepare({text, direction, effectMode}: any) {
            const directionLabel = direction === 'reverse' ? '←' : 
                                  direction === 'top-to-bottom' ? '↓' : 
                                  direction === 'bottom-to-top' ? '↑' : '→';
            const effectLabel = effectMode && effectMode !== 'original' ? ` [${effectMode}]` : '';
            return {
              title: text || 'Empty Ticker',
              subtitle: `${directionLabel} ${direction || 'right-to-left'}${effectLabel}`
            };
          }
        },
        fields: [
          defineField({ 
            name: 'text', 
            title: 'Text Content', 
            type: 'string',
            description: 'The text string to display in the marquee.',
            validation: (Rule) => Rule.required()
          }),
          defineField({ 
            name: 'textEffectMode', 
            title: 'Text Effect Mode', 
            type: 'string',
            description: 'Visual effect applied to the text (liquid metal, glass, etc.).',
            options: { 
              list: [
                {title: 'Original Colors', value: 'original'},
                {title: 'White (Flat)', value: 'white'},
                {title: 'Black (Flat)', value: 'black'},
                {title: 'Contrast (Difference)', value: 'contrast'},
                {title: 'Liquid Metal (Overlay)', value: 'liquid'},
                {title: 'Apple Glass (Blur/Glow)', value: 'glass'},
                {title: 'RGB (Chromatic)', value: 'rgb'},
                {title: 'Custom Color (Solid)', value: 'custom'}
              ] 
            },
            initialValue: 'original'
          }),
          defineField({ 
            name: 'effectColor', 
            title: 'Effect Color (Custom/Liquid/Glass)', 
            type: 'string',
            description: 'Color for custom, liquid, or glass effects.',
            hidden: ({parent}: any) => !['custom', 'liquid', 'glass'].includes(parent?.textEffectMode)
          }),
          defineField({ 
            name: 'speed', 
            title: 'Animation Speed (Seconds)', 
            type: 'number',
            description: 'Duration for one complete loop (higher = slower).',
            initialValue: 20
          }),
          defineField({ 
            name: 'direction', 
            title: 'Direction', 
            type: 'string',
            options: { 
              list: [
                {title: 'Right to Left (Standard)', value: 'normal'}, 
                {title: 'Left to Right', value: 'reverse'}, 
                {title: 'Top to Bottom', value: 'top-to-bottom'}, 
                {title: 'Bottom to Top', value: 'bottom-to-top'}
              ] 
            },
            initialValue: 'normal'
          }),
          defineField({ 
            name: 'verticalPosition', 
            title: 'Position (Vertical or Horizontal)', 
            type: 'string',
            description: 'For horizontal: vertical position (e.g., "50%", "20%"). For vertical: horizontal position (e.g., "50%", "10%").',
            initialValue: '50%'
          }),
          defineField({ 
            name: 'gap', 
            title: 'Gap Between Repeated Text', 
            type: 'string',
            description: 'Spacing between text repeats (e.g., "2vw", "3vh", "100px").',
            initialValue: '2vw'
          }),
          defineField({ 
            name: 'loopGap', 
            title: 'Pause Space Before the Text Repeats', 
            type: 'string',
            description: 'Empty space after the last line, before the whole text starts again (e.g., "50vh" = half the screen height). Empty = no extra space.',
          }),
          defineField({ 
            name: 'rotation', 
            title: 'Text Rotation (Degrees)', 
            type: 'number',
            description: 'Rotate each text item (e.g., 0, 45, -15).',
            initialValue: 0
          }),
          defineField({ 
            name: 'fontFamily', 
            title: 'Font Family', 
            type: 'reference',
            to: [{type: 'fontResource'}],
            description: 'Select a font from your Font Resources. Leave empty to inherit the font from the Section.'
          }),
          defineField({ 
            name: 'fontSize', 
            title: 'Font Size', 
            type: 'string',
            description: 'e.g., "5vw", "48px", "3rem"',
            initialValue: '5vw'
          }),
          defineField({ 
            name: 'fontColor', 
            title: 'Font Color', 
            type: 'string',
            description: 'Base text color (e.g., #000000, #FFFFFF).',
            initialValue: '#000000'
          }),
          defineField({ 
            name: 'opacity', 
            title: 'Opacity', 
            type: 'number',
            description: 'Overall opacity of the ticker (0.0 to 1.0).',
            validation: Rule => Rule.min(0).max(1),
            initialValue: 1
          }),
          defineField({ 
            name: 'layering', 
            title: 'Layering (Z-Index)', 
            type: 'string',
            options: { 
              list: [
                {title: 'Behind Content', value: '0'}, 
                {title: 'In Front of Content', value: '10'},
                {title: 'Far Back', value: '-1'},
                {title: 'Way Up Front', value: '100'}
              ] 
            },
            initialValue: '10'
          })
        ]
      }]
    }),
    
    // --- LEGACY TICKER FIELDS (Hidden, for backwards compatibility) ---
    defineField({ name: 'tickerText', title: 'Ticker Content (Legacy)', type: 'array', fieldset: 'tickerConfig', of: [{type: 'string'}], hidden: true }),
    defineField({ name: 'tickerSpeed', title: 'Animation Speed (Legacy)', type: 'number', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerDirection', title: 'Direction (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerVerticalPosition', title: 'Vertical Position (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerGap', title: 'Gap (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerItemRotation', title: 'Rotation (Legacy)', type: 'number', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerFont', title: 'Font (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerSize', title: 'Size (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerColor', title: 'Color (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerOpacity', title: 'Opacity (Legacy)', type: 'number', fieldset: 'tickerConfig', hidden: true }),
    defineField({ name: 'tickerZIndex', title: 'Z-Index (Legacy)', type: 'string', fieldset: 'tickerConfig', hidden: true }),

defineField({
      name: 'enableCustomTransition',
      title: 'Enable Fine-Tune Scroll Animation',
      type: 'boolean',
      description: 'Master switch. Turn ON to reveal and use the custom transition controls below (Transparency Effect, Fade Colors). When OFF, this section always uses standard hard stacking/unstacking with no color blending or opacity fading.',
      initialValue: false
    }),
    defineField({
      name: 'transparencyEffect',
      title: 'Transparency Effect (Previous Section)',
      type: 'string',
      options: { list: [{title: 'None (Default / Overlay)', value: 'none'}, {title: 'Push Up (Standard Scroll)', value: 'push'}, {title: 'Fade Out', value: 'fade'}, {title: 'Crossfade', value: 'crossfade'}] },
      initialValue: 'none',
      hidden: ({document}: any) => !document?.enableCustomTransition
    }),
    defineField({
      name: 'enableAscentTransition',
      title: 'Enable Custom Upward Scroll Animation',
      type: 'boolean',
      description: 'When OFF, upward scrolling from deeper sections uses default hard unstacking. When ON, applies custom transition physics during upward scroll.',
      initialValue: false,
      hidden: ({document}: any) => !document?.enableCustomTransition
    }),
    defineField({
      name: 'reverseCrossfadeOnAscent',
      title: 'Reverse Crossfade on Upward Scroll',
      type: 'boolean',
      description: 'Enables independent crossfade color logic when scrolling back up from deeper sections.',
      initialValue: false,
      hidden: ({document}: any) => !document?.enableCustomTransition || document?.transparencyEffect !== 'crossfade'
    }),
    defineField({
      name: 'fadeColorDown',
      title: 'Fade Color (Scrolling Down / Exiting Top)',
      type: 'string',
      description: 'The background color revealed when you scroll forward to the NEXT section (e.g. #000000). Falls back to the next section\'s own background color when left blank.',
      initialValue: '#000000',
      hidden: ({document}: any) => !document?.enableCustomTransition || !['fade', 'crossfade'].includes(document?.transparencyEffect)
    }),
    defineField({
      name: 'fadeColorUp',
      title: 'Fade Color (Scrolling Up / Exiting Bottom)',
      type: 'string',
      description: 'The background color revealed when you scroll backward to the PREVIOUS section (e.g. #ffffff). Only used when "Enable Custom Upward Scroll Animation" is ON. Falls back to the previous section\'s own background color when left blank.',
      initialValue: '#000000',
      hidden: ({document}: any) => !document?.enableCustomTransition || !['fade', 'crossfade'].includes(document?.transparencyEffect)
    }),
    defineField({ name: 'isSticky', title: 'Stable / Sticky (Ignore Push Effect)', type: 'boolean', initialValue: false }),
    defineField({ 
      name: 'coversProjectLogo', 
      title: 'Covers Project Logo', 
      type: 'boolean', 
      description: 'If ON, this section will slide over and cover the Project Logo (useful for footers).', 
      initialValue: false 
    }),
        
defineField({
      name: 'desktopAspectRatio',
      title: 'Desktop Aspect Ratio',
      type: 'string',
      fieldset: 'desktopMediaConfig',
      options: { list: [{title: 'Default (Template Standard)', value: 'original'}, {title: '1:1 (Square)', value: '1/1'}, {title: '5:4', value: '5/4'}, {title: '4:3', value: '4/3'}, {title: '3:2', value: '3/2'}, {title: '16:10', value: '16/10'}, {title: '16:9', value: '16/9'}, {title: '21:9', value: '21/9'}, {title: '4:5', value: '4/5'}, {title: '3:4', value: '3/4'}, {title: '2:3', value: '2/3'}, {title: '2:4', value: '2/4'}, {title: '9:16', value: '9/16'}] },
      initialValue: 'original',
      hidden: ({document}: any) => !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'd', 'f', 'g', 'm', 'logo'].includes(document?.template),
    }),
    defineField({ name: 'desktopHeight', title: 'Desktop Height Override', type: 'string', fieldset: 'desktopMediaConfig', hidden: ({document}: any) => !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'd', 'f', 'g', 'm'].includes(document?.template) }),

defineField({
      name: 'enableAdvancedDeviceOverrides',
      title: 'Enable Advanced Device Overrides',
      type: 'boolean',
      fieldset: 'mobileMediaConfig',
      description: 'Turn ON to specify exact aspect ratios for Tablet and Mobile orientations independently.',
      initialValue: false,
      hidden: ({document}: any) => !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'logo'].includes(document?.template),
    }),
defineField({
      name: 'mobileAspectRatio',
      title: 'Basic Mobile/Tablet Aspect Ratio',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      options: { list: [{title: 'Only Padding (Default 4vw)', value: 'original'}, {title: 'Full Format (No Padding)', value: 'full'}, {title: '1:1 (Square)', value: '1/1'}, {title: '5:4', value: '5/4'}, {title: '4:3', value: '4/3'}, {title: '3:2', value: '3/2'}, {title: '16:10', value: '16/10'}, {title: '16:9', value: '16/9'}, {title: '21:9', value: '21/9'}, {title: '4:5', value: '4/5'}, {title: '3:4', value: '3/4'}, {title: '2:3', value: '2/3'}, {title: '2:4', value: '2/4'}, {title: '10:16', value: '10/16'}, {title: '9:16', value: '9/16'}, {title: '9:21', value: '9/21'}, {title: 'Custom Ratio (Define Below)', value: 'custom'}] },
      initialValue: 'original',
      hidden: ({document}: any) => document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'logo'].includes(document?.template),
    }),
    defineField({ name: 'customMobileRatio', title: 'Enter Custom Ratio (e.g. 2/8)', type: 'string', fieldset: 'mobileMediaConfig', hidden: ({parent}: any) => parent?.mobileAspectRatio !== 'custom' }),
    
    defineField({
      name: 'tabletLandscapeAspectRatio',
      title: 'Tablet Landscape Aspect Ratio',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      options: { list: [{title: 'Inherit Desktop', value: 'original'}, {title: 'Full Format (No Padding)', value: 'full'}, {title: '1:1 (Square)', value: '1/1'}, {title: '5:4', value: '5/4'}, {title: '4:3', value: '4/3'}, {title: '3:2', value: '3/2'}, {title: '16:10', value: '16/10'}, {title: '16:9', value: '16/9'}, {title: '21:9', value: '21/9'}, {title: '4:5', value: '4/5'}, {title: '3:4', value: '3/4'}, {title: '2:3', value: '2/3'}, {title: '2:4', value: '2/4'}, {title: '10:16', value: '10/16'}, {title: '9:16', value: '9/16'}, {title: '9:21', value: '9/21'}, {title: 'Custom Ratio (Define Below)', value: 'custom'}] },
      initialValue: 'original',
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'logo'].includes(document?.template),
    }),
    defineField({ name: 'customTabletLandscapeRatio', title: 'Enter Custom Ratio (e.g. 2/8)', type: 'string', fieldset: 'mobileMediaConfig', hidden: ({parent}: any) => parent?.tabletLandscapeAspectRatio !== 'custom' }),

    defineField({
      name: 'tabletPortraitAspectRatio',
      title: 'Tablet Portrait Aspect Ratio',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      options: { list: [{title: 'Inherit Basic Mobile', value: 'original'}, {title: 'Full Format (No Padding)', value: 'full'}, {title: '1:1 (Square)', value: '1/1'}, {title: '5:4', value: '5/4'}, {title: '4:3', value: '4/3'}, {title: '3:2', value: '3/2'}, {title: '16:10', value: '16/10'}, {title: '16:9', value: '16/9'}, {title: '21:9', value: '21/9'}, {title: '4:5', value: '4/5'}, {title: '3:4', value: '3/4'}, {title: '2:3', value: '2/3'}, {title: '2:4', value: '2/4'}, {title: '10:16', value: '10/16'}, {title: '9:16', value: '9/16'}, {title: '9:21', value: '9/21'}, {title: 'Custom Ratio (Define Below)', value: 'custom'}] },
      initialValue: 'original',
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'logo'].includes(document?.template),
    }),
    defineField({ name: 'customTabletPortraitRatio', title: 'Enter Custom Ratio (e.g. 2/8)', type: 'string', fieldset: 'mobileMediaConfig', hidden: ({parent}: any) => parent?.tabletPortraitAspectRatio !== 'custom' }),

    defineField({
      name: 'mobileLandscapeAspectRatio',
      title: 'Mobile Landscape Aspect Ratio',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      options: { list: [{title: 'Inherit Desktop', value: 'original'}, {title: 'Full Format (No Padding)', value: 'full'}, {title: '1:1 (Square)', value: '1/1'}, {title: '5:4', value: '5/4'}, {title: '4:3', value: '4/3'}, {title: '3:2', value: '3/2'}, {title: '16:10', value: '16/10'}, {title: '16:9', value: '16/9'}, {title: '21:9', value: '21/9'}, {title: '4:5', value: '4/5'}, {title: '3:4', value: '3/4'}, {title: '2:3', value: '2/3'}, {title: '2:4', value: '2/4'}, {title: '10:16', value: '10/16'}, {title: '9:16', value: '9/16'}, {title: '9:21', value: '9/21'}, {title: 'Custom Ratio (Define Below)', value: 'custom'}] },
      initialValue: 'original',
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'logo'].includes(document?.template),
    }),
    defineField({ name: 'customMobileLandscapeRatio', title: 'Enter Custom Ratio (e.g. 2/8)', type: 'string', fieldset: 'mobileMediaConfig', hidden: ({parent}: any) => parent?.mobileLandscapeAspectRatio !== 'custom' }),

    defineField({
      name: 'mobilePortraitAspectRatio',
      title: 'Mobile Portrait Aspect Ratio',
      type: 'string',
      fieldset: 'mobileMediaConfig',
      options: { list: [{title: 'Inherit Basic Mobile', value: 'original'}, {title: 'Full Format (No Padding)', value: 'full'}, {title: '1:1 (Square)', value: '1/1'}, {title: '5:4', value: '5/4'}, {title: '4:3', value: '4/3'}, {title: '3:2', value: '3/2'}, {title: '16:10', value: '16/10'}, {title: '16:9', value: '16/9'}, {title: '21:9', value: '21/9'}, {title: '4:5', value: '4/5'}, {title: '3:4', value: '3/4'}, {title: '2:3', value: '2/3'}, {title: '2:4', value: '2/4'}, {title: '10:16', value: '10/16'}, {title: '9:16', value: '9/16'}, {title: '9:21', value: '9/21'}, {title: 'Custom Ratio (Define Below)', value: 'custom'}] },
      initialValue: 'original',
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v', 'logo'].includes(document?.template),
    }),
    defineField({ name: 'customMobilePortraitRatio', title: 'Enter Custom Ratio (e.g. 2/8)', type: 'string', fieldset: 'mobileMediaConfig', hidden: ({parent}: any) => parent?.mobilePortraitAspectRatio !== 'custom' }),
    defineField({ 
      name: 'mobileAdditionalPadding', 
      title: 'Basic Mobile/Tablet Additional Padding', 
      type: 'string', 
      fieldset: 'mobileMediaConfig', 
      hidden: ({document}: any) => document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) 
    }),
    defineField({ 
      name: 'tabletLandscapePadding', 
      title: 'Tablet Landscape Additional Padding', 
      type: 'string', 
      fieldset: 'mobileMediaConfig', 
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) 
    }),
    defineField({ 
      name: 'tabletPortraitPadding', 
      title: 'Tablet Portrait Additional Padding', 
      type: 'string', 
      fieldset: 'mobileMediaConfig', 
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) 
    }),
    defineField({ 
      name: 'mobileLandscapePadding', 
      title: 'Mobile Landscape Additional Padding', 
      type: 'string', 
      fieldset: 'mobileMediaConfig', 
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) 
    }),
defineField({ 
      name: 'mobilePortraitPadding', 
      title: 'Mobile Portrait Additional Padding', 
      type: 'string', 
      fieldset: 'mobileMediaConfig', 
      hidden: ({document}: any) => !document?.enableAdvancedDeviceOverrides || !['a', 'a-tall', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) 
    }),

    ...createMediaScaleFields('mediaScaleConfig'),

    defineField({name: 'bgColor', title: 'Color', type: 'string', fieldset: 'sectionBgConfig'}),
    defineField({
      name: 'bgOpacity',
      title: 'Opacity',
      type: 'number',
      fieldset: 'sectionBgConfig',
      validation: (Rule) => Rule.min(0).max(1),
      initialValue: 1,
    }),
    defineField({
      name: 'bgModeDesktop',
      title: 'Filter Effect (Desktop)',
      type: 'string',
      options: {list: modeOptions},
      initialValue: 'original',
      fieldset: 'sectionBgConfig',
      description: 'Same engine as type and logos: liquid metal, glass, contrast, RGB, custom color.',
    }),
    defineField({
      name: 'bgEffectColorDesktop',
      title: 'Filter Color (Desktop)',
      type: 'string',
      fieldset: 'sectionBgConfig',
      hidden: ({parent}: any) => !['custom', 'glass', 'liquid'].includes(parent?.bgModeDesktop),
    }),
    defineField({
      name: 'bgModeMobile',
      title: 'Filter Effect (Mobile)',
      type: 'string',
      options: {list: modeOptions},
      initialValue: 'original',
      fieldset: 'sectionBgConfig',
    }),
    defineField({
      name: 'bgEffectColorMobile',
      title: 'Filter Color (Mobile)',
      type: 'string',
      fieldset: 'sectionBgConfig',
      hidden: ({parent}: any) => !['custom', 'glass', 'liquid'].includes(parent?.bgModeMobile),
    }),
    defineField({
      name: 'bgBlendMode',
      title: 'Blend mode',
      type: 'string',
      options: {list: blendModeOptions},
      fieldset: 'sectionBgConfig',
      description: 'Photoshop / Illustrator blend of this background with the section behind.',
    }),
    defineField({
      name: 'bgBlendColor',
      title: 'Blend color',
      type: 'string',
      fieldset: 'sectionBgConfig',
      description: 'Optional fill this blend mixes in, e.g. #FFFFFF. Empty blends the color / media itself.',
      hidden: ({parent}: any) => !parent?.bgBlendMode || parent?.bgBlendMode === 'normal',
    }),
    defineField({
      name: 'bgBlendOpacity',
      title: 'Blend transparency',
      type: 'number',
      fieldset: 'sectionBgConfig',
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(1),
      hidden: ({parent}: any) => !parent?.bgBlendMode || parent?.bgBlendMode === 'normal',
    }),
    defineField({ 
      name: 'isTransparentOverlay', 
      title: 'Is Transparent Overlay?', 
      type: 'boolean', 
      description: 'Check this to treat this section as glass. Videos and audio underneath will continue playing seamlessly.',
      initialValue: false 
    }),
    defineField({ name: 'customPadding', title: 'Custom Padding (Desktop Only)', type: 'string', hidden: ({document}: any) => !['k', 'l', 'n', 'v'].includes(document?.template) }),

    // ID 212.42: FORCING VISIBILITY WITH document?.template
    defineField({
      name: 'typographySettings',
      title: 'Typography Settings',
      type: 'object',
      options: closedFold,
      hidden: ({document}: any) => !showsTypography(document), 
      fieldsets: [
        ...typographyLookFieldsets,
        ...typographyStyleFieldsets,
      ],
      fields: [
        ...overlayLookFields(),
        ...createContainerFields('containerConfig'),
        
        defineField({name: 'desktopWidth', title: 'Legacy Desktop Width', type: 'string', hidden: true}),
        defineField({name: 'desktopHeight', title: 'Legacy Desktop Height', type: 'string', hidden: true}),
        defineField({name: 'tabletWidth', title: 'Legacy Tablet Width', type: 'string', hidden: true}),
        defineField({name: 'tabletHeight', title: 'Legacy Tablet Height', type: 'string', hidden: true}),
        defineField({name: 'mobileWidth', title: 'Legacy Mobile Width', type: 'string', hidden: true}),
        defineField({name: 'mobileHeight', title: 'Legacy Mobile Height', type: 'string', hidden: true}),
        defineField({name: 'verticalOffset', title: 'Legacy Vertical Offset', type: 'string', hidden: true}),
        
        ...createResponsiveTypeFields('h1', 'H1'),
        ...createResponsiveTypeFields('h2', 'H2'),
        ...createResponsiveTypeFields('h3', 'H3'),
        ...createResponsiveTypeFields('h4', 'H4'),
        ...createResponsiveTypeFields('h5', 'H5'),
        ...createResponsiveTypeFields('normal', 'Normal Text'),
        ...createResponsiveTypeFields('quote', 'Quote'),

        defineField({name: 'normalSize', title: 'Legacy Normal Size', type: 'string', hidden: true}), 
        defineField({name: 'h1Size', title: 'Legacy H1 Size', type: 'string', hidden: true}),
        defineField({name: 'h2Size', title: 'Legacy H2 Size', type: 'string', hidden: true}),
        defineField({name: 'h3Size', title: 'Legacy H3 Size', type: 'string', hidden: true}),

        defineField({name: 'paddingTop', title: 'Padding Top (Long Text)', type: 'string', fieldset: 'containerConfig', hidden: ({document}: any) => document?.template !== 'long'}),
        defineField({name: 'paddingBottom', title: 'Padding Bottom (Long Text)', type: 'string', fieldset: 'containerConfig', hidden: ({document}: any) => document?.template !== 'long'}),
        defineField({name: 'fontSize', title: 'Legacy Font Size', type: 'string', hidden: true}),
      ],
    }),
    
    // --- NEW SEQUENCE OVERLAY FIELD ---
    defineField({
      name: 'sequenceOverlays',
      title: 'Sequence Text Overlays (Scroll Linked)',
      type: 'array',
      fieldset: 'desktopMediaConfig',
      hidden: ({document}: any) => !['a', 'a-tall', 'logo'].includes(document?.template),
      of: [{
        type: 'object',
        name: 'overlay',
        fields: [
          defineField({ name: 'text', title: 'Text Content', type: 'array', of: customBlockEditor }),
          defineField({ 
            name: 'position', 
            title: 'Position', 
            type: 'string', 
            options: { list: [
              {title: 'Center', value: 'center'},
              {title: 'Top Left', value: 'top-left'},
              {title: 'Top Right', value: 'top-right'},
              {title: 'Bottom Left', value: 'bottom-left'},
              {title: 'Bottom Right', value: 'bottom-right'}
            ]}, 
            initialValue: 'center' 
          }),
          defineField({ 
            name: 'startScroll', 
            title: 'Fade In Start (%)', 
            type: 'number', 
            validation: Rule => Rule.min(0).max(100), 
            description: 'Scroll % where this text is fully visible. (e.g. 20)' 
          }),
          defineField({ 
            name: 'endScroll', 
            title: 'Fade Out End (%)', 
            type: 'number', 
            validation: Rule => Rule.min(0).max(100), 
            description: 'Scroll % where this text starts fading out. (e.g. 80)' 
          }),
defineField({ name: 'maxWidth', title: 'Max Width', type: 'string', initialValue: '800px', description: 'e.g. 800px, 90vw' }),
          
          defineField({ 
            name: 'movementDirection', 
            title: 'Animation Direction', 
            type: 'string', 
            options: { list: [
              {title: 'Float Up', value: 'up'},
              {title: 'Float Down', value: 'down'},
              {title: 'Float Left', value: 'left'},
              {title: 'Float Right', value: 'right'},
              {title: 'None (Fade Only)', value: 'none'}
            ]}, 
            initialValue: 'up' 
          }),
defineField({ 
            name: 'movementDistance', 
            title: 'Animation Distance (px)', 
            type: 'number', 
            initialValue: 150, // Bumped to 150px for a more cinematic sweep
            hidden: ({parent}: any) => parent?.movementDirection === 'none',
            description: 'How far the text moves while fading in/out. (e.g. 150, 300)'
          }),
          defineField({
            name: 'movementStyle',
            title: 'Movement Style',
            type: 'string',
            options: { list: [
              {title: 'Continuous Drift (Parallax)', value: 'parallax'},
              {title: 'Enter, Pause in Center, Exit (Pinned)', value: 'pinned'}
            ]},
            initialValue: 'parallax',
            hidden: ({parent}: any) => parent?.movementDirection === 'none',
          }),
]
      }]
    }),
    // ---------------------------------
    
    // --- NEW AWARD OVERLAYS FIELD ---
    defineField({
      name: 'awardOverlays',
      title: 'Award Overlays',
      type: 'array',
      of: [{type: 'awardOverlay'}],
      description: 'Add timed, effect-driven awards (sequences or WebM videos) to overlay on top of this section.'
    }),
    // ---------------------------------

    // --- FULLSCREEN FRAME CONFIG ---
    defineField({
      name: 'enableFullscreenPadding',
      title: 'Enable Outer Frame Padding',
      type: 'boolean',
      fieldset: 'fullscreenFrameConfig',
      description: 'Wraps the media in a padded container while keeping the inner aspect ratios dynamic.',
      initialValue: false,
      hidden: ({document}: any) => !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template)
    }),
    defineField({
      name: 'basicFullscreenPadding',
      title: 'Basic Frame Padding (e.g. 4vw)',
      type: 'string',
      fieldset: 'fullscreenFrameConfig',
      initialValue: '4vw',
      hidden: ({document}: any) => !document?.enableFullscreenPadding || document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template)
    }),
    defineField({
      name: 'enableFineTunePadding',
      title: 'Enable Fine-Tune Device Padding',
      type: 'boolean',
      fieldset: 'fullscreenFrameConfig',
      initialValue: false,
      hidden: ({document}: any) => !document?.enableFullscreenPadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template)
    }),
    
    // 8-Tier Responsive Padding
    defineField({ name: 'fsPaddingDesktop', title: 'Desktop (> 1440px)', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingLaptop', title: 'Laptop (1025-1440px)', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingTabletLandscape', title: 'Tablet Landscape', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingTabletPortrait', title: 'Tablet Portrait', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingMobileLandscape', title: 'Mobile Landscape Big', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingMobileLandscapeSmall', title: 'Mobile Landscape Small', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingMobilePortrait', title: 'Mobile Portrait Big', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsPaddingMobilePortraitSmall', title: 'Mobile Portrait Small', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTunePadding || !['a', 'a-tall', 'fs2', 'fs3', 'fs4'].includes(document?.template) }),
    
    // --- [NEW GAP FIELDS] ---
    defineField({
      name: 'enableFullscreenGap',
      title: 'Enable Gap Between Media (FS2, FS3, FS4)',
      type: 'boolean',
      fieldset: 'fullscreenFrameConfig',
      initialValue: false,
      hidden: ({document}: any) => !['fs2', 'fs3', 'fs4'].includes(document?.template)
    }),
    defineField({
      name: 'basicFullscreenGap',
      title: 'Basic Frame Gap (e.g. 2vw, 20px)',
      type: 'string',
      fieldset: 'fullscreenFrameConfig',
      initialValue: '2vw',
      hidden: ({document}: any) => !document?.enableFullscreenGap || document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template)
    }),
    defineField({
      name: 'enableFineTuneGap',
      title: 'Enable Fine-Tune Device Gap',
      type: 'boolean',
      fieldset: 'fullscreenFrameConfig',
      initialValue: false,
      hidden: ({document}: any) => !document?.enableFullscreenGap || !['fs2', 'fs3', 'fs4'].includes(document?.template)
    }),
    
    // 8-Tier Responsive Gap Fields
    defineField({ name: 'fsGapDesktop', title: 'Desktop Gap (> 1440px)', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapLaptop', title: 'Laptop Gap (1025-1440px)', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapTabletLandscape', title: 'Tablet Landscape Gap', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapTabletPortrait', title: 'Tablet Portrait Gap', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapMobileLandscape', title: 'Mobile Landscape Big Gap', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapMobileLandscapeSmall', title: 'Mobile Landscape Small Gap', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapMobilePortrait', title: 'Mobile Portrait Big Gap', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    defineField({ name: 'fsGapMobilePortraitSmall', title: 'Mobile Portrait Small Gap', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !document?.enableFineTuneGap || !['fs2', 'fs3', 'fs4'].includes(document?.template) }),
    // ------------------------

    // Custom Backgrounds
    defineField({ name: 'fullscreenBgColor', title: 'Custom Background Color', type: 'string', fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !['a', 'a-tall', 'fs2', 'fs3', 'fs4', 'logo', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) }),
    defineField({ name: 'fullscreenBgOpacity', title: 'Background Opacity', type: 'number', fieldset: 'fullscreenFrameConfig', initialValue: 1, validation: Rule => Rule.min(0).max(1), hidden: ({document}: any) => !['a', 'a-tall', 'fs2', 'fs3', 'fs4', 'logo', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) }),
    defineField({ name: 'fullscreenBgMedia', title: 'Custom Background Media', type: 'mediaItem', options: {collapsible: true, collapsed: true}, fieldset: 'fullscreenFrameConfig', hidden: ({document}: any) => !['a', 'a-tall', 'fs2', 'fs3', 'fs4', 'logo', 'b', 'c', 'e', 'h', 'k', 'l', 'n', 'v'].includes(document?.template) }),
    // -------------------------------
    
    // --- MODULAR GRID SETTINGS (TEMPLATE P) ---
    defineField({
      name: 'enableScrollableHeight',
      title: 'Enable Scrollable Height',
      type: 'boolean',
      fieldset: 'modularGridConfig',
      description: 'If ON, this section extends vertically allowing the user to scroll through images. If OFF, it crops to exactly 100vh.',
      initialValue: true,
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularGridGap',
      title: 'Grid Gap',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Gap between images (e.g. 2rem, 5vw, 20px).',
      initialValue: '2rem',
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularPaddingXMobilePortrait',
      title: 'Mobile Portrait – Side Padding (e.g. 5vw)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Space left and right of the images on phones held upright. Empty = Site Config (P: Multiple media); empty there = no side padding.',
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularPaddingYMobilePortrait',
      title: 'Mobile Portrait – Vertical Padding (e.g. 3vh)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Space above the first and below the last image on phones held upright; also the space between the images when no Gap is set. Empty = Site Config (P: Multiple media); empty there = no top/bottom padding.',
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularGapMobilePortrait',
      title: 'Mobile Portrait – Gap (e.g. 2vw)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Space between the images, across and down. Empty = Site Config (P: Multiple media); empty there = the Vertical Padding, else the Grid Gap.',
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularPerLineMobilePortrait',
      title: 'Mobile Portrait – Images per Line (e.g. 2)',
      type: 'number',
      fieldset: 'modularGridConfig',
      description: '1 = one image per line, stacked. 2 or more = lines of images in the same proportion and size; the last line holds what is left. Empty = Site Config (P: Multiple media); empty there = 1.',
      validation: (Rule: any) => Rule.integer().min(1),
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularRatioMobilePortrait',
      title: 'Mobile Portrait Lines – Proportion (e.g. 3/4)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'For 2 or more images per line: width / height of every image, e.g. 3/4 or 0.75. auto = the typical proportion of this section\'s images. Empty = Site Config (P: Multiple media).',
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularLayoutMobileLandscape',
      title: 'Mobile Landscape – Layout',
      type: 'string',
      fieldset: 'modularGridConfig',
      options: {
        list: [
          {title: 'Free (positions as set per image)', value: 'free'},
          {title: 'Lines (same size, set number per line)', value: 'row'},
        ],
        layout: 'radio',
      },
      description: 'Lines: images in the same proportion and size, a set number per line, centred on the screen. Empty = Free.',
      hidden: ({document}: any) => document?.template !== 'p'
    }),
    defineField({
      name: 'modularPerLineMobileLandscape',
      title: 'Mobile Landscape Lines – Images per Line (e.g. 3)',
      type: 'number',
      fieldset: 'modularGridConfig',
      description: 'The last line holds what is left, centred. Empty = Site Config (P: Multiple media); empty there = all images in one line.',
      validation: (Rule: any) => Rule.integer().min(1),
      hidden: ({document}: any) => document?.template !== 'p' || document?.modularLayoutMobileLandscape !== 'row'
    }),
    defineField({
      name: 'modularPaddingXMobileLandscape',
      title: 'Mobile Landscape Lines – Side Padding (e.g. 4vw)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Space left and right of the lines. Empty = Site Config (P: Multiple media); empty there = Mobile Landscape Padding.',
      hidden: ({document}: any) => document?.template !== 'p' || document?.modularLayoutMobileLandscape !== 'row'
    }),
    defineField({
      name: 'modularPaddingYMobileLandscape',
      title: 'Mobile Landscape Lines – Top/Bottom Padding (e.g. 3vh)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Space above the first and below the last line. Lines that fit stay centred on one screen. Empty = Site Config (P: Multiple media); empty there = none.',
      hidden: ({document}: any) => document?.template !== 'p' || document?.modularLayoutMobileLandscape !== 'row'
    }),
    defineField({
      name: 'modularRowHeightMobileLandscape',
      title: 'Mobile Landscape Lines – Image Height (e.g. 70%)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'In % of the visible screen height, or a length (e.g. 250px). The images get narrower only if a line would not fit the width. Empty = Site Config (P: Multiple media).',
      hidden: ({document}: any) => document?.template !== 'p' || document?.modularLayoutMobileLandscape !== 'row'
    }),
    defineField({
      name: 'modularRowGapMobileLandscape',
      title: 'Mobile Landscape Lines – Gap (e.g. 2vw)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Space between the images and between the lines. Empty = Site Config (P: Multiple media).',
      hidden: ({document}: any) => document?.template !== 'p' || document?.modularLayoutMobileLandscape !== 'row'
    }),
    defineField({
      name: 'modularRowRatioMobileLandscape',
      title: 'Mobile Landscape Lines – Proportion (e.g. 3/4)',
      type: 'string',
      fieldset: 'modularGridConfig',
      description: 'Width / height of every image, e.g. 3/4 or 0.75. auto = the typical proportion of this section\'s images. Empty = Site Config (P: Multiple media).',
      hidden: ({document}: any) => document?.template !== 'p' || document?.modularLayoutMobileLandscape !== 'row'
    }),
    defineField({
      name: 'modularHeightDesktop', 
      title: 'Extra Bottom Space (Desktop)', 
      type: 'string', 
      description: 'Added below the auto-calculated lowest image (e.g. 200px, 10vh). Use negative values (e.g. -100px) to cut the section height early.', 
      fieldset: 'modularGridConfig', 
      hidden: ({document}: any) => document?.template !== 'p' || !document?.enableScrollableHeight
    }),
    defineField({
      name: 'modularHeightTablet', 
      title: 'Extra Bottom Space (Tablet)', 
      type: 'string', 
      fieldset: 'modularGridConfig', 
      hidden: ({document}: any) => document?.template !== 'p' || !document?.enableScrollableHeight
    }),
    defineField({
      name: 'modularHeightMobile', 
      title: 'Extra Bottom Space (Mobile)', 
      type: 'string', 
      fieldset: 'modularGridConfig', 
      hidden: ({document}: any) => document?.template !== 'p' || !document?.enableScrollableHeight
    }),
    // ----------------------------------------
        
    // TEMPLATE Z CONTENT FIELDS
    defineField({
      name: 'contactDetails',
      title: 'Company Infos Details',
      type: 'object',
      hidden: ({document}: any) => document?.template !== 'z',
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
        defineField({ name: 'column1Text', title: 'Column 1 Text', type: 'array', of: customBlockEditor }), 
        defineField({ name: 'column2Text', title: 'Column 2 Text', type: 'array', of: customBlockEditor }), 
        defineField({ name: 'column3Text', title: 'Column 3 Text', type: 'array', of: customBlockEditor })  
      ]
    })
  ],
})