import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seoObject',
  title: 'SEO / AIO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides the page title in search and AI citations. Keep under 60 characters.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Plain-language summary for Google, GPTBot, and social cards. Keep under 160 characters.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {hotspot: true},
      description: '1200×630 recommended. Used for OG/Twitter and as CreativeWork image in JSON-LD.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Absolute URL if this page should not use the default /work/{projectKey} path.',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
})
