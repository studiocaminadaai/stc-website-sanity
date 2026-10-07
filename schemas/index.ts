// stc-website-sanity/schemas/index.ts
import project from './project'
import section from './section'
import mediaItem from './mediaItem'
import twoColumnMedia from './twoColumnMedia'
import threeColumnMedia from './threeColumnMedia'
import fourColumnMedia from './fourColumnMedia'
import modularMediaItem from './modularMediaItem'
import siteConfig from './siteConfig'
import fontResource from './fontResource'
import effectResource from './effectResource'
import customSpacing from './customSpacing' 
import awardOverlay from './awardOverlay'
import seoObject from './seoObject'

export const schemaTypes = [
  // Documents
  project,
  section,
  siteConfig,
  fontResource,
  effectResource,
  
  // Objects
  seoObject,
  mediaItem,
  twoColumnMedia,
  threeColumnMedia,
  fourColumnMedia,
  modularMediaItem,
  customSpacing, 
  awardOverlay,
]