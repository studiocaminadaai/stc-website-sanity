import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

const docs = await client.fetch(`*[_type == "project"]{
  _id,
  projectAudioVolume,
  projectAudioSource,
  projectAudio,
  projectAudioUrl
}`)

const tx = client.transaction()
let volumeCleared = 0
let sourceCleared = 0

for (const doc of docs) {
  const patches = []
  if (doc.projectAudioVolume === 0.5) {
    patches.push('projectAudioVolume')
    volumeCleared += 1
  }
  const hasAudio = Boolean(doc.projectAudio?.asset || doc.projectAudioUrl)
  if (doc.projectAudioSource === 'sanity' && !hasAudio) {
    patches.push('projectAudioSource')
    sourceCleared += 1
  }
  if (patches.length) tx.patch(doc._id, (p) => p.unset(patches))
}

if (volumeCleared === 0 && sourceCleared === 0) {
  console.log('No stored project audio defaults to clear.')
} else {
  await tx.commit()
  console.log(`Cleared volume on ${volumeCleared} docs, source on ${sourceCleared} docs.`)
}
