// stc-website-sanity/schemas/siteConfig.ts
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

const showGranular = ({parent}: any) => {
    const dMode = parent?.filterModeDesktop;
    const mMode = parent?.filterModeMobile;
    return ['custom', 'liquid'].includes(dMode) || ['custom', 'liquid'].includes(mMode);
};

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
]

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

const createGlobalTypographyFields = (prefix: string, fieldset: string) => {
    const fields: any[] = [];
    fields.push(defineField({ name: `${prefix}Font`, title: 'Font Family', type: 'reference', to: [{type: 'fontResource'}], description: 'Select a font from the Font Resources.', fieldset }));
    fields.push(defineField({ name: `${prefix}Color`, title: 'Color (Default)', type: 'string', fieldset }));
    fields.push(defineField({ name: `${prefix}UnderlineThickness`, title: 'Underline Thickness', type: 'string', description: 'e.g., 1px, 0.05em. Controls link underline weight.', fieldset }));
    fields.push(defineField({ name: `${prefix}UnderlineOffset`, title: 'Underline Offset', type: 'string', description: 'e.g., 4px, 0.2em. Distance from text to the line.', fieldset }));
    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `${prefix}Size${bp.key}`, title: `Size - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `${prefix}LineHeight${bp.key}`, title: `Line Height - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `${prefix}LetterSpacing${bp.key}`, title: `Letter Spacing - ${bp.title}`, type: 'string', description: 'e.g., "-0.05em", "2px"', fieldset })); 
    });
    return fields;
};

const linkAnnotation = {
  name: 'link', title: 'External URL', type: 'object',
  fields: [
    defineField({
      title: 'URL', 
      name: 'href', 
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel'],
        allowRelative: true
      })
    }),
    defineField({title: 'Link Label', name: 'linkText', type: 'string'}),
    defineField({title: 'Open in new tab', name: 'blank', type: 'boolean', initialValue: false}),
  ],
};
const internalLinkAnnotation = {
  name: 'internalLink', title: 'Internal Link (Go To)', type: 'object', icon: () => '🔗', 
  fields: [
    defineField({name: 'targetSection', title: 'Target Section ID', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'targetProject', title: 'Target Project Key (Optional)', type: 'string'}),
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
    marks: { decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}, {title: 'Underline', value: 'underline'}], annotations: [linkAnnotation, internalLinkAnnotation] },
  },
  {type: 'customSpacing'}
];

const createResponsiveFields = (prefix: string, titlePrefix: string, fieldset: string, type: 'ui' | 'logo') => {
  const fields: any[] = []; 
  breakpoints.forEach(bp => {
      const defaultScale = type === 'logo' ? 25 : 100;
      const defaultTop = type === 'logo' ? '2rem' : undefined;
      fields.push(defineField({ name: `${prefix}Scale${bp.key}`, title: `${titlePrefix} Scale - ${bp.title}`, type: 'number', initialValue: defaultScale, fieldset }));
      fields.push(defineField({ name: `${prefix}Top${bp.key}`, title: `${titlePrefix} Top Offset - ${bp.title}`, type: 'string', initialValue: defaultTop, fieldset }));
      if (type === 'ui') fields.push(defineField({ name: `${prefix}Right${bp.key}`, title: `${titlePrefix} Right Offset - ${bp.title}`, type: 'string', fieldset }));
  });
  return fields;
};

const createMasterButtonFields = (fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `masterBtnScale${bp.key}`, title: `Master Button Scale - ${bp.title}`, type: 'number', initialValue: 100, fieldset }));
        fields.push(defineField({ name: `masterBtnDistance${bp.key}`, title: `Master Corner Distance - ${bp.title}`, type: 'string', description: 'e.g., "-1rem" pulls ALL buttons into the corners. "1rem" pushes them towards the center.', initialValue: '0px', fieldset }));
        fields.push(defineField({ name: `masterBtnGap${bp.key}`, title: `Master Media Controls Gap - ${bp.title}`, type: 'string', description: 'Horizontal spacing interval offset between Play and Sound buttons (e.g., "4rem", "50px").', initialValue: '4rem', fieldset }));
    });
    return fields;
};

const createCarouselArrowFields = (fieldset: string) => {
    const fields: any[] = [
        defineField({
            name: 'carouselArrowImage',
            title: 'Carousel Arrow SVG',
            type: 'image',
            fieldset,
            description: 'One arrow for every carousel that turns click arrows on. The right one is rotated 180 degrees. Empty uses a simple chevron. An upload on the carousel replaces this.',
            options: {accept: 'image/svg+xml'},
        }),
        defineField({
            name: 'carouselArrowMode',
            title: 'Carousel Arrow Effect',
            type: 'string',
            fieldset,
            options: {list: modeOptions},
            initialValue: 'original',
            description: 'Same filters as the other buttons. An effect on the carousel replaces this.',
        }),
        defineField({
            name: 'carouselArrowColor',
            title: 'Carousel Arrow Color',
            type: 'string',
            fieldset,
            description: 'Hex, for example #ffffff. On Original this tints the arrow. On Custom Color it is the solid color. A color on the carousel replaces this.',
            hidden: ({parent}) => {
                const mode = parent?.carouselArrowMode || 'original'
                return mode !== 'custom' && mode !== 'original'
            },
        }),
        defineField({
            name: 'carouselArrowBlend',
            title: 'Carousel Arrow Blend',
            type: 'string',
            fieldset,
            options: {list: blendModeOptions},
            initialValue: 'normal',
            description: 'Photoshop mix with the picture behind the arrow. Used when the effect is Original. A blend on the carousel replaces this.',
        }),
    ]
    breakpoints.forEach((bp) => {
        fields.push(defineField({
            name: `carouselArrowSize${bp.key}`,
            title: `Carousel Arrow Size - ${bp.title}`,
            type: 'string',
            fieldset,
            description: 'Examples: 28, 32px, 4vh. A bare number is pixels. Empty on a screen uses Desktop. A size on the carousel replaces this.',
        }))
        fields.push(defineField({
            name: `carouselArrowOffsetLeft${bp.key}`,
            title: `Carousel Arrow Left Offset - ${bp.title}`,
            type: 'string',
            fieldset,
            description: 'Distance from the left border. Empty on a screen uses Desktop, then 24px. A left offset on the carousel replaces this.',
        }))
        fields.push(defineField({
            name: `carouselArrowOffsetRight${bp.key}`,
            title: `Carousel Arrow Right Offset - ${bp.title}`,
            type: 'string',
            fieldset,
            description: 'Distance from the right border. Empty on a screen uses Desktop, then 24px. A right offset on the carousel replaces this.',
        }))
        fields.push(defineField({
            name: `carouselArrowOffsetY${bp.key}`,
            title: `Carousel Arrow Vertical Offset - ${bp.title}`,
            type: 'string',
            fieldset,
            description: 'Moves both arrows off mid height. Positive moves down. Empty on a screen uses Desktop, then centered. A vertical offset on the carousel replaces this.',
        }))
    })
    return fields
}

const createUnifiedButtonFields = (prefix: string, titlePrefix: string, fieldset: string, hasGap: boolean = false) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `${prefix}Scale${bp.key}`, title: `${titlePrefix} Scale (Override) - ${bp.title}`, type: 'number', description: 'Leave empty to use Master Scale.', fieldset }));
        fields.push(defineField({ 
            name: `${prefix}Offset${bp.key}`, 
            title: `${titlePrefix} Offset (Override) - ${bp.title}`, 
            type: 'string', 
            description: 'Leave empty to use Master Corner Distance. Enter one value to move diagonally, or two values (e.g. "2rem, 1rem") for specific X,Y.', 
            fieldset 
        }));
        if (hasGap) {
            fields.push(defineField({ name: `${prefix}Gap${bp.key}`, title: `${titlePrefix} Gap - ${bp.title}`, type: 'string', initialValue: '4rem', fieldset }));
        }
    });
    return fields;
};

const createExpandedResponsiveFields = (prefix: string, titlePrefix: string, fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        if (prefix === 'filter' || prefix === 'social') fields.push(defineField({ name: `${prefix}Scale${bp.key}`, title: `${titlePrefix} Scale - ${bp.title}`, type: 'number', initialValue: 100, fieldset }));
        
        let topTitle = `${titlePrefix} Top Offset (Move Down) - ${bp.title}`;
        let topDesc: string | undefined = undefined;
        
        if (prefix === 'filter') {
            topTitle = `Gap: Logo to Filters (Margin Top) - ${bp.title}`;
            topDesc = 'Use negative values (e.g. "-2rem", "-30px") to pull the filters UP if the logo has invisible padding.';
        }
        if (prefix === 'grid') {
            topTitle = `Gap: Filters to Grid (Margin Top) - ${bp.title}`;
            topDesc = 'Use negative values (e.g. "-1rem", "-20px") to pull the grid closer to the filters.';
        }
        
        fields.push(defineField({ name: `${prefix}Top${bp.key}`, title: topTitle, type: 'string', description: topDesc, fieldset }));
        
        if (prefix === 'grid' || prefix === 'social' || prefix === 'filter') fields.push(defineField({ name: `${prefix}Gap${bp.key}`, title: `${titlePrefix} Internal Gap - ${bp.title}`, type: 'string', description: 'e.g. "0.8rem" (all sides) or "1rem 0.5rem" (vertical horizontal).', initialValue: prefix === 'filter' ? '0.8rem' : '1.5rem', fieldset }));
        if (prefix === 'filter') fields.push(defineField({ name: `${prefix}Width${bp.key}`, title: `${titlePrefix} Container Max-Width - ${bp.title}`, type: 'string', description: 'e.g., 90%, 800px, 100%', initialValue: bp.key.includes('Mobile') ? '100%' : '90%', fieldset }));
    });
    return fields;
};

const createCaptionFields = (fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `captionSize${bp.key}`, title: `Font Size - ${bp.title}`, type: 'string', initialValue: '1.05rem', fieldset }));
        fields.push(defineField({ name: `captionLetterSpacing${bp.key}`, title: `Letter Spacing - ${bp.title}`, type: 'string', description: 'e.g. "0.05em"', fieldset }));
        fields.push(defineField({ name: `captionTop${bp.key}`, title: `Top Offset - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
        fields.push(defineField({ name: `captionBottom${bp.key}`, title: `Bottom Offset - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
        fields.push(defineField({ name: `captionOverlayBottom${bp.key}`, title: `Overlay Bottom Offset - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
    });
    return fields;
};

const createGlobalContainerFields = (prefix: string, fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `${prefix}Width${bp.key}`, title: `Width - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `${prefix}Height${bp.key}`, title: `Max Height - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `${prefix}Offset${bp.key}`, title: `Vertical Offset - ${bp.title}`, type: 'string', fieldset }));
    });
    return fields;
};

// -------------------------------------------------------------------------
// NEW: PERFECTLY SEPARATED TEXT AND LOGO CONTROLS
// -------------------------------------------------------------------------
const createCompanyTextPosFields = (fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        // 1. Text Controls (Restored!)
        fields.push(defineField({ name: `companyTextWidth${bp.key}`, title: `Text Width - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `companyTextTop${bp.key}`, title: `Text Top Offset - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `companyTextLeft${bp.key}`, title: `Text Left Offset - ${bp.title}`, type: 'string', fieldset }));
        
        // 2. Logo Controls (New!)
        fields.push(defineField({ 
            name: `companyLogoAlign${bp.key}`, 
            title: `Logo Alignment - ${bp.title}`, 
            type: 'string', 
            options: { list: [{title: 'Left', value: 'flex-start'}, {title: 'Center', value: 'center'}, {title: 'Right', value: 'flex-end'}] }, 
            initialValue: 'flex-start', 
            fieldset 
        }));
        fields.push(defineField({ 
            name: `companyLogoOffsetX${bp.key}`, 
            title: `Logo Horizontal Offset (X) - ${bp.title}`, 
            type: 'string', 
            description: 'e.g. 5vw, -20px. Nudges the logo left/right from its aligned position.', 
            fieldset 
        }));
        fields.push(defineField({
            name: `companyLogoScale${bp.key}`,
            title: `Logo Scale (vw Width value) - ${bp.title}`,
            type: 'number',
            description: 'Independent layout size percentage inside panel (Default 25 for 25vw width).',
            initialValue: 25,
            validation: Rule => Rule.min(0).max(100),
            fieldset
        }));
        fields.push(defineField({
            name: `companyLogoTop${bp.key}`,
            title: `Logo Top Offset - ${bp.title}`,
            type: 'string',
            description: 'Vertical spacing distance from screen top frame boundary (Default: 2rem).',
            initialValue: '2rem',
            fieldset
        }));
    });
    return fields;
};
// -------------------------------------------------------------------------

const showCookieBtnGranular = ({parent}: any) => {
    const dMode = parent?.btnModeDesktop;
    const mMode = parent?.btnModeMobile;
    return ['custom', 'liquid'].includes(dMode) || ['custom', 'liquid'].includes(mMode);
};

const cookieConsentFields = () => {
    const sizeFields: any[] = [];
    const btnSizeFields: any[] = [];
    breakpoints.forEach((bp) => {
        sizeFields.push(defineField({
            name: `width${bp.key}`,
            title: `Width - ${bp.title}`,
            type: 'string',
            description: 'e.g. 28rem, 80vw, 420px',
            hidden: ({parent}) => !parent?.enableSizeFineTune,
        }));
        sizeFields.push(defineField({
            name: `maxHeight${bp.key}`,
            title: `Max Height - ${bp.title}`,
            type: 'string',
            hidden: ({parent}) => !parent?.enableSizeFineTune,
        }));
        btnSizeFields.push(defineField({
            name: `btnScale${bp.key}`,
            title: `Button Scale - ${bp.title}`,
            type: 'number',
            initialValue: 100,
            hidden: ({parent}) => !parent?.enableBtnFineTune,
        }));
        btnSizeFields.push(defineField({
            name: `btnGap${bp.key}`,
            title: `Button Gap - ${bp.title}`,
            type: 'string',
            initialValue: '0.8rem',
            hidden: ({parent}) => !parent?.enableBtnFineTune,
        }));
    });

    return [
        defineField({name: 'isActive', title: 'Enable Cookie Popup', type: 'boolean', initialValue: true}),
        defineField({
            name: 'delay',
            title: 'Entry Delay (ms)',
            type: 'number',
            initialValue: 2000,
            description: 'Milliseconds before the popup appears.',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'entryStyle',
            title: 'Entry Style',
            type: 'string',
            options: {
                list: [
                    {title: 'Fade In', value: 'fade'},
                    {title: 'Hard Popup', value: 'hard'},
                    {title: 'Scale In', value: 'scale'},
                ],
                layout: 'radio',
            },
            initialValue: 'fade',
        }),
        defineField({
            name: 'text',
            title: 'Consent Text',
            type: 'array',
            of: customBlockEditor,
        }),
        defineField({
            name: 'surfacePadding',
            title: 'Surface Padding',
            type: 'number',
            initialValue: 40,
            description: 'Padding inside the popup container in pixels.',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'Used when no background media is set.',
      }),
      defineField({
          name: 'backgroundOpacity',
          title: 'Background Opacity',
          type: 'number',
          description: '0.0 to 1.0 (e.g. 0.85). Controls transparency of the background color.',
          validation: Rule => Rule.min(0).max(1),
          initialValue: 1,
      }),
      defineField({
        name: 'textColor',
        title: 'Text Color',
        type: 'string',
        description: 'Fallback text color (defaults to black, or white if an effect is active).',
    }),
    defineField({
        name: 'popupWidth',
        title: 'Popup Width',
        type: 'string',
        description: 'e.g., 600px, 40vw, 80%. Controls the overall width of the popup box. Leave blank for default.',
    }),
    defineField({name: 'textModeDesktop', title: 'Text Effect Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original'}),
    defineField({name: 'textColorDesktop', title: 'Text Effect Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.textModeDesktop)}),
    defineField({name: 'textModeMobile', title: 'Text Effect Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original'}),
    defineField({name: 'textColorMobile', title: 'Text Effect Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.textModeMobile)}),
    defineField({name: 'backgroundMedia', title: 'Background Media', type: 'mediaItem', options: {collapsible: true, collapsed: true}}),
            defineField({
            name: 'filterEffect',
            title: 'Filter Effect',
            type: 'string',
            options: {list: modeOptions},
            initialValue: 'original',
            description: 'Surface filter. Same list as logo / button modes.',
        }),
        defineField({
            name: 'enableSizeFineTune',
            title: 'Fine-tune Size (8 breakpoints)',
            type: 'boolean',
            initialValue: false,
            description: 'Off = CSS defaults. On = width and max-height per device.',
        }),
        ...sizeFields,
        defineField({
            name: 'cornerStyle',
            title: 'Corners',
            type: 'string',
            options: {
                list: [
                    {title: 'Sharp', value: 'sharp'},
                    {title: 'Round', value: 'round'},
                ],
                layout: 'radio',
            },
            initialValue: 'sharp',
        }),
        defineField({
            name: 'enableCornerFineTune',
            title: 'Fine-tune Corner Radius',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'cornerRadius',
            title: 'Corner Radius',
            type: 'string',
            description: 'e.g. 12px, 1rem. Used when Round is selected or fine-tune is on.',
            hidden: ({parent}) => parent?.cornerStyle !== 'round' && !parent?.enableCornerFineTune,
        }),
        defineField({
            name: 'enableShadow',
            title: 'Drop Shadow',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
          name: 'shadowIntensity',
          title: 'Shadow Intensity',
          type: 'number',
          initialValue: 40,
          description: '0–100. Maps to shadow opacity.',
          hidden: ({parent}) => !parent?.enableShadow,
          validation: (Rule) => Rule.min(0).max(100),
      }),
      defineField({
          name: 'shadowColor',
          title: 'Shadow Color',
          type: 'string',
          description: 'e.g., #000000. Required if Drop Shadow is enabled.',
          hidden: ({parent}) => !parent?.enableShadow,
      }),
      defineField({
          name: 'shadowDistance',
          title: 'Shadow Distance',
            type: 'string',
            initialValue: '16px',
            description: 'Offset from the popup, e.g. 12px, 1.5rem.',
            hidden: ({parent}) => !parent?.enableShadow,
        }),
        defineField({
            name: 'btnModeDesktop',
            title: 'Button Mode (Desktop)',
            type: 'string',
            options: {list: modeOptions},
            initialValue: 'black',
        }),
        defineField({
            name: 'btnColorDesktop',
            title: 'Button Color (Desktop)',
            type: 'string',
            hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.btnModeDesktop),
        }),
        defineField({
            name: 'btnModeMobile',
            title: 'Button Mode (Mobile)',
            type: 'string',
            options: {list: modeOptions},
            initialValue: 'black',
        }),
        defineField({
            name: 'btnColorMobile',
            title: 'Button Color (Mobile)',
            type: 'string',
            hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.btnModeMobile),
        }),
        defineField({
            name: 'enableBtnFineTune',
            title: 'Fine-tune Button Scale & Gap (8 breakpoints)',
            type: 'boolean',
            initialValue: false,
        }),
        ...btnSizeFields,
        defineField({name: 'btnDesktopNormalText', title: 'Desktop Normal Text', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopNormalBorder', title: 'Desktop Normal Border', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopNormalBg', title: 'Desktop Normal BG (Mix Color)', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopNormalOpacity', title: 'Desktop Normal BG Opacity', type: 'number', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopActiveText', title: 'Desktop Active Text', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopActiveTextOpacity', title: 'Desktop Active Text Opacity', type: 'number', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopActiveKnockout', title: 'Desktop Active Knockout (Transparent Text)', type: 'boolean', initialValue: false, hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopActiveBorder', title: 'Desktop Active Border', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopActiveBg', title: 'Desktop Active BG', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnDesktopActiveOpacity', title: 'Desktop Active BG Opacity', type: 'number', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileNormalText', title: 'Mobile Normal Text', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileNormalBorder', title: 'Mobile Normal Border', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileNormalBg', title: 'Mobile Normal BG (Mix Color)', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileNormalOpacity', title: 'Mobile Normal BG Opacity', type: 'number', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileActiveText', title: 'Mobile Active Text', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileActiveTextOpacity', title: 'Mobile Active Text Opacity', type: 'number', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileActiveKnockout', title: 'Mobile Active Knockout (Transparent Text)', type: 'boolean', initialValue: false, hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileActiveBorder', title: 'Mobile Active Border', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileActiveBg', title: 'Mobile Active BG', type: 'string', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
        defineField({name: 'btnMobileActiveOpacity', title: 'Mobile Active BG Opacity', type: 'number', hidden: ({parent}) => !showCookieBtnGranular({parent})}),
    ];
};

export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fieldsets: [
    {name: 'navConfig', title: 'Project Navigation & Loading', options: {collapsible: true, collapsed: true}},
    {name: 'identityConfig', title: 'Studio Identity (SEO / AIO)', options: {collapsible: true, collapsed: true}},
    {name: 'oremConfig', title: 'Company Logo Settings', options: {collapsible: true, collapsed: true}},
    {name: 'globalButtonConfig', title: 'Global Button Settings', options: {collapsible: true, collapsed: true}},
    {name: 'companyConfig', title: 'Company Text (+)', options: {collapsible: true, collapsed: true}},
    {name: 'fontConfig', title: 'Global Font Providers (Deprecated - Use Font Resource)', options: {collapsible: true, collapsed: true}}, 
    {name: 'audioConfig', title: 'Audio Settings (Global)', options: {collapsible: true, collapsed: true}},
    {name: 'paddingConfig', title: 'Padding Settings (Mobile/Tablet)', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH1', title: 'Global Typography: H1', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH2', title: 'Global Typography: H2', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH3', title: 'Global Typography: H3', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH4', title: 'Global Typography: H4', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH5', title: 'Global Typography: H5', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalNormal', title: 'Global Typography: Normal Text', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalQuote', title: 'Global Typography: Quote', description: 'Font, size, line height and letter spacing per screen size. Empty inherits.', options: {collapsible: true, collapsed: true}},
    {name: 'captionConfig', title: 'Global Caption Settings', description: 'Size, letter spacing and offsets per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},

    {name: 'containerConfigT', title: 'T: Typography, fullscreen 1', description: 'Width, max height and vertical offset per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},
    {name: 'containerConfigTNew', title: 'T: Typography, fullscreen 2', description: 'Width, max height and vertical offset per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},
    {name: 'containerConfigLong', title: 'T: Typography, fullscreen scroll', description: 'Width, max height and vertical offset per screen size. Empty keeps the default.', options: {collapsible: true, collapsed: true}},

    {name: 'thumbnailConfig', title: 'Project Thumbnails (Hover & Text Effects)', options: {collapsible: true, collapsed: true}},
    {name: 'thumbnailOverviewConfig', title: 'Thumbnail Overview', options: {collapsible: true, collapsed: true}},

    {name: 'socialConfig', title: 'Social Icons', options: {collapsible: true, collapsed: true}},
    {name: 'infoConfig', title: 'Info Columns (Positioning)', options: {collapsible: true, collapsed: true}},
        
    {name: 'filterConfig', title: 'Filter Buttons (Global)', options: {collapsible: true, collapsed: true}}, 
    {name: 'filterPosConfig', title: 'Layout & Positioning (Global, Advanced)', options: {collapsible: true, collapsed: true}}, 
    {name: 'cookieConfig', title: 'Cookie Consent', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({name: 'title', title: 'Site Title', type: 'string', initialValue: 'Global Settings'}),
    defineField({name: 'selectedProjects', title: 'Project Selection & Order', type: 'array', of: [{type: 'reference', to: [{type: 'project'}]}], fieldset: 'navConfig'}),
    defineField({name: 'randomizeProjects', title: 'Randomize Project Order', type: 'boolean', initialValue: false, fieldset: 'navConfig'}),
    defineField({
      name: 'legalName',
      title: 'Legal / Studio Name',
      type: 'string',
      description: 'Organization name in Schema.org JSON-LD. Leave blank to use VITE_SITE_TITLE from the env switcher.',
      fieldset: 'identityConfig',
    }),
    defineField({
      name: 'founderName',
      title: 'Founder',
      type: 'string',
      fieldset: 'identityConfig',
    }),
    defineField({
      name: 'primaryDomain',
      title: 'Primary Domain',
      type: 'url',
      description: 'Canonical origin with protocol. Leave blank to use VITE_SITE_URL from the env switcher.',
      fieldset: 'identityConfig',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'sameAs',
      title: 'SameAs URLs',
      type: 'array',
      of: [{type: 'url'}],
      description: 'Official profiles (Instagram, LinkedIn, Vimeo, etc.) for Knowledge Graph / AIO.',
      fieldset: 'identityConfig',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO (Homepage)',
      type: 'seoObject',
      fieldset: 'identityConfig',
    }),

    defineField({name: 'overviewLogo', title: 'Overview Logo', type: 'image', fieldset: 'oremConfig'}),
    defineField({name: 'oremModeDesktop', title: 'Mode (Global)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'oremConfig'}),
    defineField({name: 'oremColorDesktop', title: 'Color (Global)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.oremModeDesktop), fieldset: 'oremConfig'}),
    defineField({name: 'oremModeMobile', title: 'Mode (Mobile)', type: 'string', options: { list: modeOptions }, hidden: true, fieldset: 'oremConfig'}),
    defineField({name: 'oremColorMobile', title: 'Color (Mobile)', type: 'string', hidden: true, fieldset: 'oremConfig'}),
    ...createResponsiveFields('orem', 'Logo', 'oremConfig', 'logo'),

    ...createMasterButtonFields('globalButtonConfig'),
    defineField({name: 'companyInfoIcon', title: 'Company Info Icon (+ Button)', type: 'image', fieldset: 'globalButtonConfig'}),
    ...createUnifiedButtonFields('company', 'Company Toggle Icon (+)', 'globalButtonConfig'),
    defineField({name: 'uiModeDesktop', title: 'UI Icons Mode (Global)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'globalButtonConfig'}),
    defineField({name: 'uiColorDesktop', title: 'UI Color (Global)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.uiModeDesktop), fieldset: 'globalButtonConfig'}),
    defineField({name: 'uiModeMobile', title: 'UI Icons Mode (Mobile)', type: 'string', options: { list: modeOptions }, hidden: true, fieldset: 'globalButtonConfig'}),
    defineField({name: 'uiColorMobile', title: 'UI Color (Mobile)', type: 'string', hidden: true, fieldset: 'globalButtonConfig'}),
    ...createUnifiedButtonFields('ui', 'Overview/Close Icons', 'globalButtonConfig'),
    ...createUnifiedButtonFields('mediaBtn', 'Media Controls (Play & Sound)', 'globalButtonConfig', true),
    ...createCarouselArrowFields('globalButtonConfig'),

    defineField({ name: 'companyInfoText', title: 'Company Info Text', type: 'array', of: customBlockEditor, fieldset: 'companyConfig' }),
    defineField({name: 'companyOverlayColor', title: 'Overlay Background Color', type: 'string', fieldset: 'companyConfig'}),
    defineField({name: 'companyOverlayOpacity', title: 'Overlay Background Opacity', type: 'number', initialValue: 1, fieldset: 'companyConfig'}),
    defineField({name: 'companyOverlayMedia', title: 'Overlay Background Media', type: 'mediaItem', options: {collapsible: true, collapsed: true}, fieldset: 'companyConfig'}),
    defineField({name: 'companyTextColor', title: 'Company Text Base Color', type: 'string', initialValue: '#000000', fieldset: 'companyConfig'}),
    defineField({name: 'companyTextOpacity', title: 'Company Text Opacity', type: 'number', initialValue: 1, fieldset: 'companyConfig'}),
    defineField({name: 'companyTextModeDesktop', title: 'Company Text Effect Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'companyConfig'}),
    defineField({name: 'companyTextColorDesktop', title: 'Company Text Effect Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.companyTextModeDesktop), fieldset: 'companyConfig'}),
    defineField({name: 'companyTextModeMobile', title: 'Company Text Effect Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'companyConfig'}),
    defineField({name: 'companyTextColorMobile', title: 'Company Text Effect Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.companyTextModeMobile), fieldset: 'companyConfig'}),
    defineField({name: 'companyLogoModeDesktop', title: 'Company Logo Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'companyConfig'}),
    defineField({name: 'companyLogoColorDesktop', title: 'Company Logo Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.companyLogoModeDesktop), fieldset: 'companyConfig'}),
    ...createCompanyTextPosFields('companyConfig'),

    defineField({ name: 'googleFontsUrl', title: 'Google Fonts Embed URL (DEPRECATED)', type: 'string', fieldset: 'fontConfig', hidden: true }),
    defineField({ name: 'adobeTypekitId', title: 'Adobe Typekit Project ID (DEPRECATED)', type: 'string', fieldset: 'fontConfig', hidden: true }),
    defineField({
      name: 'globalAudioSource',
      title: 'Global Audio Source',
      type: 'string',
      options: { list: [{ title: 'Sanity (Upload directly)', value: 'sanity' }, { title: 'External URL (StC Server / Direct Link)', value: 'external' }], layout: 'radio' },
      initialValue: 'sanity',
      fieldset: 'audioConfig'
    }),
    defineField({name: 'globalAudio', title: 'Global Background Audio (Sanity)', type: 'file', options: { accept: 'audio/*' }, fieldset: 'audioConfig', hidden: ({parent}) => parent?.globalAudioSource === 'external'}),
    defineField({name: 'globalAudioUrl', title: 'External Global Audio URL', type: 'url', description: 'Paste the direct link to the .mp3 or .wav file.', fieldset: 'audioConfig', hidden: ({parent}) => !parent?.globalAudioSource || parent?.globalAudioSource === 'sanity'}),
    defineField({name: 'globalAudioVolume', title: 'Global Audio Volume', type: 'number', initialValue: 0.5, fieldset: 'audioConfig'}),
    defineField({name: 'paddingMobilePortrait', title: 'Mobile Portrait Padding', type: 'string', initialValue: '4vw', fieldset: 'paddingConfig'}),
    defineField({name: 'paddingMobileLandscape', title: 'Mobile Landscape Padding', type: 'string', initialValue: '4vw', fieldset: 'paddingConfig'}),
    defineField({name: 'paddingTabletPortrait', title: 'Tablet Portrait Padding', type: 'string', initialValue: '4vw', fieldset: 'paddingConfig'}),

    ...createGlobalTypographyFields('globalH1', 'typeGlobalH1'),
    ...createGlobalTypographyFields('globalH2', 'typeGlobalH2'),
    ...createGlobalTypographyFields('globalH3', 'typeGlobalH3'),
    ...createGlobalTypographyFields('globalH4', 'typeGlobalH4'),
    ...createGlobalTypographyFields('globalH5', 'typeGlobalH5'),
    ...createGlobalTypographyFields('globalNormal', 'typeGlobalNormal'),
    ...createGlobalTypographyFields('globalQuote', 'typeGlobalQuote'),
    ...createCaptionFields('captionConfig'),

    ...createGlobalContainerFields('tContainer', 'containerConfigT'),
    ...createGlobalContainerFields('tNewContainer', 'containerConfigTNew'),
    ...createGlobalContainerFields('longContainer', 'containerConfigLong'),

    defineField({name: 'socialModeDesktop', title: 'Social Icons Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'socialConfig'}),
    defineField({name: 'socialColorDesktop', title: 'Social Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.socialModeDesktop), fieldset: 'socialConfig'}),
    defineField({name: 'socialModeMobile', title: 'Social Icons Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'socialConfig'}),
    defineField({name: 'socialColorMobile', title: 'Social Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.socialModeMobile), fieldset: 'socialConfig'}),
    ...createExpandedResponsiveFields('social', 'Social Icons', 'socialConfig'),
    ...createExpandedResponsiveFields('info', 'Info Columns', 'infoConfig'),

    defineField({name: 'filterModeDesktop', title: 'Filter Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'filterConfig'}),
    defineField({name: 'filterColorDesktop', title: 'Filter Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.filterModeDesktop), fieldset: 'filterConfig'}),
    defineField({name: 'filterModeMobile', title: 'Filter Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'filterConfig'}),
    defineField({name: 'filterColorMobile', title: 'Filter Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.filterModeMobile), fieldset: 'filterConfig'}),
    ...createExpandedResponsiveFields('filter', 'Filter Buttons', 'filterConfig'),

    defineField({ name: 'filterDesktopNormalText', title: 'Desktop Normal Text', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopNormalBorder', title: 'Desktop Normal Border', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopNormalBg', title: 'Desktop Normal BG (Mix Color)', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopNormalOpacity', title: 'Desktop Normal BG Opacity', type: 'number', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopActiveText', title: 'Desktop Active Text', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopActiveTextOpacity', title: 'Desktop Active Text Opacity', type: 'number', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopActiveKnockout', title: 'Desktop Active Knockout (Transparent Text)', type: 'boolean', initialValue: false, fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopActiveBorder', title: 'Desktop Active Border', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopActiveBg', title: 'Desktop Active BG', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterDesktopActiveOpacity', title: 'Desktop Active BG Opacity', type: 'number', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileNormalText', title: 'Mobile Normal Text', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileNormalBorder', title: 'Mobile Normal Border', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileNormalBg', title: 'Mobile Normal BG (Mix Color)', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileNormalOpacity', title: 'Mobile Normal BG Opacity', type: 'number', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileActiveText', title: 'Mobile Active Text', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileActiveTextOpacity', title: 'Mobile Active Text Opacity', type: 'number', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileActiveKnockout', title: 'Mobile Active Knockout (Transparent Text)', type: 'boolean', initialValue: false, fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileActiveBorder', title: 'Mobile Active Border', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileActiveBg', title: 'Mobile Active BG', type: 'string', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    defineField({ name: 'filterMobileActiveOpacity', title: 'Mobile Active BG Opacity', type: 'number', fieldset: 'filterConfig', hidden: ({parent}) => !showGranular({parent}) }),
    
    ...createExpandedResponsiveFields('grid', 'Thumbnail Grid', 'filterPosConfig'),
    defineField({name: 'templateGapMobileLandscape', title: 'Template Media Gap (F, G, M) - Mobile Landscape', type: 'string', initialValue: '1.5rem', fieldset: 'filterPosConfig'}),

    defineField({
      name: 'cookieConsent',
      title: 'Cookie Consent Popup',
      type: 'object',
      fieldset: 'cookieConfig',
      options: {collapsible: true, collapsed: true},
      fields: cookieConsentFields(),
    }),

    defineField({name: 'overviewBackgroundColor', title: 'Overview Background Color', type: 'string', initialValue: '#f5f0e1', fieldset: 'thumbnailOverviewConfig'}),
    defineField({name: 'overviewBackgroundMedia', title: 'Overview Background Media', type: 'mediaItem', options: {collapsible: true, collapsed: true}, fieldset: 'thumbnailOverviewConfig'}),
  ],
})