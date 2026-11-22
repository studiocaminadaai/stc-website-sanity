# NOUM Sanity Studio: notes for Claude

This is the Studio (schemas) for the NOUM website. The full project notes and working rules are in
`/Users/imac2017/stc-website-react/CLAUDE.md`; read that file first. The key rules in short:

- Company name **NOUM** (N-O-U-M). Owner: Remo. Second company **OREM** (Sanity project `l4o0lkxd`).
- **Sanity before code**; add a field rather than hard-coding a value.
- **Always publish** Sanity edits; always say which changes were Sanity and which were code.
- **Check shared sections** (referenced by several projects) before editing; ask if a change is meant for one project only.
- **Remo pushes**: commit locally and hand him the push command. Never enter passwords or tokens.

Studio specifics:
- NOUM project `idoh4jie`, dataset `production`. Local Studio: `localhost:3334` (`npm run dev:noum`), auto-started via launchd.
- Schemas: `schemas/` (`section.ts`, `project.ts`, `siteConfig.ts`, `mediaItem.ts`, ...). Breakpoint field suffixes: Desktop, Laptop, TabletLandscape, TabletPortrait, MobileLandscape, MobileLandscapeSmall, MobilePortrait, MobilePortraitSmall.
- A new schema field only has an effect once the website code reads it (query in `stc-website-react/src/hooks/useSanityData.ts`).
- `.env.*` files hold tokens and are git-ignored. Never print or commit them.
