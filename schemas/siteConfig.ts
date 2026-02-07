// stc-website-sanity/schemas/siteConfig.ts ID 208.1
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

// --- BREAKPOINT DEFINITIONS ---
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
    
    fields.push(defineField({ 
        name: `${prefix}Font`, 
        title: 'Font Family', 
        type: 'reference', 
        to: [{type: 'fontResource'}], 
        description: 'Select a font from the Font Resources.',
        fieldset 
    }));
    
    fields.push(defineField({ name: `${prefix}Color`, title: 'Color (Default)', type: 'string', fieldset }));

    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `${prefix}Size${bp.key}`, title: `Size - ${bp.title}`, type: 'string', fieldset }));
        fields.push(defineField({ name: `${prefix}LineHeight${bp.key}`, title: `Line Height - ${bp.title}`, type: 'string', fieldset }));
    });

    return fields;
};

const linkAnnotation = {
  name: 'link', title: 'External URL', type: 'object',
  fields: [
    defineField({title: 'URL', name: 'href', type: 'url'}),
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

const createResponsiveFields = (prefix: string, titlePrefix: string, fieldset: string, type: 'ui' | 'logo') => {
  const fields: any[] = []; 
  
  breakpoints.forEach(bp => {
      // Default adjustments for Logo: Scale 25 (approx 6.4rem height relative), Top 2rem
      const defaultScale = type === 'logo' ? 25 : 100;
      const defaultTop = type === 'logo' ? '2rem' : undefined;

      fields.push(defineField({ name: `${prefix}Scale${bp.key}`, title: `${titlePrefix} Scale - ${bp.title}`, type: 'number', initialValue: defaultScale, fieldset }));
      fields.push(defineField({ name: `${prefix}Top${bp.key}`, title: `${titlePrefix} Top Offset - ${bp.title}`, type: 'string', initialValue: defaultTop, fieldset }));
      if (type === 'ui') fields.push(defineField({ name: `${prefix}Right${bp.key}`, title: `${titlePrefix} Right Offset - ${bp.title}`, type: 'string', fieldset }));
  });
  return fields;
};

const createResponsiveLeftFields = (prefix: string, titlePrefix: string, fieldset: string) => {
  const fields: any[] = []; 
  breakpoints.forEach(bp => {
      fields.push(defineField({ name: `${prefix}Scale${bp.key}`, title: `${titlePrefix} Scale - ${bp.title}`, type: 'number', initialValue: 100, fieldset }));
      fields.push(defineField({ name: `${prefix}Top${bp.key}`, title: `${titlePrefix} Top Offset - ${bp.title}`, type: 'string', fieldset }));
      fields.push(defineField({ name: `${prefix}Left${bp.key}`, title: `${titlePrefix} Left Offset - ${bp.title}`, type: 'string', fieldset }));
  });
  return fields;
};

const createExpandedResponsiveFields = (prefix: string, titlePrefix: string, fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        if (prefix === 'filter' || prefix === 'social') fields.push(defineField({ name: `${prefix}Scale${bp.key}`, title: `${titlePrefix} Scale - ${bp.title}`, type: 'number', initialValue: 100, fieldset }));
        fields.push(defineField({ name: `${prefix}Top${bp.key}`, title: `${titlePrefix} Top Offset - ${bp.title}`, type: 'string', fieldset }));
        if (prefix === 'grid' || prefix === 'social') fields.push(defineField({ name: `${prefix}Gap${bp.key}`, title: `${titlePrefix} Gap - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
    });
    return fields;
};

const createCaptionFields = (fieldset: string) => {
    const fields: any[] = [];
    breakpoints.forEach(bp => {
        fields.push(defineField({ name: `captionSize${bp.key}`, title: `Font Size - ${bp.title}`, type: 'string', initialValue: '1.05rem', fieldset }));
        fields.push(defineField({ name: `captionTop${bp.key}`, title: `Top Offset - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
        fields.push(defineField({ name: `captionBottom${bp.key}`, title: `Bottom Offset - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
        fields.push(defineField({ name: `captionOverlayBottom${bp.key}`, title: `Overlay Bottom Offset - ${bp.title}`, type: 'string', initialValue: '1.5rem', fieldset }));
    });
    return fields;
};

export default defineType({
  name: 'siteConfig',
  title: 'Site Configuration',
  type: 'document',
  fieldsets: [
    {name: 'navConfig', title: 'PROJECT NAVIGATION & LOADING', options: {collapsible: true, collapsed: false}},
    {name: 'fontConfig', title: 'GLOBAL FONT PROVIDERS (DEPRECATED - USE FONT RESOURCE)', options: {collapsible: true, collapsed: true}}, 
    {name: 'audioConfig', title: 'GLOBAL AUDIO SETTINGS', options: {collapsible: true, collapsed: false}},
    {name: 'paddingConfig', title: 'GLOBAL PADDING SETTINGS (MOBILE/TABLET)', options: {collapsible: true, collapsed: true}},
    {name: 'captionConfig', title: 'GLOBAL CAPTION SETTINGS', options: {collapsible: true, collapsed: true}},
    
    {name: 'typeGlobalH1', title: 'GLOBAL TYPOGRAPHY: H1', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH2', title: 'GLOBAL TYPOGRAPHY: H2', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH3', title: 'GLOBAL TYPOGRAPHY: H3', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH4', title: 'GLOBAL TYPOGRAPHY: H4', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalH5', title: 'GLOBAL TYPOGRAPHY: H5', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalNormal', title: 'GLOBAL TYPOGRAPHY: NORMAL TEXT', options: {collapsible: true, collapsed: true}},
    {name: 'typeGlobalQuote', title: 'GLOBAL TYPOGRAPHY: QUOTE', options: {collapsible: true, collapsed: true}},

    {name: 'oremConfig', title: 'MAIN LOGO (OREM) SETTINGS', options: {collapsible: true, collapsed: true}},
    {name: 'uiConfig', title: 'UI ICONS (WORKS, CLOSE, CURSOR)', options: {collapsible: true, collapsed: true}},
    {name: 'companyConfig', title: 'COMPANY INFO (TOP LEFT ICON & OVERLAY)', options: {collapsible: true, collapsed: true}},
    {name: 'socialConfig', title: 'TEMPLATE Z: SOCIAL ICONS', options: {collapsible: true, collapsed: true}},
    {name: 'infoConfig', title: 'TEMPLATE Z: INFO COLUMNS (TEXT)', options: {collapsible: true, collapsed: true}},
    {name: 'filterConfig', title: 'FILTER BUTTONS SETTINGS', options: {collapsible: true, collapsed: true}}, 
    {name: 'filterPosConfig', title: 'GLOBAL LAYOUT & POSITIONING (ADVANCED)', options: {collapsible: true, collapsed: true}}, 
  ],
  fields: [
    defineField({name: 'title', title: 'Site Title', type: 'string', initialValue: 'Global Settings'}),
    
    defineField({name: 'selectedProjects', title: 'Project Selection & Order', type: 'array', of: [{type: 'reference', to: [{type: 'project'}]}], fieldset: 'navConfig'}),
    defineField({name: 'randomizeProjects', title: 'Randomize Project Order', type: 'boolean', initialValue: false, fieldset: 'navConfig'}),

    defineField({
      name: 'googleFontsUrl', 
      title: 'Google Fonts Embed URL (DEPRECATED)', 
      type: 'string', 
      description: 'Please use Font Resources instead.',
      fieldset: 'fontConfig',
      hidden: true
    }),
    defineField({
      name: 'adobeTypekitId', 
      title: 'Adobe Typekit Project ID (DEPRECATED)', 
      type: 'string', 
      description: 'Please use Font Resources instead.',
      fieldset: 'fontConfig',
      hidden: true
    }),

    defineField({name: 'globalAudio', title: 'Global Background Audio', type: 'file', options: { accept: 'audio/*' }, fieldset: 'audioConfig'}),
    defineField({name: 'globalAudioVolume', title: 'Global Audio Volume', type: 'number', initialValue: 0.5, fieldset: 'audioConfig'}),

    defineField({name: 'paddingMobilePortrait', title: 'Mobile Portrait Padding', type: 'string', initialValue: '4vw', fieldset: 'paddingConfig'}),
    defineField({name: 'paddingMobileLandscape', title: 'Mobile Landscape Padding', type: 'string', initialValue: '4vw', fieldset: 'paddingConfig'}),
    defineField({name: 'paddingTabletPortrait', title: 'Tablet Portrait Padding', type: 'string', initialValue: '4vw', fieldset: 'paddingConfig'}),

    ...createCaptionFields('captionConfig'),

    ...createGlobalTypographyFields('globalH1', 'typeGlobalH1'),
    ...createGlobalTypographyFields('globalH2', 'typeGlobalH2'),
    ...createGlobalTypographyFields('globalH3', 'typeGlobalH3'),
    ...createGlobalTypographyFields('globalH4', 'typeGlobalH4'),
    ...createGlobalTypographyFields('globalH5', 'typeGlobalH5'),
    ...createGlobalTypographyFields('globalNormal', 'typeGlobalNormal'),
    ...createGlobalTypographyFields('globalQuote', 'typeGlobalQuote'),

    defineField({name: 'overviewLogo', title: 'Overview Logo', type: 'image', fieldset: 'oremConfig'}),
    defineField({name: 'oremModeDesktop', title: 'Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'oremConfig'}),
    defineField({name: 'oremColorDesktop', title: 'Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.oremModeDesktop), fieldset: 'oremConfig'}),
    defineField({name: 'oremModeMobile', title: 'Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'oremConfig'}),
    defineField({name: 'oremColorMobile', title: 'Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.oremModeMobile), fieldset: 'oremConfig'}),
    ...createResponsiveFields('orem', 'Logo', 'oremConfig', 'logo'),

    defineField({name: 'uiModeDesktop', title: 'UI Icons Mode (Desktop)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'uiConfig'}),
    defineField({name: 'uiColorDesktop', title: 'UI Color (Desktop)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.uiModeDesktop), fieldset: 'uiConfig'}),
    defineField({name: 'uiModeMobile', title: 'UI Icons Mode (Mobile)', type: 'string', options: { list: modeOptions }, initialValue: 'original', fieldset: 'uiConfig'}),
    defineField({name: 'uiColorMobile', title: 'UI Color (Mobile)', type: 'string', hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.uiModeMobile), fieldset: 'uiConfig'}),
    ...createResponsiveFields('ui', 'UI Icons', 'uiConfig', 'ui'),

    defineField({name: 'companyInfoIcon', title: 'Company Info Icon', type: 'image', fieldset: 'companyConfig'}),
    defineField({name: 'companyInfoText', title: 'Company Info Text', type: 'array', of: [{type: 'block', marks: {annotations: [linkAnnotation, internalLinkAnnotation]}}], fieldset: 'companyConfig'}),
    defineField({name: 'companyOverlayColor', title: 'Overlay Background Color', type: 'string', fieldset: 'companyConfig'}),
    defineField({name: 'companyOverlayOpacity', title: 'Overlay Background Opacity', type: 'number', initialValue: 1, fieldset: 'companyConfig'}),
    defineField({name: 'companyOverlayMedia', title: 'Overlay Background Media', type: 'mediaItem', fieldset: 'companyConfig'}),
    defineField({name: 'companyTextColor', title: 'Company Text Color', type: 'string', initialValue: '#000000', fieldset: 'companyConfig'}),
    defineField({name: 'companyTextOpacity', title: 'Company Text Opacity', type: 'number', initialValue: 1, fieldset: 'companyConfig'}),
    ...createResponsiveLeftFields('company', 'Company Icon', 'companyConfig'),

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
    
    ...createExpandedResponsiveFields('filter', 'Filter Container', 'filterPosConfig'),
    ...createExpandedResponsiveFields('grid', 'Thumbnail Grid', 'filterPosConfig'),
    defineField({name: 'templateGapMobileLandscape', title: 'Template Media Gap (F, G, M) - Mobile Landscape', type: 'string', initialValue: '1.5rem', fieldset: 'filterPosConfig'}),

    defineField({name: 'overviewBackgroundColor', title: 'Overview Background Color', type: 'string', initialValue: '#f5f0e1'}),
    defineField({name: 'overviewBackgroundMedia', title: 'Overview Background Media', type: 'mediaItem'}),
  ],
})