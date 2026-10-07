import {useEffect, useRef, useState} from 'react'
import {set, useClient, useFormValue, type ArrayOfObjectsInputProps} from 'sanity'

type SectionOption = {
  _id: string
  id?: string
  title?: string
  template?: string
}

type SectionList = {
  order: string[]
  sections: SectionOption[]
}

const publishedId = (id?: string) => (id || '').replace(/^drafts\./, '')

const tokensFrom = (raw?: string) =>
  (raw || '').split(/[,;\s]+/).map((token) => token.trim()).filter(Boolean)

export function SectionRefInput(props: ArrayOfObjectsInputProps) {
  const {value, onChange, path, elementProps} = props
  const client = useClient({apiVersion: '2025-08-24'})
  const projectKey = useFormValue(['projectKey']) as string | undefined
  const legacyField = path[path.length - 1] === 'untilSections' ? 'until' : 'activateAt'
  const legacy = useFormValue([...path.slice(0, -1), legacyField]) as string | undefined
  const [sections, setSections] = useState<SectionOption[]>([])

  useEffect(() => {
    if (!projectKey) {
      setSections([])
      return
    }
    client
      .fetch<SectionList>(
        `{
          "order": *[_type == "project" && projectKey == $projectKey][0].sections[]._ref,
          "sections": *[_type == "section" && projectKey == $projectKey && !(_id in path("drafts.**"))]{
            _id, id, title, template
          }
        }`,
        {projectKey}
      )
      .then((result) => {
        const order = result?.order || []
        const rank = new Map(order.map((id, index) => [publishedId(id), index]))
        const list = [...(result?.sections || [])].sort((a, b) => {
          const ar = rank.has(publishedId(a._id)) ? rank.get(publishedId(a._id))! : 100000
          const br = rank.has(publishedId(b._id)) ? rank.get(publishedId(b._id))! : 100000
          return ar - br || (a.id || '').localeCompare(b.id || '', undefined, {numeric: true, sensitivity: 'base'})
        })
        setSections(list)
      })
      .catch(() => setSections([]))
  }, [client, projectKey])

  const stored = new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => publishedId((item as {_ref?: string})._ref))
      .filter(Boolean)
  )
  const hasStoredField = Array.isArray(value)

  const legacyIds = tokensFrom(legacy)
    .map((token) => sections.find((section) => section.id === token || publishedId(section._id) === token))
    .map((section) => (section ? publishedId(section._id) : ''))
    .filter(Boolean)

  const selected = hasStoredField ? stored : new Set(legacyIds)
  const didUpgrade = useRef(false)

  const write = (nextIds: string[]) => {
    onChange(set(nextIds.map((ref) => ({
      _type: 'reference',
      _ref: ref,
      _key: ref.replace(/[^A-Za-z0-9]/g, '').slice(-32) || ref,
    }))))
  }

  useEffect(() => {
    if (didUpgrade.current || elementProps.readOnly || hasStoredField || !legacyIds.length) return
    didUpgrade.current = true
    write(legacyIds)
  }, [elementProps.readOnly, hasStoredField, legacyIds.join('|')])

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    const known = sections.map((section) => publishedId(section._id))
    const ordered = known.filter((ref) => next.has(ref))
    selected.forEach((ref) => {
      if (!known.includes(ref) && next.has(ref)) ordered.push(ref)
    })
    write(ordered)
  }

  return (
    <div id={elementProps.id} style={{display: 'grid', gap: 6}}>
      {sections.length === 0 ? (
        <div style={{opacity: 0.7}}>No sections in this project yet.</div>
      ) : sections.map((section) => {
        const id = publishedId(section._id)
        const label = section.id || section.title || id
        return (
          <label key={id} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <input
              type="checkbox"
              disabled={Boolean(elementProps.readOnly)}
              checked={selected.has(id)}
              onChange={() => toggle(id)}
            />
            <span>
              {label}
              {section.title && section.id ? ` — ${section.title}` : ''}
            </span>
          </label>
        )
      })}
    </div>
  )
}
