#!/usr/bin/env node
// One command for every site's Studio (NOUM, OREM, or any client site).
//   npm run site -- dev <site>      local Studio (port from SANITY_DEV_PORT, default 3334)
//   npm run site -- build <site>    build the Studio
//   npm run site -- deploy <site>   publish the Studio to https://<SANITY_STUDIO_HOST>.sanity.studio
//   npm run site -- cors <site>     add the current ngrok address to that project's CORS list
// <site> is the name of a settings file in this folder: .env.<site> (e.g. .env.noum).
// New site: copy site-template.env to .env.<site> and fill it in (see CLIENT-SITES.md in the website repo).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [command, site] = process.argv.slice(2);
const sites = readdirSync('.').filter((f) => /^\.env\.[a-z0-9-]+$/i.test(f) && f !== '.env.development').map((f) => f.slice(5));

if (!command || !site) {
  console.error('Usage: npm run site -- <dev|build|deploy|cors> <site>');
  console.error(`Sites found here: ${sites.join(', ') || '(none)'}`);
  process.exit(1);
}
if (!existsSync(`.env.${site}`)) {
  console.error(`No settings file .env.${site}. Sites found here: ${sites.join(', ') || '(none)'}`);
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(`.env.${site}`, 'utf8')
    .split('\n')
    .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()])
);
const port = env.SANITY_DEV_PORT || '3334';

const commands = {
  dev: `sanity dev --port ${port}`,
  build: 'sanity build',
  deploy: 'sanity deploy',
  cors: 'npx ts-node ./update-cors.ts',
};
if (!commands[command]) {
  console.error(`Unknown command "${command}". Use: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}
console.log(`> ${env.SANITY_STUDIO_TITLE || site}: ${commands[command]}`);
const result = spawnSync(commands[command], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SANITY_ACTIVE_ENV: site },
});
process.exit(result.status ?? 1);
