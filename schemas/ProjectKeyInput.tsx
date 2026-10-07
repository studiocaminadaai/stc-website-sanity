import {useEffect, useState} from 'react'
import {set, unset, useClient, type StringInputProps} from 'sanity'

type ProjectOption = {
  _id: string
  key: string
  name?: string
}

const uniqueProjects = (rows: ProjectOption[]) => {
  const byKey = new Map<string, ProjectOption>()
  for (const row of rows) {
    const current = byKey.get(row.key)
    const rowIsDraft = row._id.startsWith('drafts.')
    if (!current || (current._id.startsWith('drafts.') && !rowIsDraft)) {
      byKey.set(row.key, row)
    }
  }
  return [...byKey.values()].sort((a, b) =>
    String(a.name || a.key).localeCompare(String(b.name || b.key), undefined, {numeric: true})
  )
}

export function ProjectKeyInput(props: StringInputProps) {
  const {value, onChange, elementProps} = props
  const client = useClient({apiVersion: '2025-08-24'})
  const [projects, setProjects] = useState<ProjectOption[]>([])

  useEffect(() => {
    client
      .fetch<ProjectOption[]>(
        `*[_type == "project" && defined(projectKey)]{
          _id,
          "key": projectKey,
          name
        }`
      )
      .then((rows) => setProjects(uniqueProjects(rows || [])))
      .catch(() => setProjects([]))
  }, [client])

  const known = new Set(projects.map((project) => project.key))
  const staleValue = value && !known.has(value) ? value : null

  return (
    <div>
      <select
        id={elementProps.id}
        disabled={elementProps.readOnly}
        value={value || ''}
        onChange={(event) => {
          const next = event.currentTarget.value
          onChange(next ? set(next) : unset())
        }}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0.7rem 0.85rem',
          borderRadius: 4,
          fontSize: 15,
        }}
      >
        <option value="">— Site-wide —</option>
        {staleValue ? <option value={staleValue}>{staleValue} (not in project list)</option> : null}
        {projects.map((project) => (
          <option key={project.key} value={project.key}>
            {project.name ? `${project.name}` : project.key}
          </option>
        ))}
      </select>
      {value ? null : (
        <p style={{margin: '0.4rem 0 0', color: 'var(--card-muted-fg-color)', fontSize: 13}}>
          Creating from a project folder fills this in. Leave empty for site-wide.
        </p>
      )}
    </div>
  )
}
