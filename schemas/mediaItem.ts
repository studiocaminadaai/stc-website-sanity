// stc-website-sanity/schemas/mediaItem.ts ID 210.1
import {defineField, defineType} from 'sanity'

const closed = {collapsible: true, collapsed: true} as const

const isCarouselItem = ({path}: {path?: unknown[]}) => {
  if (!Array.isArray(path)) return false
  const index = path.findIndex((segment) => segment === 'carouselSlides')
  return index !== -1 && index < path.length - 1
}

const carouselEnterOptions = [
  {title: 'Fade', value: 'fade'},
  {title: 'From left', value: 'from-left'},
  {title: 'From right', value: 'from-right'},
  {title: 'From top', value: 'from-top'},
  {title: 'From bottom', value: 'from-bottom'},
  {title: 'Swap (pop: old disappears, empty for Move duration, new pops up)', value: 'swap'},
]

const STILL_OFFSET_BREAKPOINTS = [
  {key: 'Desktop', title: 'Desktop (> 1600px)'},
  {key: 'Laptop', title: 'Laptop (1025px – 1600px)'},
  {key: 'TabletLandscape', title: 'Tablet Landscape (901px – 1024px)'},
  {key: 'TabletPortrait', title: 'Tablet Portrait (769px – 900px)'},
  {key: 'MobileLandscape', title: 'Mobile Landscape Big'},
  {key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small'},
  {key: 'MobilePortrait', title: 'Mobile Portrait Big'},
  {key: 'MobilePortraitSmall', title: 'Mobile Portrait Small'},
] as const

const stillOffsetFields = () => {
  const shared = [
    defineField({
      name: 'stillOffsetX',
      title: 'Left / Right offset',
      type: 'string',
      fieldset: 'stillZoom',
      description: 'Nudge this icon off the center of its cell. Positive moves right, negative moves left. Examples: 12px, -2vw. A bare number is pixels. Empty stays centered. A device setting below replaces this on that screen only.',
    }),
    defineField({
      name: 'stillOffsetY',
      title: 'Up / Down offset',
      type: 'string',
      fieldset: 'stillZoom',
      description: 'Positive moves down, negative moves up. Examples: -8px, 1vh. Empty stays centered. A device setting below replaces this on that screen only.',
    }),
  ]
  return [
    ...shared,
    ...STILL_OFFSET_BREAKPOINTS.flatMap((bp) => [
      defineField({
        name: `stillZoom${bp.key}`,
        title: `Size - ${bp.title}`,
        type: 'number',
        fieldset: 'stillZoom',
        description: 'Replaces the default zoom above on this screen only. 100 is the shared icon size. 200 is twice as big. Empty keeps the default zoom.',
        validation: (Rule) => Rule.min(1).max(400),
      }),
      defineField({
        name: `stillOffsetX${bp.key}`,
        title: `Left / Right - ${bp.title}`,
        type: 'string',
        fieldset: 'stillZoom',
        description: 'Replaces the left / right offset above on this screen only.',
      }),
      defineField({
        name: `stillOffsetY${bp.key}`,
        title: `Up / Down - ${bp.title}`,
        type: 'string',
        fieldset: 'stillZoom',
        description: 'Replaces the up / down offset above on this screen only.',
      }),
    ]),
  ]
}

const carouselExitOptions = [
  {title: 'Fade', value: 'fade'},
  {title: 'To left', value: 'to-left'},
  {title: 'To right', value: 'to-right'},
  {title: 'To top', value: 'to-top'},
  {title: 'To bottom', value: 'to-bottom'},
  {title: 'Swap (pop: old disappears, empty for Move duration, new pops up)', value: 'swap'},
]

const arrowModeOptions = [
  {title: 'Original Colors', value: 'original'},
  {title: 'White (Flat)', value: 'white'},
  {title: 'Black (Flat)', value: 'black'},
  {title: 'Contrast (Difference)', value: 'contrast'},
  {title: 'Liquid Metal (Overlay)', value: 'liquid'},
  {title: 'Apple Glass (Blur/Glow)', value: 'glass'},
  {title: 'RGB (Chromatic)', value: 'rgb'},
  {title: 'Custom Color (Solid)', value: 'custom'},
]

const arrowBlendOptions = [
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

const showCarouselArrows = ({parent, path}: {parent?: {carouselClickArrows?: boolean}; path?: unknown[]}) =>
  isCarouselItem({path}) || !parent?.carouselClickArrows


// --- Different media per device -------------------------------------------------------------
// Optional. Each entry holds a complete media item (image, video, YouTube/Vimeo, sequence,
// carousel) plus the screens it replaces the main media on. Empty = every screen shows the
// main media, as before. The first entry that lists the current screen wins.
const DEVICE_VARIANT_OPTIONS = [
  {title: 'Desktop (> 1600px)', value: 'Desktop'},
  {title: 'Laptop (1025 – 1600px)', value: 'Laptop'},
  {title: 'Tablet landscape', value: 'TabletLandscape'},
  {title: 'Tablet portrait', value: 'TabletPortrait'},
  {title: 'Mobile landscape big', value: 'MobileLandscape'},
  {title: 'Mobile landscape small', value: 'MobileLandscapeSmall'},
  {title: 'Mobile portrait big', value: 'MobilePortrait'},
  {title: 'Mobile portrait small', value: 'MobilePortraitSmall'},
]
const DEVICE_LABEL: Record<string, string> = Object.fromEntries(
  DEVICE_VARIANT_OPTIONS.map((o) => [o.value, o.title.replace(/ \(.*\)$/, '')]),
)
// A variant's own media must not offer variants again (and carousel slides don't get them).
// (path ends with this field's own name, so only the segments before it are checked)
const isInsideVariantOrSlide = ({path}: {path?: unknown[]}) =>
  Array.isArray(path) && path.slice(0, -1).some((seg) => seg === 'deviceVariants' || seg === 'carouselSlides')

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'object',
  fieldsets: [
    {name: 'cover', title: 'Cover Image', options: closed},
    {name: 'stillZoom', title: 'SVG / PNG Size & Position', options: closed},
    {name: 'endFrame', title: 'End Frame', options: closed},
    {name: 'video', title: 'Video', options: closed},
    {name: 'sequence', title: 'Image Sequence (Files & Start)', options: closed},
    {name: 'sequencePlay', title: 'Sequence Playback & Interaction', options: closed},
    {name: 'hotspot', title: 'Hover Hotspot', options: closed},
    {name: 'audio', title: 'Audio', options: closed},
    {name: 'caption', title: 'Caption & Offset', options: closed},
    {name: 'carousel', title: 'Carousel', options: closed},
    {name: 'carouselTimed', title: 'Timed Animation', options: closed},
    {name: 'deviceVariantsFold', title: 'Different media per device', options: closed},
  ],
  fields: [
    defineField({
      name: 'deviceVariants',
      title: 'Media for specific screens',
      type: 'array',
      fieldset: 'deviceVariantsFold',
      hidden: isInsideVariantOrSlide,
      description: 'Leave empty to show the media above on every screen. Add an entry to show different media (image, video, YouTube/Vimeo or sequence) on the screens you tick. Ratios and sizes per device still come from the section.',
      of: [
        {
          type: 'object',
          name: 'deviceVariant',
          title: 'Screen-specific media',
          fields: [
            defineField({
              name: 'devices',
              title: 'Show on these screens',
              type: 'array',
              of: [{type: 'string'}],
              options: {list: DEVICE_VARIANT_OPTIONS, layout: 'grid'},
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'media',
              title: 'Media for these screens',
              type: 'mediaItem',
            }),
          ],
          preview: {
            select: {devices: 'devices', image: 'media.image', seq: 'media.enableImageSequence', video: 'media.videoSource'},
            prepare({devices, image, seq, video}: any) {
              const list = Array.isArray(devices) ? devices.map((d: string) => DEVICE_LABEL[d] || d).join(', ') : 'No screens ticked'
              const kind = seq ? 'Image sequence' : video && video !== 'sanity' ? `Video (${video})` : 'Media'
              return {title: list, subtitle: kind, media: image}
            },
          },
        },
      ],
    }),
    defineField({
      name: 'imageSource',
      title: 'Cover Image Source',
      type: 'string',
      fieldset: 'cover',
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
      name: 'image',
      title: 'Start Frame / Cover Image (Sanity)',
      type: 'image',
      fieldset: 'cover',
      description: 'Upload the first frame of the video. This hides the loading screen at the start. Use "Edit" -> "Hotspot" to set the focal point.',
      options: {
        hotspot: true,
      },
      hidden: ({parent}) => parent?.imageSource === 'external',
    }),
    defineField({
      name: 'imageUrl',
      title: 'External Image URL',
      type: 'url',
      fieldset: 'cover',
      description: 'Paste the direct link to the image or GIF (e.g., https://stc-server.com/image.jpg)',
      hidden: ({parent}) => !parent?.imageSource || parent?.imageSource === 'sanity',
    }),
    defineField({
      name: 'stillZoom',
      title: 'Default zoom (all breakpoints)',
      type: 'number',
      fieldset: 'stillZoom',
      description: 'Size of this still on every screen, on top of one shared default. For an SVG or PNG, empty = that default: every icon is the same size, whatever its pixel dimensions. 100 is the same default. 200 is twice as big. JPG photos stay filling the frame until a number is set. A size number in a device fold below replaces this on that screen only. Optical Media Zoom on the section still fine-tunes one breakpoint on top of this.',
      validation: (Rule) => Rule.min(1).max(400),
    }),
    ...stillOffsetFields(),
    defineField({
      name: 'stillEffectMode',
      title: 'Effect Mode',
      type: 'string',
      fieldset: 'stillZoom',
      options: {list: arrowModeOptions},
      initialValue: 'original',
      description: 'Same filters as the logo on a template: liquid metal, glass, contrast, RGB, white, black, or a custom color.',
    }),
    defineField({
      name: 'stillEffectColor',
      title: 'Color',
      type: 'string',
      fieldset: 'stillZoom',
      description: 'Main fill / filter color. Used when Effect Mode is custom, glass, or liquid.',
      hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.stillEffectMode),
    }),
    defineField({
      name: 'stillEffectColorOpacity',
      title: 'Color Transparency',
      type: 'number',
      fieldset: 'stillZoom',
      description: '0.0 (Transparent) to 1.0 (Solid). Applies to the color above.',
      validation: (Rule) => Rule.min(0).max(1),
      hidden: ({parent}) => !['custom', 'glass', 'liquid'].includes(parent?.stillEffectMode),
    }),
    defineField({
      name: 'stillBlendMode',
      title: 'Blend Mode',
      type: 'string',
      fieldset: 'stillZoom',
      options: {list: arrowBlendOptions},
      initialValue: 'normal',
      description: 'Photoshop / Illustrator blend. Pick one and the color for that blend appears below. Used when Effect Mode is Original, same as the logo underlay.',
    }),
    defineField({
      name: 'stillBlendColor',
      title: 'Blend color',
      type: 'string',
      fieldset: 'stillZoom',
      description: 'The fill this blend mode mixes with the background, e.g. #FFFFFF. This color is what changes the blend.',
      hidden: ({parent}) => !parent?.stillBlendMode || parent?.stillBlendMode === 'normal',
    }),
    defineField({
      name: 'stillBlendOpacity',
      title: 'Blend transparency',
      type: 'number',
      fieldset: 'stillZoom',
      description: 'Photoshop Opacity (0–1), applied AFTER the blend. 1 = full blend, 0.4 = 40% strength.',
      validation: (Rule) => Rule.min(0).max(1),
      initialValue: 1,
      hidden: ({parent}) => !parent?.stillBlendMode || parent?.stillBlendMode === 'normal',
    }),
    defineField({
      name: 'endFrameImageSource',
      title: 'End Frame Source',
      type: 'string',
      fieldset: 'endFrame',
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
      name: 'endFrameImage',
      title: 'End Frame Image (Sanity)',
      type: 'image',
      fieldset: 'endFrame',
      description: 'OPTIONAL (But highly recommended for YouTube/Vimeo). Upload the exact last frame of the video. This perfectly masks the black reloading screen when the video loops.',
      options: {
        hotspot: true,
      },
      hidden: ({parent}) => parent?.endFrameImageSource === 'external',
    }),
    defineField({
      name: 'endFrameImageUrl',
      title: 'External End Frame URL',
      type: 'url',
      fieldset: 'endFrame',
      description: 'Paste the direct link to the end frame image.',
      hidden: ({parent}) => !parent?.endFrameImageSource || parent?.endFrameImageSource === 'sanity',
    }),
    defineField({
      name: 'videoSource',
      title: 'Video Hosting Source',
      type: 'string',
      fieldset: 'video',
      description: 'Choose where the video is hosted. Using external sources saves Sanity bandwidth.',
      options: {
        list: [
          { title: 'Sanity (Upload directly)', value: 'sanity' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'StC Server (Direct MP4 link)', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'sanity',
    }),
    defineField({
      name: 'video',
      title: 'Video File (Sanity Upload)',
      type: 'file',
      fieldset: 'video',
      description: 'The video will inherit the Focus Point (Hotspot) from the Image above.',
      options: {
        accept: 'video/*',
      },
      hidden: ({parent}) => parent?.videoSource !== 'sanity',
    }),
    defineField({
      name: 'videoUrl',
      title: 'External Video URL',
      type: 'url',
      fieldset: 'video',
      description: 'Paste the Vimeo, YouTube, or StC Server direct link here.',
      hidden: ({parent}) => !parent?.videoSource || parent?.videoSource === 'sanity',
    }),
    defineField({
      name: 'enableImageSequence',
      title: 'Enable Scroll-Driven Image Sequence (Apple-style)',
      type: 'boolean',
      fieldset: 'sequence',
      description: 'Overrides standard video/image. Plays a pre-loaded image sequence linked to user scrolling.',
      initialValue: false,
    }),
    defineField({
      name: 'sequenceBaseUrl',
      title: 'Sequence Folder URL',
      type: 'string',
      fieldset: 'sequence',
      description: 'The exact folder path on your server. MUST end with a slash! e.g., "https://stc-server.com/assets/project-car/seq/"',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequencePrefix',
      title: 'File Prefix',
      type: 'string',
      fieldset: 'sequence',
      description: 'e.g., "frame_" or "img" (Leave empty if files are just "1.jpg", "2.jpg"). The frontend expects 4-digit padding (e.g., 0001.webp).',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceTotalFrames',
      title: 'Total Frames',
      type: 'number',
      fieldset: 'sequence',
      description: 'The exact number of images in the sequence (e.g., 150).',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceExtension',
      title: 'File Extension',
      type: 'string',
      fieldset: 'sequence',
      options: {
        list: ['.jpg', '.webp', '.png']
      },
      initialValue: '.webp',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceZeroPad',
      title: 'Number Format (Padding)',
      type: 'string',
      fieldset: 'sequence',
      options: {
        list: [
          { title: 'No Padding (1, 2, 3... 90)', value: 'none' },
          { title: '4 Digits (0001, 0002... 0090)', value: '4' },
          { title: '3 Digits (001, 002... 090)', value: '3' },
        ]
      },
      initialValue: 'none',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceStartScrollDown',
      title: 'When scrolling DOWN into this section (Normal forward reading)',
      type: 'string',
      fieldset: 'sequence',
      options: {
        list: [
          { title: 'Start at First Frame', value: 'first' },
          { title: 'Start at Frame X (Custom)', value: 'custom' },
          { title: 'Start at Last Frame', value: 'last' }
        ],
        layout: 'radio'
      },
      initialValue: 'first',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceStartFrameDown',
      title: 'Starting Frame (Scroll Down)',
      type: 'number',
      fieldset: 'sequence',
      description: 'Enter the exact frame number (e.g., 25).',
      hidden: ({parent}) => parent?.sequenceStartScrollDown !== 'custom'
    }),
    defineField({
      name: 'sequenceStartScrollUp',
      title: 'When scrolling UP into this section (Going backward)',
      type: 'string',
      fieldset: 'sequence',
      options: {
        list: [
          { title: 'Start at First Frame', value: 'first' },
          { title: 'Start at Frame X (Custom)', value: 'custom' },
          { title: 'Start at Last Frame', value: 'last' }
        ],
        layout: 'radio'
      },
      initialValue: 'first',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceStartFrameUp',
      title: 'Starting Frame (Scroll Up)',
      type: 'number',
      fieldset: 'sequence',
      description: 'Enter the exact frame number (e.g., 25).',
      hidden: ({parent}) => parent?.sequenceStartScrollUp !== 'custom'
    }),
    defineField({
      name: 'sequenceInteractionMode',
      title: 'Interaction Mode',
      type: 'string',
      fieldset: 'sequencePlay',
      options: {
        list: [
          { title: 'Scroll Driven (Apple-style)', value: 'scroll' },
          { title: 'Hover Hotspot (Triggered Auto-Play)', value: 'hover' }
        ],
        layout: 'radio'
      },
      initialValue: 'scroll',
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceScrollScreensTouch',
      title: 'Scroll Length: Phones & Tablets (screen heights)',
      type: 'number',
      fieldset: 'sequencePlay',
      description: 'How far the finger scrolls to play the whole sequence, in screen heights. 1 = one full screen, 0.7 = shorter (more sensitive). Empty = default (about 10 px per frame).',
      validation: (Rule) => Rule.min(0.2).max(10),
    }),
    defineField({
      name: 'sequenceScrollScreensDesktop',
      title: 'Scroll Length: Laptop & Desktop (screen heights)',
      type: 'number',
      fieldset: 'sequencePlay',
      description: 'Same for mouse / trackpad scrolling. Empty = default (30 px per frame).',
      validation: (Rule) => Rule.min(0.2).max(10),
    }),
    defineField({
      name: 'sequenceMobileAutoplay',
      title: 'Force Auto-Play on Mobile/Tablet',
      type: 'boolean',
      fieldset: 'sequencePlay',
      description: 'If enabled, the sequence will automatically play on entry for mobile and tablet devices, ignoring the base Interaction Mode.',
      initialValue: false,
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceDesktopAutoplay',
      title: 'Force Auto-Play on Desktop',
      type: 'boolean',
      fieldset: 'sequencePlay',
      description: 'If enabled, the sequence will automatically play on entry for desktop devices, ignoring the base Interaction Mode.',
      initialValue: false,
      hidden: ({parent}) => !parent?.enableImageSequence,
    }),
    defineField({
      name: 'sequenceAutoplayDelay',
      title: 'Auto-Play Start Delay (Seconds)',
      type: 'number',
      fieldset: 'sequencePlay',
      description: 'How long to wait on the first frame before the auto-play sequence fires (e.g., 0.5, 1.5).',
      initialValue: 0,
      hidden: ({parent}) => !parent?.enableImageSequence || (!parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay),
    }),
    defineField({
      name: 'sequencePauseFrame',
      title: 'Auto-Play Pause Frame',
      type: 'number',
      fieldset: 'sequencePlay',
      description: 'Frame number to pause at (e.g. 40). Leave blank to play through without pausing.',
      hidden: ({parent}) => !parent?.enableImageSequence || (parent?.sequenceInteractionMode !== 'hover' && !parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay),
    }),
    defineField({
      name: 'sequencePauseDuration',
      title: 'Auto-Play Pause Duration (Seconds)',
      type: 'number',
      fieldset: 'sequencePlay',
      description: 'How long to pause at the frame defined above (e.g. 3).',
      initialValue: 3,
      hidden: ({parent}) => !parent?.enableImageSequence || !parent?.sequencePauseFrame,
    }),
    defineField({
      name: 'hoverEndAction',
      title: 'Action After Auto-Play',
      type: 'string',
      fieldset: 'sequencePlay',
      options: {
        list: [
          { title: 'Stop (Hold on last frame)', value: 'stop' },
          { title: 'Fade Out (For Award Overlays)', value: 'fade-out' },
          { title: 'Go to Next Section Down (Auto-Scroll)', value: 'next' },
          { title: 'Jump to specific Section / Project', value: 'scroll' }
        ],
        layout: 'radio'
      },
      initialValue: 'stop',
      hidden: ({parent}) => !parent?.enableImageSequence || (parent?.sequenceInteractionMode !== 'hover' && !parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay),
    }),
    defineField({
      name: 'hoverTargetSection',
      title: 'Target Section ID',
      type: 'string',
      fieldset: 'sequencePlay',
      description: 'The ID of the section to scroll to after the animation finishes (e.g., "section-3").',
      hidden: ({parent}) => !parent?.enableImageSequence || (parent?.sequenceInteractionMode !== 'hover' && !parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay) || parent?.hoverEndAction !== 'scroll',
    }),
    defineField({
      name: 'hoverTargetProject',
      title: 'Target Project Key (Optional)',
      type: 'string',
      fieldset: 'sequencePlay',
      description: 'The Project Key to jump to (e.g., "orem"). Leave blank to stay in the current project.',
      hidden: ({parent}) => !parent?.enableImageSequence || (parent?.sequenceInteractionMode !== 'hover' && !parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay) || parent?.hoverEndAction !== 'scroll',
    }),
    defineField({
      name: 'hoverPlaySpeed',
      title: 'Entry / Full Play Speed (Seconds)',
      type: 'number',
      fieldset: 'sequencePlay',
      initialValue: 2.0,
      description: 'How fast the sequence plays to the end (or to the Pause Frame if set).',
      hidden: ({parent}) => !parent?.enableImageSequence || (parent?.sequenceInteractionMode !== 'hover' && !parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay),
    }),
    defineField({
      name: 'hoverExitSpeed',
      title: 'Exit Play Speed (Seconds)',
      type: 'number',
      fieldset: 'sequencePlay',
      initialValue: 1.5,
      description: 'How fast the sequence plays from the Pause Frame to the end.',
      hidden: ({parent}) => !parent?.enableImageSequence || !parent?.sequencePauseFrame || (parent?.sequenceInteractionMode !== 'hover' && !parent?.sequenceMobileAutoplay && !parent?.sequenceDesktopAutoplay),
    }),
    defineField({
      name: 'hotspotX',
      title: 'Hotspot X Position (%)',
      type: 'number',
      fieldset: 'hotspot',
      initialValue: 50,
      validation: Rule => Rule.min(0).max(100),
      description: '0 = Left Edge, 50 = Center, 100 = Right Edge',
      hidden: ({parent}) => !parent?.enableImageSequence || parent?.sequenceInteractionMode !== 'hover',
    }),
    defineField({
      name: 'hotspotY',
      title: 'Hotspot Y Position (%)',
      type: 'number',
      fieldset: 'hotspot',
      initialValue: 50,
      validation: Rule => Rule.min(0).max(100),
      description: '0 = Top Edge, 50 = Center, 100 = Bottom Edge',
      hidden: ({parent}) => !parent?.enableImageSequence || parent?.sequenceInteractionMode !== 'hover',
    }),
    defineField({
      name: 'hotspotWidth',
      title: 'Hotspot Width (%)',
      type: 'number',
      fieldset: 'hotspot',
      initialValue: 20,
      validation: Rule => Rule.min(1).max(100),
      hidden: ({parent}) => !parent?.enableImageSequence || parent?.sequenceInteractionMode !== 'hover',
    }),
    defineField({
      name: 'hotspotHeight',
      title: 'Hotspot Height (%)',
      type: 'number',
      fieldset: 'hotspot',
      initialValue: 20,
      validation: Rule => Rule.min(1).max(100),
      hidden: ({parent}) => !parent?.enableImageSequence || parent?.sequenceInteractionMode !== 'hover',
    }),
    defineField({
      name: 'showHotspotGuide',
      title: 'Show Hotspot Guide (Blue Box)',
      type: 'boolean',
      fieldset: 'hotspot',
      initialValue: true,
      description: 'Turn ON to see the blue box while positioning. Turn OFF for the live website.',
      hidden: ({parent}) => !parent?.enableImageSequence || parent?.sequenceInteractionMode !== 'hover',
    }),
    defineField({
      name: 'enableAudio',
      title: 'Enable Audio (Video Only)',
      type: 'boolean',
      fieldset: 'audio',
      description: 'If checked, the video will play with its original sound. Note: Browsers may block autoplaying sound until the user interacts with the page.',
      initialValue: false,
    }),
    defineField({
      name: 'audioVolume',
      title: 'Audio Volume Level',
      type: 'number',
      fieldset: 'audio',
      description: 'Fine-tune the volume from 0.0 (silent) to 1.0 (100% original volume). Default is 1.0.',
      initialValue: 1.0,
      validation: Rule => Rule.min(0).max(1),
      hidden: ({parent}) => !parent?.enableAudio,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      fieldset: 'caption',
    }),
    defineField({
      name: 'captionColor',
      title: 'Caption Color',
      type: 'string',
      fieldset: 'caption',
      description: 'Hex code (e.g. #ffffff) or RGBA. Leave empty to use default.',
    }),
    defineField({
      name: 'verticalOffset',
      title: 'Vertical Offset',
      type: 'string',
      fieldset: 'caption',
      description: 'Move the media up or down. E.g., "-2rem" or "5vh" or "-20px".',
    }),
    defineField({
      name: 'captionArrow',
      title: 'Animated Arrow above Caption',
      type: 'boolean',
      fieldset: 'caption',
      description: 'Shows a small down arrow above the caption that moves up and down (e.g. for "scroll down"). Uses the caption color.',
      initialValue: false,
    }),
    defineField({
      name: 'hideCaptionMobileLandscape',
      title: 'Hide Caption (Mobile Landscape)',
      type: 'boolean',
      fieldset: 'caption',
      description: 'If checked, ONLY this specific caption will be hidden on mobile landscape.',
      initialValue: false,
    }),
    defineField({
      name: 'carouselSlides',
      title: 'Carousel items',
      type: 'array',
      fieldset: 'carousel',
      hidden: isCarouselItem,
      of: [{type: 'mediaItem', title: 'Item'}],
      description: 'Leave empty to keep Cover Image / Video as one static media. Add item for each media in this frame. Drag to reorder.',
    }),
    defineField({
      name: 'carouselMouseScroll',
      title: 'Moved by the mouse (up or down)',
      type: 'boolean',
      fieldset: 'carousel',
      hidden: ({parent, path}) => isCarouselItem({path}),
      description: 'On its own: scroll down = next image, scroll up = previous image. Another scroll on the first or last image goes to the section above or below. With Click arrows on: the scroll does not change the image. Down goes to the next section, up goes to the section above, from whichever image is showing. This stays on with Loop, so the arrows can repeat the images while the scroll still leaves the section.',
    }),
    defineField({
      name: 'carouselClickArrows',
      title: 'Click arrows',
      type: 'boolean',
      fieldset: 'carousel',
      initialValue: false,
      hidden: ({parent, path}) => isCarouselItem({path}),
      description: 'Left and right arrows at mid height. A click moves one image, back or forward. With Loop on, a click past the last image returns to the first. Mouse scroll can stay on: the scroll then leaves to the next section or the section above from any image.',
    }),
    defineField({
      name: 'carouselArrowImage',
      title: 'Arrow SVG',
      type: 'image',
      fieldset: 'carousel',
      hidden: showCarouselArrows,
      description: 'One arrow, used on both sides. The right one is rotated 180 degrees. Empty uses the site-wide arrow, or a simple chevron when that is empty too.',
      options: {accept: 'image/svg+xml'},
    }),
    defineField({
      name: 'carouselArrowSize',
      title: 'Arrow size',
      type: 'string',
      fieldset: 'carousel',
      hidden: showCarouselArrows,
      description: 'Examples: 28, 32px, 4vh. A bare number is pixels. Empty uses the site-wide size for this screen.',
    }),
    defineField({
      name: 'carouselArrowOffsetLeft',
      title: 'Left arrow offset',
      type: 'string',
      fieldset: 'carousel',
      hidden: showCarouselArrows,
      description: 'Distance from the left border. Examples: 24, 3vw. A bare number is pixels. Empty uses the site-wide offset for this screen.',
    }),
    defineField({
      name: 'carouselArrowOffsetRight',
      title: 'Right arrow offset',
      type: 'string',
      fieldset: 'carousel',
      hidden: showCarouselArrows,
      description: 'Distance from the right border. Examples: 24, 3vw. A bare number is pixels. Empty uses the site-wide offset for this screen.',
    }),
    defineField({
      name: 'carouselArrowOffsetY',
      title: 'Arrow vertical offset',
      type: 'string',
      fieldset: 'carousel',
      hidden: showCarouselArrows,
      description: 'Moves both arrows off mid height. Positive moves down, negative moves up. A bare number is pixels. Empty uses the site-wide offset for this screen.',
    }),
    defineField({
      name: 'carouselArrowMode',
      title: 'Arrow effect',
      type: 'string',
      fieldset: 'carousel',
      options: {list: arrowModeOptions},
      hidden: showCarouselArrows,
      description: 'Empty uses the site-wide effect. A choice here replaces it for this carousel.',
    }),
    defineField({
      name: 'carouselArrowColor',
      title: 'Arrow color',
      type: 'string',
      fieldset: 'carousel',
      hidden: ({parent, path}) => {
        if (showCarouselArrows({parent, path})) return true
        const mode = parent?.carouselArrowMode || 'original'
        return mode !== 'custom' && mode !== 'original'
      },
      description: 'Hex, for example #00ffff. Empty uses the site-wide color. A value here replaces it. On Original it tints the arrow. On Custom Color it is the solid color.',
    }),
    defineField({
      name: 'carouselArrowBlend',
      title: 'Arrow blend',
      type: 'string',
      fieldset: 'carousel',
      options: {list: arrowBlendOptions},
      hidden: showCarouselArrows,
      description: 'Empty uses the site-wide blend. A choice here replaces it. Used when the effect is Original.',
    }),
    defineField({
      name: 'carouselStartScrollDown',
      title: 'When scrolling down into this carousel',
      type: 'string',
      fieldset: 'carousel',
      options: {
        list: [
          {title: 'Start at first card', value: 'first'},
          {title: 'Start at card number', value: 'custom'},
          {title: 'Start at last card', value: 'last'},
        ],
        layout: 'radio',
      },
      initialValue: 'first',
      hidden: isCarouselItem,
      description: 'Coming from the section above. Empty = first card.',
    }),
    defineField({
      name: 'carouselStartCardDown',
      title: 'Starting card (scroll down)',
      type: 'number',
      fieldset: 'carousel',
      description: 'Card 1 is the first item in the list.',
      hidden: ({parent, path}) => isCarouselItem({path}) || parent?.carouselStartScrollDown !== 'custom',
      validation: Rule => Rule.min(1).integer(),
    }),
    defineField({
      name: 'carouselStartScrollUp',
      title: 'When scrolling up into this carousel',
      type: 'string',
      fieldset: 'carousel',
      options: {
        list: [
          {title: 'Start at first card', value: 'first'},
          {title: 'Start at card number', value: 'custom'},
          {title: 'Start at last card', value: 'last'},
        ],
        layout: 'radio',
      },
      initialValue: 'last',
      hidden: isCarouselItem,
      description: 'Coming from the section below. Empty = last card, so the next scroll up walks back toward the first.',
    }),
    defineField({
      name: 'carouselStartCardUp',
      title: 'Starting card (scroll up)',
      type: 'number',
      fieldset: 'carousel',
      description: 'Card 1 is the first item in the list.',
      hidden: ({parent, path}) => isCarouselItem({path}) || parent?.carouselStartScrollUp !== 'custom',
      validation: Rule => Rule.min(1).integer(),
    }),
    defineField({
      name: 'carouselResumeLast',
      title: 'Last active card',
      type: 'boolean',
      fieldset: 'carousel',
      initialValue: false,
      hidden: isCarouselItem,
      description: 'A new page load uses the start choices above. After this carousel has been open in this visit, scrolling back from the section above or below shows the card that was on screen. Works on every template.',
    }),
    defineField({
      name: 'carouselEdgeHold',
      title: 'Card while the next section stacks',
      type: 'string',
      fieldset: 'carousel',
      options: {
        list: [
          {title: 'Keep fixed in the center', value: 'stay'},
          {title: 'Scroll the card out', value: 'exit'},
        ],
        layout: 'radio',
      },
      initialValue: 'stay',
      hidden: isCarouselItem,
      description: 'The card you leave on stays in the center under the next section. Scroll out plays Move out. It does not jump back to the first card.',
    }),
    defineField({
      name: 'carouselMode',
      title: 'Play',
      type: 'string',
      fieldset: 'carousel',
      hidden: true,
    }),
    defineField({
      name: 'carouselHold',
      title: 'Hold (seconds)',
      type: 'number',
      fieldset: 'carouselTimed',
      hidden: ({parent}) => (parent?.carouselMouseScroll || parent?.carouselClickArrows) && !parent?.carouselLoop,
      description: 'How long each media stays before the next move. Empty = 3 seconds. On an item, empty uses this carousel Hold.',
    }),
    defineField({
      name: 'carouselDuration',
      title: 'Move duration (seconds)',
      type: 'number',
      fieldset: 'carouselTimed',
      description: 'How long the move in / move out takes. Empty = 0.8 seconds. On an item, empty uses this carousel duration.',
    }),
    defineField({
      name: 'carouselEnter',
      title: 'Move in',
      type: 'string',
      fieldset: 'carousel',
      options: {list: carouselEnterOptions},
      description: 'Where the next media comes from. Empty = fade. On an item, empty uses this carousel Move in.',
    }),
    defineField({
      name: 'carouselExit',
      title: 'Move out',
      type: 'string',
      fieldset: 'carousel',
      options: {list: carouselExitOptions},
      description: 'Where the current media goes. Empty = fade. On an item, empty uses this carousel Move out.',
    }),
    defineField({
      name: 'carouselAnimateFirst',
      title: 'Move first media in',
      type: 'boolean',
      fieldset: 'carousel',
      hidden: isCarouselItem,
      description: 'Move the first media in when the section is shown.',
    }),
    defineField({
      name: 'carouselLoop',
      title: 'Loop',
      type: 'boolean',
      fieldset: 'carousel',
      hidden: isCarouselItem,
      description: 'After the last image, play the first again. With Click arrows, the arrows repeat the list. With Mouse scroll on as well, the scroll still leaves to the next section or the section above from any image.',
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      image: 'image',
      videoSource: 'videoSource',
      enableSeq: 'enableImageSequence',
      slides: 'carouselSlides',
    },
    prepare({caption, image, videoSource, enableSeq, slides}) {
      const extra = Array.isArray(slides) ? slides.length : 0
      const kind = enableSeq
        ? 'Image sequence'
        : (videoSource && videoSource !== 'sanity' ? `Video (${videoSource})` : 'Media')
      const extraLabel = extra ? `${extra} carousel item${extra === 1 ? '' : 's'}` : ''
      return {
        title: caption || kind,
        subtitle: [caption ? kind : '', extraLabel].filter(Boolean).join(' · ') || undefined,
        media: image,
      }
    },
  },
})
