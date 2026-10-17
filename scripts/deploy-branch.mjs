// Builds the site and commits the contents of dist/ to the `deploy` branch,
// which Hostinger's Git deployment pulls into public_html/. Never pushes.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wt = path.join(root, '.deploy');
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: 'inherit' });
const out = (cmd, cwd = root, input) => execSync(cmd, { cwd, input, encoding: 'utf8' }).trim();

run('npm run build');
const sha = out('git rev-parse --short HEAD');

if (fs.existsSync(wt)) run(`git worktree remove --force "${wt}"`);
const hasBranch = out('git branch --list deploy') !== '';
if (!hasBranch) {
  // Orphan branch from the empty tree (works on git < 2.42, which lacks `worktree add --orphan`).
  const emptyTree = out('git hash-object -t tree --stdin', root, '');
  run(`git branch deploy ${out(`git commit-tree ${emptyTree} -m "deploy: init"`)}`);
}
run(`git worktree add "${wt}" deploy`);

try {
  for (const name of fs.readdirSync(wt)) {
    if (name !== '.git') fs.rmSync(path.join(wt, name), { recursive: true, force: true });
  }
  fs.cpSync(path.join(root, 'dist'), wt, { recursive: true });
  run('git add -A', wt);
  if (out('git status --porcelain', wt) === '') {
    console.log('deploy branch already matches this build.');
  } else {
    run(`git commit -q -m "deploy: ${sha}"`, wt);
    console.log(`\nCommitted dist/ to the deploy branch (build of ${sha}).\nPublish it with:\n\n  git push origin deploy\n`);
  }
} finally {
  run(`git worktree remove --force "${wt}"`);
}
