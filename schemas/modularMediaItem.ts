import {defineField, defineType} from 'sanity'

const ratioOptions = [
  {title: 'Default (Template Standard)', value: 'original'}, 
  {title: '1:1 (Square)', value: '1/1'}, 
  {title: '5:4', value: '5/4'}, 
  {title: '4:3', value: '4/3'}, 
  {title: '3:2', value: '3/2'}, 
  {title: '16:10', value: '16/10'}, 
  {title: '16:9', value: '16/9'}, 
  {title: '21:9', value: '21/9'}, 
  {title: '4:5', value: '4/5'}, 
  {title: '3:4', value: '3/4'}, 
  {title: '2:3', value: '2/3'}, 
  {title: '2:4', value: '2/4'}, 
  {title: '9:16', value: '9/16'}
];

const alignOptions = [
  {title: 'Left', value: 'left'},
  {title: 'Center', value: 'center'},
  {title: 'Right', value: 'right'}
];

export default defineType({
  name: 'modularMediaItem',
  title: 'Modular Media Item',
  type: 'object',
  fieldsets: [
    {name: 'desktop', title: 'Desktop', options: {collapsible: true, collapsed: true}},
    {name: 'tablet', title: 'Tablet', options: {collapsible: true, collapsed: true}},
    {name: 'mobile', title: 'Mobile', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'mediaItem',
      options: {collapsible: true, collapsed: true},
      validation: (Rule) => Rule.required()
    }),
    
    defineField({name: 'widthDesktop', title: 'Width (Desktop)', type: 'string', initialValue: '100%', description: 'e.g. 100%, 50%, 33.33vw', fieldset: 'desktop'}),
    defineField({name: 'aspectRatioDesktop', title: 'Aspect Ratio (Desktop)', type: 'string', options: { list: ratioOptions }, initialValue: 'original', fieldset: 'desktop'}),
    defineField({name: 'alignDesktop', title: 'Alignment (Desktop)', type: 'string', options: { list: alignOptions }, initialValue: 'center', fieldset: 'desktop'}),
    defineField({name: 'offsetXDesktop', title: 'Offset X (Desktop)', type: 'string', description: 'Nudge Left/Right (e.g. 5vw, -50px)', fieldset: 'desktop'}),
    defineField({name: 'offsetYDesktop', title: 'Offset Y (Desktop)', type: 'string', description: 'Nudge Up/Down (e.g. 10vh, -2rem)', fieldset: 'desktop'}),

    defineField({name: 'widthTablet', title: 'Width (Tablet)', type: 'string', initialValue: '100%', fieldset: 'tablet'}),
    defineField({name: 'aspectRatioTablet', title: 'Aspect Ratio (Tablet)', type: 'string', options: { list: ratioOptions }, initialValue: 'original', fieldset: 'tablet'}),
    defineField({name: 'alignTablet', title: 'Alignment (Tablet)', type: 'string', options: { list: alignOptions }, initialValue: 'center', fieldset: 'tablet'}),
    defineField({name: 'offsetXTablet', title: 'Offset X (Tablet)', type: 'string', fieldset: 'tablet'}),
    defineField({name: 'offsetYTablet', title: 'Offset Y (Tablet)', type: 'string', fieldset: 'tablet'}),

    defineField({name: 'widthMobile', title: 'Width (Mobile)', type: 'string', initialValue: '100%', fieldset: 'mobile'}),
    defineField({name: 'aspectRatioMobile', title: 'Aspect Ratio (Mobile)', type: 'string', options: { list: ratioOptions }, initialValue: 'original', fieldset: 'mobile'}),
    defineField({name: 'alignMobile', title: 'Alignment (Mobile)', type: 'string', options: { list: alignOptions }, initialValue: 'center', fieldset: 'mobile'}),
    defineField({name: 'offsetXMobile', title: 'Offset X (Mobile)', type: 'string', fieldset: 'mobile'}),
    defineField({name: 'offsetYMobile', title: 'Offset Y (Mobile)', type: 'string', fieldset: 'mobile'})
  ],
  preview: {
    select: {
      mediaTitle: 'media.caption',
      widthDes: 'widthDesktop'
    },
    prepare(selection) {
      const {mediaTitle, widthDes} = selection
      return {
        title: mediaTitle || 'Modular Image',
        subtitle: `Desktop Width: ${widthDes || '100%'}`
      }
    }
  }
})