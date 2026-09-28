import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const prepareWake=spawnSync(process.execPath,["scripts/prepare-wake-runtime.mjs"],{stdio:"inherit",env:process.env});
if(prepareWake.error)throw prepareWake.error;
if(prepareWake.status!==0)process.exit(prepareWake.status??1);

const secret = process.env.ALEXA_OAUTH_CLIENT_SECRET;
if (!secret) {
  console.error('Set ALEXA_OAUTH_CLIENT_SECRET under Cloudflare Settings > Builds > Variables and secrets.');
  process.exit(1);
}

const directory = mkdtempSync(join(tmpdir(), 'nyxthea-deploy-'));
const secretsFile = join(directory, 'secrets.json');
try {
  writeFileSync(secretsFile, JSON.stringify({ ALEXA_OAUTH_CLIENT_SECRET: secret }), { mode: 0o600 });
  const { ALEXA_OAUTH_CLIENT_SECRET: _omitted, ...childEnv } = process.env;
  const result = spawnSync('npx', ['wrangler', 'deploy', '--secrets-file', secretsFile], {
    stdio: 'inherit',
    env: childEnv,
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(directory, { recursive: true, force: true });
}
