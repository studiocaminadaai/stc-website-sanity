// schemas/twoColumnMedia.ts
import {defineField, defineType} from 'sanity'

const closed = {collapsible: true, collapsed: true} as const

export default defineType({
  name: 'twoColumnMedia',
  title: 'Two Column Media',
  type: 'object',
  fields: [
    defineField({name: 'media1', title: 'Media 1', type: 'mediaItem', options: closed}),
    defineField({name: 'media2', title: 'Media 2', type: 'mediaItem', options: closed}),
  ],
})
