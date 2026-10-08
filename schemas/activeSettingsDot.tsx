import {Fragment, useState, type ReactNode} from 'react'
import {
  FormFieldSet,
  ObjectInputMember,
  isArrayOfObjectsInputProps,
  isObjectInputProps,
  type FieldProps,
  type InputProps,
  type ObjectFieldProps,
  type ObjectInputProps,
  type ObjectMember,
} from 'sanity'

const RESPONSIVE_TYPE_FIELDSETS = new Set([
  'h1Config',
  'h2Config',
  'h3Config',
  'h4Config',
  'h5Config',
  'normalConfig',
  'quoteConfig',
])

const PROJECT_SEO_FIELDSETS = new Set(['semanticConfig', 'seoConfig'])

const SITE_TYPOGRAPHY_FIELDSETS = [
  'typeGlobalH1',
  'typeGlobalH2',
  'typeGlobalH3',
  'typeGlobalH4',
  'typeGlobalH5',
  'typeGlobalNormal',
  'typeGlobalQuote',
  'captionConfig',
] as const

const SITE_TYPOGRAPHY_FIELDSET_SET = new Set<string>(SITE_TYPOGRAPHY_FIELDSETS)

const SITE_TEMPLATE_FIELDSETS = [
  'containerConfigT',
  'containerConfigTNew',
  'containerConfigLong',
] as const

const SITE_TEMPLATE_Z_FIELDSETS = ['socialConfig', 'infoConfig'] as const

const SITE_COMPANY_FIELDSETS = ['oremConfig', 'globalButtonConfig', 'companyConfig'] as const
const SITE_COMPANY_FIELDSET_SET = new Set<string>(SITE_COMPANY_FIELDSETS)

const SECTION_MEDIA_FIELDSETS = ['desktopMediaConfig', 'mobileMediaConfig', 'mediaScaleConfig'] as const
const SECTION_MEDIA_FIELDSET_SET = new Set<string>(SECTION_MEDIA_FIELDSETS)

const SECTION_LOGO_FIELDSETS = ['logoTemplateConfig', 'logoLookConfig', 'logoSizeConfig'] as const
const SECTION_LOGO_FIELDSET_SET = new Set<string>(SECTION_LOGO_FIELDSETS)

const MEDIA_ITEM_SINGLE_FIELDSETS = [
  'cover',
  'stillZoom',
  'endFrame',
  'video',
  'sequence',
  'sequencePlay',
  'hotspot',
  'audio',
  'caption',
] as const
const MEDIA_ITEM_SINGLE_FIELDSET_SET = new Set<string>(MEDIA_ITEM_SINGLE_FIELDSETS)

const MEDIA_ITEM_CAROUSEL_HEAD = new Set(['carouselSlides', 'carouselMouseScroll', 'carouselMode'])

const BREAKPOINTS = [
  {key: 'MobileLandscapeSmall', title: 'Mobile Landscape Small (Height Under 400px)'},
  {key: 'MobilePortraitSmall', title: 'Mobile Portrait Small (≤ 375px)'},
  {key: 'TabletLandscape', title: 'Tablet Landscape (901px – 1024px)'},
  {key: 'TabletPortrait', title: 'Tablet Portrait (769px – 900px)'},
  {key: 'MobileLandscape', title: 'Mobile Landscape (Height Under 900px)'},
  {key: 'MobilePortrait', title: 'Mobile Portrait (376px – 768px)'},
  {key: 'Desktop', title: 'Desktop (> 1600px)'},
  {key: 'Laptop', title: 'Laptop (1025px – 1600px)'},
] as const

const BREAKPOINT_ORDER = [
  'Desktop',
  'Laptop',
  'TabletLandscape',
  'TabletPortrait',
  'MobileLandscape',
  'MobileLandscapeSmall',
  'MobilePortrait',
  'MobilePortraitSmall',
] as const

type FieldLikeMember = Extract<ObjectMember, {kind: 'field'}>
type FieldSetLikeMember = Extract<ObjectMember, {kind: 'fieldSet'}>

const matchBreakpointKey = (name: string) => {
  for (const item of BREAKPOINTS) {
    if (name.length > item.key.length && name.endsWith(item.key)) return item.key
  }
  return null
}

const isFieldVisible = (member: ObjectMember) => {
  if (member.kind !== 'field') return member.kind !== 'fieldSet' || !member.fieldSet.hidden
  return !(member.field as {hidden?: boolean}).hidden
}

const fieldTitle = (member: FieldLikeMember) =>
  String((member.field as {schemaType?: {title?: string}}).schemaType?.title || member.name)

const stripBreakpointLabel = (title: string, key: string) => {
  const labeled = String(title || '')
  const firstDash = labeled.search(/\s[-–—]\s/)
  if (firstDash >= 0) {
    const head = labeled.slice(0, firstDash).trim()
    const tail = labeled.slice(firstDash).replace(/^\s[-–—]\s/, '')
    if (
      tail.includes(key) ||
      /\d+\s*px|Mobile|Tablet|Laptop|Desktop|Big Screen|Portrait|Landscape/i.test(tail)
    ) {
      return head.replace(/\s+\([^)]*\)\s*$/, '').trim()
    }
  }
  return labeled
    .replace(new RegExp(`\\s*\\(${key}\\)\\s*$`), '')
    .replace(/\s*\(\d+\.\s*[^)]+\)\s*$/, '')
    .trim()
}

const humanizeFieldName = (name: string, key: string) => {
  const base = name.endsWith(key) ? name.slice(0, -key.length) : name
  const cleaned = base
    .replace(/^(fs|masterBtn)/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return name
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

const compactFieldTitle = (member: FieldLikeMember, key: string) => {
  const stripped = stripBreakpointLabel(fieldTitle(member), key)
  if (!stripped || stripped === key || BREAKPOINTS.some((item) => item.title === stripped)) {
    return humanizeFieldName(member.name, key)
  }
  return stripped.replace(/^\u2B50\s*MASTER\s+/i, '').trim()
}

const withCompactTitle = (member: FieldLikeMember, key: string): FieldLikeMember => {
  const title = compactFieldTitle(member, key)
  const schemaType = (member.field as {schemaType?: Record<string, unknown>}).schemaType || {}
  return {
    ...member,
    field: {
      ...member.field,
      schemaType: {
        ...schemaType,
        title,
        description: undefined,
      },
    },
  }
}

const withFieldTitle = (member: FieldLikeMember, title: string): FieldLikeMember => {
  const schemaType = (member.field as {schemaType?: Record<string, unknown>}).schemaType || {}
  return {
    ...member,
    field: {
      ...member.field,
      schemaType: {
        ...schemaType,
        title,
      },
    },
  }
}

const isOpacityNameForColor = (colorName: string, opacityName: string) => {
  if (!/opacity$/i.test(opacityName)) return false
  if (colorName.replace(/Color$/i, 'Opacity') === opacityName) return true
  if (`${colorName}Opacity` === opacityName) return true
  return false
}

const pairFoldTitle = (colorMember: FieldLikeMember) => {
  const titled = fieldTitle(colorMember)
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/\s+color$/i, '')
    .replace(/\s+base$/i, '')
    .trim()
  return titled || 'Background'
}

const splitBreakpointFields = (members: ObjectMember[]) => {
  const shared: ObjectMember[] = []
  const groups = new Map<string, FieldLikeMember[]>()
  for (const member of members) {
    if (member.kind === 'field') {
      if (!isFieldVisible(member)) continue
      const key = matchBreakpointKey(member.name)
      if (key) {
        const list = groups.get(key) || []
        list.push(withCompactTitle(member, key))
        groups.set(key, list)
        continue
      }
    }
    shared.push(member)
  }
  return {shared, groups}
}

const shouldGroupBreakpoints = (members: ObjectMember[]) => {
  const keys = new Set<string>()
  for (const member of members) {
    if (member.kind !== 'field' || !isFieldVisible(member)) continue
    const key = matchBreakpointKey(member.name)
    if (key) keys.add(key)
  }
  return keys.size >= 4
}

const SKIP_KEYS = new Set([
  '_type',
  '_key',
  '_id',
  '_rev',
  '_updatedAt',
  '_createdAt',
  '_weak',
  '_originalId',
])

const SKIP_STRINGS = new Set([
  'sanity',
  'external',
  'vimeo',
  'youtube',
  'original',
  'center',
  'scroll',
  'stop',
  'first',
  'last',
  'none',
  'normal',
  'tracks',
  'fade',
  'up',
  'down',
  'parallax',
  'pinned',
  'every_time',
  '.webp',
  '.jpg',
  '.png',
  'webp',
  'jpg',
  'png',
  'auto',
  'inherit',
  'timed',
  'sequence',
  'from-left',
  'from-right',
  'from-top',
  'from-bottom',
  'to-left',
  'to-right',
  'to-top',
  'to-bottom',
])

const SettingsDot = () => (
  <span
    title="Has settings"
    aria-label="Has settings"
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      marginLeft: 8,
      borderRadius: '50%',
      background: 'var(--card-badge-positive-dot-color)',
      boxShadow: '0 0 0 1px var(--card-bg-color)',
      flexShrink: 0,
    }}
  />
)

const withDot = (title: unknown, active: boolean) => {
  if (!active) return title
  return (
    <span style={{display: 'inline-flex', alignItems: 'center'}}>
      <span>{title as any}</span>
      <SettingsDot />
    </span>
  )
}

const isActiveValue = (value: unknown): boolean => {
  if (value == null || value === '') return false
  if (typeof value === 'boolean') return value === true
  if (typeof value === 'number') return true
  if (typeof value === 'string') {
    const text = value.trim()
    return Boolean(text) && !SKIP_STRINGS.has(text)
  }
  if (Array.isArray(value)) {
    return value.some((item) => {
      if (item && typeof item === 'object' && (item as any)._type === 'block') {
        return ((item as any).children || []).some((child: any) => String(child?.text || '').trim())
      }
      return isActiveValue(item)
    })
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (record.asset) return true
    if (record._type === 'image' || record._type === 'file') {
      return Boolean(record.asset) || isActiveValue(record.url)
    }
    if (typeof record._ref === 'string' && record._ref) return true
    return Object.entries(record).some(([key, nested]) => {
      if (SKIP_KEYS.has(key)) return false
      return isActiveValue(nested)
    })
  }
  return false
}

const membersAreActive = (members?: ObjectMember[]): boolean => {
  if (!members?.length) return false
  return members.some((member) => {
    if (member.kind === 'fieldSet') return membersAreActive(member.fieldSet.members as ObjectMember[])
    if (member.kind !== 'field') return false
    const node = member.field as {members?: ObjectMember[]; value?: unknown}
    if (Array.isArray(node.members) && node.members.length) return membersAreActive(node.members)
    return isActiveValue(node.value)
  })
}

const annotateFieldsets = (members: ObjectMember[]): ObjectMember[] =>
  members.map((member) => {
    if (member.kind !== 'fieldSet' || !member.fieldSet.collapsible) return member
    const active = membersAreActive(member.fieldSet.members as ObjectMember[])
    if (!active) return member
    return {
      ...member,
      fieldSet: {
        ...member.fieldSet,
        title: withDot(member.fieldSet.title || member.fieldSet.name, true) as any,
      },
    }
  })

function ObjectMemberView({
  member,
  props,
}: {
  member: ObjectMember
  props: ObjectInputProps
}) {
  return (
    <ObjectInputMember
      member={member}
      renderAnnotation={props.renderAnnotation}
      renderBlock={props.renderBlock}
      renderField={props.renderField}
      renderInlineBlock={props.renderInlineBlock}
      renderInput={props.renderInput}
      renderItem={props.renderItem}
      renderPreview={props.renderPreview}
    />
  )
}

function AccordionNote({text}: {text?: string}) {
  if (!text) return null
  return <p className="stc-accordion-note">{text}</p>
}

function BreakpointPacks({
  groups,
  props,
  pathBase,
  level,
}: {
  groups: Map<string, FieldLikeMember[]>
  props: ObjectInputProps
  pathBase: Array<string | number>
  level: number
}) {
  return (
    <div className="stc-bp-packs">
      {BREAKPOINT_ORDER.map((key) => {
        const fields = groups.get(key)
        if (!fields?.length) return null
        const label = BREAKPOINTS.find((item) => item.key === key)?.title || key
        return (
          <BreakpointFold
            key={key}
            title={label}
            members={fields}
            props={props}
            path={[...pathBase, key]}
            inputId={`${props.id}-${key}`}
            level={level}
          />
        )
      })}
    </div>
  )
}

function SettingsFold({
  title,
  members,
  props,
  path,
  inputId,
  level,
  kind,
}: {
  title: string
  members: ObjectMember[]
  props: ObjectInputProps
  path: Array<string | number>
  inputId: string
  level: number
  kind: 'bp' | 'group'
}) {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <FormFieldSet
      title={withDot(title, membersAreActive(members)) as any}
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(true)}
      onExpand={() => setCollapsed(false)}
      level={level}
      inputId={inputId}
      path={path}
      data-stc-accordion={kind}
      className={kind === 'bp' ? 'stc-accordion-bp' : 'stc-accordion-group'}
      {...(!collapsed ? {'data-stc-open': ''} : {})}
    >
      {members.map((member) => (
        <ObjectMemberView key={member.key} member={member} props={props} />
      ))}
    </FormFieldSet>
  )
}

function BreakpointFold({
  title,
  members,
  props,
  path,
  inputId,
  level,
}: {
  title: string
  members: ObjectMember[]
  props: ObjectInputProps
  path: Array<string | number>
  inputId: string
  level: number
}) {
  return (
    <SettingsFold
      title={title}
      members={members}
      props={props}
      path={path}
      inputId={inputId}
      level={level}
      kind="bp"
    />
  )
}

function StudioFieldset({
  member,
  props,
}: {
  member: FieldSetLikeMember
  props: ObjectInputProps
}) {
  const [collapsed, setCollapsed] = useState(member.fieldSet.collapsed !== false)
  const grouped = shouldGroupBreakpoints(member.fieldSet.members as ObjectMember[])
  const {shared, groups} = grouped
    ? splitBreakpointFields(member.fieldSet.members as ObjectMember[])
    : {shared: member.fieldSet.members as ObjectMember[], groups: new Map<string, FieldLikeMember[]>()}

  return (
    <FormFieldSet
      title={(member.fieldSet.title || member.fieldSet.name) as any}
      collapsible={member.fieldSet.collapsible}
      collapsed={collapsed}
      onCollapse={() => setCollapsed(true)}
      onExpand={() => setCollapsed(false)}
      level={member.fieldSet.level}
      inputId={member.fieldSet.name}
      path={member.fieldSet.path}
      data-stc-accordion="group"
      className="stc-accordion-group"
      {...(!collapsed ? {'data-stc-open': ''} : {})}
    >
      <AccordionNote text={member.fieldSet.description} />
      <PackedMembersView
        members={groupColorOpacityPairs(
          shared,
          props,
          String(member.fieldSet.title || member.fieldSet.name),
          (member.fieldSet.level || 0) + 1
        )}
        props={props}
      />
      {grouped ? (
        <BreakpointPacks
          groups={groups}
          props={props}
          pathBase={[...member.fieldSet.path, '_bp']}
          level={(member.fieldSet.level || 0) + 1}
        />
      ) : null}
    </FormFieldSet>
  )
}

function MemberNode({
  member,
  props,
}: {
  member: ObjectMember
  props: ObjectInputProps
}) {
  if (member.kind === 'decoration') {
    return member.component
  }
  if (member.kind === 'fieldSet') {
    return <StudioFieldset member={member} props={props} />
  }
  return <ObjectMemberView member={member} props={props} />
}

function PackedMembersView({
  members,
  props,
}: {
  members: ObjectMember[]
  props: ObjectInputProps
}) {
  const nodes: ReactNode[] = []
  let foldRun: ObjectMember[] = []

  const flushFolds = () => {
    if (!foldRun.length) return
    const run = foldRun
    foldRun = []
    nodes.push(
      <div className="stc-nested-packs" key={`folds-${run[0].key}`}>
        {run.map((member) => (
          <MemberNode key={member.key} member={member} props={props} />
        ))}
      </div>
    )
  }

  for (const member of members) {
    if (member.kind === 'fieldSet' || member.kind === 'decoration') {
      foldRun.push(member)
      continue
    }
    flushFolds()
    nodes.push(<MemberNode key={member.key} member={member} props={props} />)
  }
  flushFolds()
  return <>{nodes}</>
}

function ObjectMembersView({
  members,
  props,
}: {
  members: ObjectMember[]
  props: ObjectInputProps
}) {
  return (
    <>
      {members.map((member) => {
        if (member.kind === 'decoration') {
          return <Fragment key={member.key}>{member.component}</Fragment>
        }
        return <ObjectMemberView key={member.key} member={member} props={props} />
      })}
    </>
  )
}

const groupColorOpacityPairs = (
  members: ObjectMember[],
  props: ObjectInputProps,
  parentTitle?: string,
  level?: number
): ObjectMember[] => {
  const result: ObjectMember[] = []
  const foldLevel = level ?? (props.level || 0) + 1

  for (let index = 0; index < members.length; index += 1) {
    const current = members[index]
    const next = members[index + 1]
    if (
      current.kind === 'field' &&
      next?.kind === 'field' &&
      isFieldVisible(current) &&
      isFieldVisible(next) &&
      /Color$/i.test(current.name) &&
      isOpacityNameForColor(current.name, next.name)
    ) {
      const title = pairFoldTitle(current)
      if (parentTitle && title.toLowerCase() === parentTitle.toLowerCase()) {
        result.push(current, next)
        index += 1
        continue
      }
      result.push({
        kind: 'decoration',
        key: `pair-${current.key}`,
        component: (
          <SettingsFold
            title={title}
            members={[withFieldTitle(current, 'Color'), withFieldTitle(next, 'Opacity')]}
            props={props}
            path={[...props.path, '_pair', current.name]}
            inputId={`${props.id}-pair-${current.name}`}
            level={foldLevel}
            kind="group"
          />
        ),
      } as ObjectMember)
      index += 1
      continue
    }
    result.push(current)
  }
  return result
}

const groupRootBreakpointRuns = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  const result: ObjectMember[] = []
  let run: FieldLikeMember[] = []

  const flushRun = () => {
    if (!run.length) return
    if (!shouldGroupBreakpoints(run)) {
      result.push(...run)
      run = []
      return
    }
    const {groups} = splitBreakpointFields(run)
    result.push({
      kind: 'decoration',
      key: `bp-run-${run[0].key}`,
      component: (
        <BreakpointPacks
          groups={groups}
          props={props}
          pathBase={[...props.path, '_bp', run[0].name]}
          level={(props.level || 0) + 1}
        />
      ),
    } as ObjectMember)
    run = []
  }

  for (const member of members) {
    if (member.kind === 'field' && matchBreakpointKey(member.name) && isFieldVisible(member)) {
      run.push(member)
      continue
    }
    flushRun()
    result.push(member)
  }
  flushRun()
  return result
}

const decorateGroupedFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] =>
  members.map((member) => {
    if (member.kind !== 'fieldSet' || member.fieldSet.hidden) {
      return member
    }
    return {
      kind: 'decoration',
      key: member.key,
      component: <StudioFieldset member={member} props={props} />,
    } as ObjectMember
  })

const collectNamedFieldsets = (members: ObjectMember[], names: ReadonlySet<string>) =>
  members.filter(
    (member): member is FieldSetLikeMember =>
      member.kind === 'fieldSet' && !member.fieldSet.hidden && names.has(member.fieldSet.name)
  )

const wrapNamedFieldsets = (
  members: ObjectMember[],
  names: ReadonlySet<string>,
  insert: (collected: FieldSetLikeMember[]) => ObjectMember
): ObjectMember[] => {
  const collected = collectNamedFieldsets(members, names)
  if (!collected.length) return members

  const result: ObjectMember[] = []
  let inserted = false
  for (const member of members) {
    if (member.kind === 'fieldSet' && names.has(member.fieldSet.name)) {
      if (!inserted) {
        result.push(insert(collected))
        inserted = true
      }
      continue
    }
    result.push(member)
  }
  return result
}

const wrapProjectSeoFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  if (props.schemaType.name !== 'project') return members
  return wrapNamedFieldsets(members, PROJECT_SEO_FIELDSETS, (seo) => ({
    kind: 'decoration',
    key: 'project-seo-wrap',
    component: <ProjectSeoFold members={seo} props={props} />,
  } as ObjectMember))
}

const wrapSiteFieldsetGroup = (
  members: ObjectMember[],
  props: ObjectInputProps,
  names: readonly string[],
  nameSet: ReadonlySet<string>,
  options: {title: string; key: string; inputId: string; pathKey: string}
): ObjectMember[] => {
  if (props.schemaType.name !== 'siteConfig') return members
  return wrapNamedFieldsets(members, nameSet, (collected) => {
    const ordered = names
      .map((name) => collected.find((member) => member.fieldSet.name === name))
      .filter((member): member is FieldSetLikeMember => Boolean(member))
    return {
      kind: 'decoration',
      key: options.key,
      component: (
        <ParentSettingsFold
          title={options.title}
          members={ordered}
          props={props}
          inputId={options.inputId}
          pathKey={options.pathKey}
        />
      ),
    } as ObjectMember
  })
}

const wrapSiteTypographyFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] =>
  wrapSiteFieldsetGroup(members, props, SITE_TYPOGRAPHY_FIELDSETS, SITE_TYPOGRAPHY_FIELDSET_SET, {
    title: 'Typography Settings (Global)',
    key: 'site-typography-wrap',
    inputId: 'siteTypography',
    pathKey: '_siteTypography',
  })

const wrapSiteTemplateFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  if (props.schemaType.name !== 'siteConfig') return members
  const allSet = new Set<string>([...SITE_TEMPLATE_FIELDSETS, ...SITE_TEMPLATE_Z_FIELDSETS])
  return wrapNamedFieldsets(members, allSet, (collected) => {
    const tFolds = SITE_TEMPLATE_FIELDSETS.map((name) =>
      collected.find((member) => member.fieldSet.name === name)
    ).filter((member): member is FieldSetLikeMember => Boolean(member))
    const zFolds = SITE_TEMPLATE_Z_FIELDSETS.map((name) =>
      collected.find((member) => member.fieldSet.name === name)
    ).filter((member): member is FieldSetLikeMember => Boolean(member))
    const inner: ObjectMember[] = [...tFolds]
    if (zFolds.length) {
      inner.push({
        kind: 'decoration',
        key: 'site-template-z-wrap',
        component: (
          <ParentSettingsFold
            title="Z: Company footer"
            members={zFolds}
            props={props}
            inputId="siteTemplateZ"
            pathKey="_siteTemplateZ"
          />
        ),
      } as ObjectMember)
    }
    return {
      kind: 'decoration',
      key: 'site-template-wrap',
      component: (
        <ParentSettingsFold
          title="Template Settings (Global)"
          members={inner}
          props={props}
          inputId="siteTemplates"
          pathKey="_siteTemplates"
        />
      ),
    } as ObjectMember
  })
}

const wrapSiteCompanyFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] =>
  wrapSiteFieldsetGroup(members, props, SITE_COMPANY_FIELDSETS, SITE_COMPANY_FIELDSET_SET, {
    title: 'Company Settings (Global)',
    key: 'site-company-wrap',
    inputId: 'siteCompany',
    pathKey: '_siteCompany',
  })

const wrapSectionMediaFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  if (props.schemaType.name !== 'section') return members
  return wrapNamedFieldsets(members, SECTION_MEDIA_FIELDSET_SET, (collected) => {
    const ordered = SECTION_MEDIA_FIELDSETS.map((name) =>
      collected.find((member) => member.fieldSet.name === name)
    ).filter((member): member is FieldSetLikeMember => Boolean(member))
    return {
      kind: 'decoration',
      key: 'section-media-wrap',
      component: (
        <ParentSettingsFold
          title="Media Settings"
          members={ordered}
          props={props}
          inputId="sectionMedia"
          pathKey="_sectionMedia"
        />
      ),
    } as ObjectMember
  })
}

const wrapSectionLogoFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  if (props.schemaType.name !== 'section') return members
  return wrapNamedFieldsets(members, SECTION_LOGO_FIELDSET_SET, (collected) => {
    const ordered = SECTION_LOGO_FIELDSETS.map((name) =>
      collected.find((member) => member.fieldSet.name === name)
    ).filter((member): member is FieldSetLikeMember => Boolean(member))
    return {
      kind: 'decoration',
      key: 'section-logo-wrap',
      component: (
        <ParentSettingsFold
          title="L: Logo"
          members={ordered}
          props={props}
          inputId="sectionLogo"
          pathKey="_sectionLogo"
        />
      ),
    } as ObjectMember
  })
}

const wrapMediaItemSingleFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  if (props.schemaType.name !== 'mediaItem') return members
  return wrapNamedFieldsets(members, MEDIA_ITEM_SINGLE_FIELDSET_SET, (collected) => {
    const ordered = MEDIA_ITEM_SINGLE_FIELDSETS.map((name) =>
      collected.find((member) => member.fieldSet.name === name)
    ).filter((member): member is FieldSetLikeMember => Boolean(member))
    return {
      kind: 'decoration',
      key: 'media-item-single-wrap',
      component: (
        <ParentSettingsFold
          title="Single Media"
          members={ordered}
          props={props}
          inputId="mediaSingle"
          pathKey="_mediaSingle"
        />
      ),
    } as ObjectMember
  })
}

const wrapMediaItemCarouselFieldsets = (members: ObjectMember[], props: ObjectInputProps): ObjectMember[] => {
  if (props.schemaType.name !== 'mediaItem') return members
  const carousel = members.find(
    (member): member is FieldSetLikeMember =>
      member.kind === 'fieldSet' && !member.fieldSet.hidden && member.fieldSet.name === 'carousel'
  )
  const timed = members.find(
    (member): member is FieldSetLikeMember =>
      member.kind === 'fieldSet' && !member.fieldSet.hidden && member.fieldSet.name === 'carouselTimed'
  )
  if (!carousel && !timed) return members

  const carouselFields = (carousel?.fieldSet.members || []) as ObjectMember[]
  const head = carouselFields.filter(
    (member) => member.kind === 'field' && MEDIA_ITEM_CAROUSEL_HEAD.has(member.name)
  )
  const tail = carouselFields.filter(
    (member) => !(member.kind === 'field' && MEDIA_ITEM_CAROUSEL_HEAD.has(member.name))
  )
  const inner = [...head, ...(timed ? [timed] : []), ...tail]

  const wrap: ObjectMember = {
    kind: 'decoration',
    key: 'media-item-carousel-wrap',
    component: (
      <ParentSettingsFold
        title="Carousel"
        members={inner}
        props={props}
        inputId="mediaCarousel"
        pathKey="_mediaCarousel"
      />
    ),
  } as ObjectMember

  const result: ObjectMember[] = []
  let inserted = false
  for (const member of members) {
    if (
      member.kind === 'fieldSet' &&
      (member.fieldSet.name === 'carousel' || member.fieldSet.name === 'carouselTimed')
    ) {
      if (!inserted) {
        result.push(wrap)
        inserted = true
      }
      continue
    }
    result.push(member)
  }
  return result
}

export function BareObjectField(props: FieldProps) {
  return props.renderDefault({
    ...props,
    title: undefined,
    description: undefined,
    collapsible: false,
  } as any)
}

export function ActiveSettingsField(props: FieldProps) {
  if (!('collapsible' in props) || !props.collapsible) {
    return props.renderDefault(props)
  }

  const objectProps = props as ObjectFieldProps
  const members = objectProps.inputProps?.members
  const active = members?.length ? membersAreActive(members) : isActiveValue(props.value)

  return props.renderDefault({
    ...props,
    title: active ? (withDot(props.title, true) as any) : props.title,
  })
}

function ProjectSeoFold({
  members,
  props,
}: {
  members: ObjectMember[]
  props: ObjectInputProps
}) {
  return (
    <ParentSettingsFold
      title="SEO"
      members={members}
      props={props}
      inputId="projectSeo"
      pathKey="_projectSeo"
    />
  )
}

function ParentSettingsFold({
  title,
  members,
  props,
  inputId,
  pathKey,
}: {
  title: string
  members: ObjectMember[]
  props: ObjectInputProps
  inputId: string
  pathKey: string
}) {
  const [collapsed, setCollapsed] = useState(true)
  const labeled = withDot(title, membersAreActive(members))

  return (
    <FormFieldSet
      title={labeled as any}
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(true)}
      onExpand={() => setCollapsed(false)}
      level={props.level}
      inputId={`${props.id}-${inputId}`}
      path={[...props.path, pathKey]}
      data-stc-accordion="group"
      className="stc-accordion-group"
      {...(!collapsed ? {'data-stc-open': ''} : {})}
    >
      <PackedMembersView members={members} props={props} />
    </FormFieldSet>
  )
}

function HTemplateResponsiveFold({
  members,
  props,
}: {
  members: ObjectMember[]
  props: ObjectInputProps
}) {
  const [collapsed, setCollapsed] = useState(true)
  const title = withDot('H Template Responsive Settings', membersAreActive(members))

  return (
    <FormFieldSet
      title={title as any}
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(true)}
      onExpand={() => setCollapsed(false)}
      level={props.level}
      inputId={`${props.id}-hTemplateResponsive`}
      path={[...props.path, '_hTemplateResponsive']}
      data-stc-accordion="group"
      className="stc-accordion-group"
    >
      <PackedMembersView members={members} props={props} />
    </FormFieldSet>
  )
}

export function ActiveSettingsInput(props: InputProps) {
  if (!isObjectInputProps(props) || isArrayOfObjectsInputProps(props)) {
    return props.renderDefault(props)
  }

  const objectProps = props
  const members = annotateFieldsets(objectProps.members)
  const headingMembers = members.filter(
    (member) =>
      member.kind === 'fieldSet' &&
      !member.fieldSet.hidden &&
      RESPONSIVE_TYPE_FIELDSETS.has(member.fieldSet.name)
  )
  const restSource = members.filter(
    (member) =>
      !(member.kind === 'fieldSet' && RESPONSIVE_TYPE_FIELDSETS.has(member.fieldSet.name))
  )
  const restMembers = groupColorOpacityPairs(
    groupRootBreakpointRuns(
      decorateGroupedFieldsets(
        wrapProjectSeoFieldsets(
          wrapSiteCompanyFieldsets(
            wrapSiteTemplateFieldsets(
              wrapSiteTypographyFieldsets(
                wrapSectionLogoFieldsets(
                  wrapSectionMediaFieldsets(
                    wrapMediaItemCarouselFieldsets(
                      wrapMediaItemSingleFieldsets(restSource, objectProps),
                      objectProps
                    ),
                    objectProps
                  ),
                  objectProps
                ),
                objectProps
              ),
              objectProps
            ),
            objectProps
          ),
          objectProps
        ),
        objectProps
      ),
      objectProps
    ),
    objectProps
  )

  const needsCustomLayout =
    headingMembers.length > 0 ||
    restMembers.some(
      (member) =>
        member.kind === 'decoration' ||
        (member.kind === 'fieldSet' && !member.fieldSet.hidden)
    )

  if (!needsCustomLayout) {
    return objectProps.renderDefault(objectProps)
  }

  return (
    <div className="stc-object-input">
      <div className="stc-object-members">
        <ObjectMembersView members={restMembers} props={objectProps} />
        {headingMembers.length ? (
          <HTemplateResponsiveFold members={headingMembers} props={objectProps} />
        ) : null}
      </div>
    </div>
  )
}
