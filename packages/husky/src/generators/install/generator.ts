import { formatFiles, installPackagesTask, Tree } from '@nx/devkit';
import { InstallGeneratorSchema } from './schema';
import * as child_process from 'child_process';
import * as fs from 'fs/promises';

type Hook = [boolean, string];

function checkDryRun() {
  if (
    process.argv.includes('--dry-run') ||
    process.argv.includes('--dryRun') ||
    process.argv.includes('-d')
  ) {
    throw new Error(
      'NOTE: This generator does not support --dry-run. If you are running this in Nx Console, it should execute fine once you hit the "Run" button.\n'
    );
  }
}

function run(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.info('Executing: ', cmd);

    child_process.exec(cmd, (error, stdout, stderr) => {
      if (stdout.trim().length !== 0) {
        console.log(stdout);
      }
      if (stderr.trim().length !== 0) {
        console.log(stderr);
      }

      if (error) {
        reject(error);
      } else {
        resolve(undefined);
      }
    });
  });
}

async function registerScript(tree: Tree) {
  const includeLine = 'source "$(dirname -- "$0")/pre-commit-nx"';
  const excludeLine = 'npm test';
  const hooksFile = '.husky/pre-commit';

  let preCommit: string;
  try {
    preCommit = await fs.readFile(hooksFile, 'utf-8');
  } catch (ex) {
    return;
  }

  let hasHook = false;
  const lines = [];
  preCommit.split(/\r?\n/).forEach((line: string) => {
    if (line.trim() === includeLine) {
      hasHook = true;
    }

    if (line.trim() !== excludeLine) {
      lines.push(line);
    }
  });

  if (!hasHook) {
    lines.push(includeLine);
  }

  tree.write(hooksFile, lines.join('\n'));
}

function addHooks(tree: Tree, hooks: Hook[]) {
  const lines = ['# This file is generated, do not edit manually.'];

  for (const [check, line] of hooks) {
    if (!check) {
      console.log('skip', line);
      continue;
    }

    lines.push(line);
  }

  tree.write('.husky/pre-commit-nx', lines.join('\n'));
}

export async function installGenerator(
  tree: Tree,
  options: InstallGeneratorSchema
) {
  checkDryRun();

  const hooks: Hook[] = [
    [options.formatCheck ?? true, 'npx nx format:check uncommitted'],
    [options.lint ?? true, 'npx nx affected -t lint'],
    [options.test ?? true, 'npx nx affected -t test'],
  ];

  await run('npx --yes husky-init');

  await registerScript(tree);
  addHooks(tree, hooks);

  await formatFiles(tree);
  return () => installPackagesTask(tree);
}

export default installGenerator;
