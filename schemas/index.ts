// stc-website-sanity/schemas/index.ts ID 212.2
import project from './project'
import section from './section'
import mediaItem from './mediaItem'
import twoColumnMedia from './twoColumnMedia'
import threeColumnMedia from './threeColumnMedia'
import breakType from './break'
import siteConfig from './siteConfig'
import fontResource from './fontResource'
import effectResource from './effectResource' // NEW

export const schemaTypes = [
  // Documents
  project,
  section,
  siteConfig,
  fontResource,
  effectResource, // Added
  
  // Objects
  mediaItem,
  twoColumnMedia,
  threeColumnMedia,
  breakType,
]