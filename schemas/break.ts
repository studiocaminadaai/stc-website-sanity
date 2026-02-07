// stc-website-sanity/schemas/break.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'breakType', // <<< CORRECTED FROM 'break'
  title: 'Break',
  type: 'object',
  fields: [
    {
      name: 'style',
      title: 'Break Style',
      type: 'string',
      options: {
        list: [
          {title: 'Line Break', value: 'lineBreak'},
          {title: 'Line with small space', value: 'lineWithSmallSpace'},
          {title: 'Line with medium space', value: 'lineWithMediumSpace'},
          {title: 'Line with large space', value: 'lineWithLargeSpace'},
        ],
      },
    },
  ],
})