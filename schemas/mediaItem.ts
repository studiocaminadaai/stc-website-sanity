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
]

const carouselExitOptions = [
  {title: 'Fade', value: 'fade'},
  {title: 'To left', value: 'to-left'},
  {title: 'To right', value: 'to-right'},
  {title: 'To top', value: 'to-top'},
  {title: 'To bottom', value: 'to-bottom'},
]

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'object',
  fieldsets: [
    {name: 'cover', title: 'Cover Image', options: closed},
    {name: 'endFrame', title: 'End Frame', options: closed},
    {name: 'video', title: 'Video', options: closed},
    {name: 'sequence', title: 'Image Sequence (Files & Start)', options: closed},
    {name: 'sequencePlay', title: 'Sequence Playback & Interaction', options: closed},
    {name: 'hotspot', title: 'Hover Hotspot', options: closed},
    {name: 'audio', title: 'Audio', options: closed},
    {name: 'caption', title: 'Caption & Offset', options: closed},
    {name: 'carousel', title: 'Carousel', options: closed},
    {name: 'carouselTimed', title: 'Timed Animation', options: closed},
  ],
  fields: [
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
      hidden: ({parent, path}) => isCarouselItem({path}) || Boolean(parent?.carouselLoop),
      description: 'Scroll down = next image. Scroll up = previous image. At the first or last item, further scroll stacks the section. Only works with Loop off. Hold is ignored while this is on.',
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
      hidden: ({parent}) => parent?.carouselMouseScroll && !parent?.carouselLoop,
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
      description: 'Play the list again after the last item. Loop uses Timed Animation only. Mouse stepping is off while Loop is on.',
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
