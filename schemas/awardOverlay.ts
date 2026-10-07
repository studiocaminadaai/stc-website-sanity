// schemas/awardOverlay.ts
import {defineField, defineType} from 'sanity'

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
fields.push(defineField({
        name: `${prefix}Position${bp.key}`,
        title: `${titlePrefix} Preset Position (${bp.title})`,
        type: 'string',
        options: {
          list: [
            {title: 'Left Middle', value: 'left-middle'},
            {title: 'Left Bottom Corner', value: 'left-bottom'},
            {title: 'Center Bottom', value: 'center-bottom'},
            {title: 'Custom (Use Top/Left Offsets below)', value: 'custom'}
          ]
        },
        initialValue: bp.key.includes('Mobile') ? 'center-bottom' : 'left-middle',
        fieldset
      }));
      fields.push(defineField({ 
          name: `${prefix}Offset${bp.key}`, 
          title: `${titlePrefix} Nudge/Offset (X, Y) - (${bp.title})`, 
          type: 'string', 
          description: 'e.g., "-1rem, 2vw". Nudges the award from its preset position (X, Y).', 
          fieldset 
      }));
      fields.push(defineField({ 
          name: `${prefix}Scale${bp.key}`, 
          title: `${titlePrefix} Scale/Width (${bp.title})`,
          type: 'number', 
          description: 'Width in vw or percentage (default 25).', 
          initialValue: 25, 
          validation: Rule => Rule.min(0).max(500),
          fieldset 
      }));
      fields.push(defineField({ 
          name: `${prefix}Top${bp.key}`, 
          title: `${titlePrefix} Top Offset (${bp.title})`, 
          type: 'string', 
          description: 'e.g., 50%, 2rem, 10vh.', 
          initialValue: '50%',
          fieldset 
      }));
      fields.push(defineField({ 
          name: `${prefix}Left${bp.key}`, 
          title: `${titlePrefix} Left Offset (${bp.title})`, 
          type: 'string', 
          description: 'e.g., 50%, 2rem, 10vw.', 
          initialValue: '50%',
          fieldset 
      }));
  });
  return fields;
};

export default defineType({
  name: 'awardOverlay',
  title: 'Award Overlay',
  type: 'object',
  fieldsets: [
    {name: 'activationConfig', title: 'Activation & Frequency', options: {collapsible: true, collapsed: true}},
    {name: 'timingConfig', title: 'Timing & Behavior', options: {collapsible: true, collapsed: true}},
    {name: 'effectConfig', title: 'Visual Effects', options: {collapsible: true, collapsed: true}},
    {name: 'positionConfig', title: 'Responsive Positioning (Scale, Top, Left)', description: 'Position, scale and offsets per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'title', 
      title: 'Internal Title', 
      type: 'string', 
      description: 'e.g. "FWA Site of the Day"'
    }),
    defineField({
      name: 'isEnabled',
      title: 'Enable Overlay',
      type: 'boolean',
      fieldset: 'activationConfig',
      initialValue: true,
      description: 'Turn off to keep the content saved but prevent it from loading on the live site.'
    }),
    defineField({
      name: 'displayFrequency',
      title: 'Display Frequency',
      type: 'string',
      fieldset: 'activationConfig',
      options: {
        list: [
          { title: 'Show Every Time (On Section Scroll)', value: 'every_time' },
          { title: 'Show Once Per Project Visit (Resets if you swipe to another project)', value: 'once_per_project' },
          { title: 'Show Once Per Session (Requires full browser reload to see again)', value: 'once_per_session' }
        ]
      },
      initialValue: 'every_time'
    }),
    defineField({
      name: 'awardMedia', 
      title: 'Award Media (Sequence / Transparent WebM)', 
      type: 'mediaItem',
      options: {collapsible: true, collapsed: true},
    }),
        
// Timing Hooks (Award Animation)
    defineField({
      name: 'delaySeconds', 
      title: 'AWARD ANIMATION: Start Delay (Seconds)', 
      type: 'number', 
      fieldset: 'timingConfig', 
      initialValue: 1.0, 
      description: 'How long to wait before fading in the Award Animation.'
    }),
    defineField({
      name: 'durationSeconds', 
      title: 'AWARD ANIMATION: Duration (Seconds)', 
      type: 'number', 
      fieldset: 'timingConfig', 
      initialValue: 5.0, 
      description: 'Set to 0 to keep it visible forever.'
    }),
    // Timing Hooks (Text)
    defineField({
      name: 'textDelaySeconds', 
      title: 'TEXT: Start Delay (Seconds)', 
      type: 'number', 
      fieldset: 'timingConfig', 
      initialValue: 1.5, 
      description: 'How long to wait before fading in the Center Text.'
    }),
defineField({
      name: 'textDurationSeconds', 
      title: 'TEXT: Duration (Seconds)', 
      type: 'number', 
      fieldset: 'timingConfig', 
      initialValue: 4.5, 
      description: 'Set to 0 to keep it visible forever.'
    }),
    // Timing Hooks (Background Layers)
    defineField({
      name: 'bgDelaySeconds', 
      title: 'BACKGROUND: Start Delay (Seconds)', 
      type: 'number', 
      fieldset: 'timingConfig', 
      initialValue: 0.5, 
      description: 'How long to wait before fading in the Background Color & Media.'
    }),
    defineField({
      name: 'bgDurationSeconds', 
      title: 'BACKGROUND: Duration (Seconds)', 
      type: 'number', 
      fieldset: 'timingConfig', 
      initialValue: 6.0, 
      description: 'Set to 0 to keep it visible forever.'
    }),
    defineField({
      name: 'textBgColor',
      title: 'Text Background Color (Full Page)',
      type: 'string',
      fieldset: 'timingConfig',
      description: 'Optional. Hex code (e.g., #000000) to fade in behind the text to improve readability.',
    }),
    defineField({
      name: 'textBgOpacity',
      title: 'Text Background Opacity',
      type: 'number',
      fieldset: 'timingConfig',
      initialValue: 0.5,
      validation: Rule => Rule.min(0).max(1),
    }),
    defineField({
      name: 'textBgMedia',
      title: 'Text Background Media (Video/Image)',
      type: 'mediaItem',
      options: {collapsible: true, collapsed: true},
      fieldset: 'timingConfig',
      description: 'Optional. Add a video or image layer just below the background color.',
    }),
    
// Effects
    defineField({name: 'awardModeDesktop', title: 'Effect Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'effectConfig'}),
    defineField({name: 'awardColorDesktop', title: 'Effect Color (Desktop)', type: 'string', fieldset: 'effectConfig', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.awardModeDesktop)}),
    defineField({name: 'awardModeMobile', title: 'Effect Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'effectConfig'}),
    defineField({name: 'awardColorMobile', title: 'Effect Color (Mobile)', type: 'string', fieldset: 'effectConfig', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.awardModeMobile)}),
    
    defineField({name: 'textModeDesktop', title: 'Text Effect Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'effectConfig'}),
    defineField({name: 'textColorDesktop', title: 'Text Effect Color (Desktop)', type: 'string', fieldset: 'effectConfig', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.textModeDesktop)}),
    defineField({name: 'textModeMobile', title: 'Text Effect Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'effectConfig'}),
    defineField({name: 'textColorMobile', title: 'Text Effect Color (Mobile)', type: 'string', fieldset: 'effectConfig', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.textModeMobile)}),

    // Typography
      defineField({
      name: 'centerText', 
      title: 'Optional Center Text',
      type: 'array', 
      of: [{type: 'block'}, {type: 'customSpacing'}], 
      description: 'Optional text to display layered with the award animation.'
    }),

    // Responsive Positioning
    ...createResponsiveFields('award', 'Award', 'positionConfig'),
  ],
})