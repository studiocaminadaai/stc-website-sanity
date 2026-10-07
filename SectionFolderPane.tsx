import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {usePaneRouter, type UserComponent} from 'sanity/structure'
import {Box, Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'

type SectionRow = {
  _id: string
  _updatedAt?: string
  title?: string
  id?: string
  template?: string
  projectKey?: string
}

type FolderOptions = {
  projectKey?: string
  siteWide?: boolean
}

const publishedId = (id: string) => id.replace(/^drafts\./, '')

const idSortKey = (id?: string) => {
  const raw = String(id || '').trim()
  const match = raw.match(/^([A-Za-z]*)(\d+)(.*)$/)
  if (!match) return `~${raw.toLowerCase()}`
  const prefix = (match[1] || '#').toUpperCase()
  return `${prefix}-${String(Number(match[2])).padStart(8, '0')}-${match[3].toLowerCase()}`
}

const uniqueRows = (rows: SectionRow[]) => {
  const byId = new Map<string, SectionRow>()
  for (const row of rows) {
    const key = publishedId(row._id)
    const current = byId.get(key)
    if (!current || row._id.startsWith('drafts.')) {
      byId.set(key, row)
    }
  }
  return [...byId.values()]
}

export const SectionFolderPane: UserComponent = (props) => {
  const options = (props.options || {}) as FolderOptions
  const client = useClient({apiVersion: '2025-08-24'})
  const {ChildLink} = usePaneRouter()
  const [rows, setRows] = useState<SectionRow[]>([])
  const [sort, setSort] = useState<'id' | 'updated'>('id')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = options.siteWide ? {} : {key: options.projectKey || ''}
    const filter = options.siteWide
      ? '_type == "section" && (!defined(projectKey) || projectKey == "")'
      : '_type == "section" && projectKey == $key'
    const query = `*[${filter}]{_id,_updatedAt,title,id,template,projectKey}`

    const load = () =>
      client.fetch<SectionRow[]>(query, params).then((result) => setRows(uniqueRows(result || [])))

    load().catch(() => setRows([]))
    const sub = client.listen(`*[${filter}]`, params).subscribe({
      next: () => {
        load().catch(() => {})
      },
    })
    return () => sub.unsubscribe()
  }, [client, options.projectKey, options.siteWide])

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const filtered = needle
      ? rows.filter((row) =>
          [row.title, row.id, row.template, row.projectKey]
            .join(' ')
            .toLowerCase()
            .includes(needle)
        )
      : rows
    const next = [...filtered]
    if (sort === 'updated') {
      next.sort((a, b) => String(b._updatedAt || '').localeCompare(String(a._updatedAt || '')))
    } else {
      next.sort((a, b) => {
        const byId = idSortKey(a.id).localeCompare(idSortKey(b.id), undefined, {numeric: true})
        if (byId) return byId
        return String(a.title || '').localeCompare(String(b.title || ''))
      })
    }
    return next
  }, [rows, search, sort])

  return (
    <Box padding={3}>
      <Stack space={3}>
        <TextInput
          value={search}
          placeholder="Search list"
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <Flex gap={2} wrap="wrap">
          <Button
            mode={sort === 'id' ? 'default' : 'ghost'}
            text="Section ID"
            onClick={() => setSort('id')}
          />
          <Button
            mode={sort === 'updated' ? 'default' : 'ghost'}
            text="Latest change"
            onClick={() => setSort('updated')}
          />
        </Flex>
        <Stack space={1}>
          {visible.map((row) => {
            const docId = publishedId(row._id)
            const selected = props.childItemId === docId
            return (
              <ChildLink key={docId} childId={docId}>
                <Card
                  as="span"
                  padding={3}
                  radius={2}
                  tone={selected ? 'primary' : 'transparent'}
                  selected={selected}
                >
                  <Stack space={2}>
                    <Text size={1} weight="medium">
                      {row.title || 'Untitled Section'}
                    </Text>
                    <Text size={1} muted>
                      {row.projectKey || 'Site-wide'} | {row.id || 'None'}
                    </Text>
                  </Stack>
                </Card>
              </ChildLink>
            )
          })}
          {visible.length === 0 ? (
            <Text size={1} muted>
              No sections in this list.
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  )
}
