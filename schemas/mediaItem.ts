// stc-website-sanity/schemas/mediaItem.ts ID 192.1
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image / Cover',
      type: 'image',
      description: 'Upload an image here. IMPORTANT: Use "Edit" -> "Hotspot" to set the focal point. This focal point will be used to crop BOTH the image and the video correctly on mobile.',
      options: { 
        hotspot: true, // Enables the UI for selecting focus point
      },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      description: 'The video will inherit the Focus Point (Hotspot) from the Image above.',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'enableAudio',
      title: 'Enable Audio (Video Only)',
      type: 'boolean',
      description: 'If checked, the video will play with its original sound. Note: Browsers may block autoplaying sound until the user interacts with the page.',
      initialValue: false,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'captionColor',
      title: 'Caption Color',
      type: 'string',
      description: 'Hex code (e.g. #ffffff) or RGBA. Leave empty to use default.',
    }),
    defineField({
      name: 'verticalOffset',
      title: 'Vertical Offset',
      type: 'string', 
      description: 'Move the media up or down. E.g., "-2rem" or "5vh" or "-20px".',
    }),
    // ID 168.1: Moved here for granular control per image
    defineField({
      name: 'hideCaptionMobileLandscape',
      title: 'Hide Caption (Mobile Landscape)',
      type: 'boolean',
      description: 'If checked, ONLY this specific caption will be hidden on mobile landscape.',
      initialValue: false,
    }),
  ],
})