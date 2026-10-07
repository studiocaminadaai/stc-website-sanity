import {getOrderingMenuItem, type StructureBuilder, type StructureResolver} from 'sanity/structure'

type ProjectFolder = {
  _id: string
  name?: string
  projectKey: string
}

const uniqueProjects = (rows: ProjectFolder[]) => {
  const byKey = new Map<string, ProjectFolder>()
  for (const row of rows) {
    const current = byKey.get(row.projectKey)
    const rowIsDraft = row._id.startsWith('drafts.')
    if (!current || (current._id.startsWith('drafts.') && !rowIsDraft)) {
      byKey.set(row.projectKey, row)
    }
  }
  return [...byKey.values()]
}

const sectionSortMenu = (context: Parameters<StructureResolver>[1]) => [
  getOrderingMenuItem(context, {
    name: 'sectionIdAsc',
    title: 'Section ID',
    by: [{field: 'idSort', direction: 'asc'}, {field: 'id', direction: 'asc'}],
  })
    .showAsAction(true)
    .group('sorting'),
  getOrderingMenuItem(context, {
    name: 'updatedDesc',
    title: 'Latest change',
    by: [{field: '_updatedAt', direction: 'desc'}],
  })
    .showAsAction(true)
    .group('sorting'),
]

const sectionDocumentList = (
  S: StructureBuilder,
  context: Parameters<StructureResolver>[1],
  options: {
    title: string
    filter: string
    params?: Record<string, string>
    template?: string
    templateParams?: Record<string, string>
  }
) => {
  let list = S.documentTypeList('section')
    .title(options.title)
    .filter(options.filter)
    .defaultOrdering([{field: 'idSort', direction: 'asc'}, {field: 'id', direction: 'asc'}])
    .menuItems(sectionSortMenu(context))
    .menuItemGroups([{id: 'sorting', title: 'Sort'}])

  if (options.params) {
    list = list.params(options.params)
  }
  if (options.template) {
    list = list.initialValueTemplates([
      S.initialValueTemplateItem(options.template, options.templateParams),
    ])
  }
  return list
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.listItem()
        .title('Sections')
        .id('sections-root')
        .schemaType('section')
        .child(async () => {
          const client = context.getClient({apiVersion: '2025-08-24'})
          const rows = await client.fetch<ProjectFolder[]>(
            `*[_type == "project" && defined(projectKey)] | order(name asc){
              _id,
              name,
              "projectKey": projectKey
            }`
          )
          const projects = uniqueProjects(rows)

          return S.list()
            .title('Sections')
            .items([
              S.listItem()
                .title('All sections')
                .id('all-sections')
                .child(
                  S.documentTypeList('section')
                    .title('All sections')
                    .defaultOrdering([{field: 'idSort', direction: 'asc'}, {field: 'id', direction: 'asc'}])
                    .menuItems(sectionSortMenu(context))
                    .menuItemGroups([{id: 'sorting', title: 'Sort'}])
                ),
              S.divider(),
              ...projects.map((project) => {
                const title = project.name || project.projectKey
                return S.listItem()
                  .title(title)
                  .id(`sections-project-${project.projectKey}`)
                  .schemaType('section')
                  .child(
                    sectionDocumentList(S, context, {
                      title,
                      filter: '_type == "section" && projectKey == $key',
                      params: {key: project.projectKey},
                      template: 'section-for-project',
                      templateParams: {projectKey: project.projectKey},
                    })
                  )
              }),
              S.divider(),
              S.listItem()
                .title('Site-wide')
                .id('sections-sitewide')
                .schemaType('section')
                .child(
                  sectionDocumentList(S, context, {
                    title: 'Site-wide',
                    filter: '_type == "section" && (!defined(projectKey) || projectKey == "")',
                    template: 'section-site-wide',
                  })
                ),
            ])
        }),
      S.documentTypeListItem('siteConfig').title('Site Config'),
      S.documentTypeListItem('fontResource').title('Font Resources'),
      S.documentTypeListItem('effectResource').title('Effect Resources'),
    ])
