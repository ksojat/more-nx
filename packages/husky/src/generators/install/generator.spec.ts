import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import { installGenerator } from './generator';
import { InstallGeneratorSchema } from './schema';

let tree: Tree;

jest.mock('child_process', () => {
  return {
    ...jest.requireActual<object>('child_process'),
    exec: jest.fn(
      (
        command: string,
        callback: (
          error: Error | undefined,
          stdout: string,
          stderr: string
        ) => void
      ) => {
        if (command.includes('npx --yes husky-init')) {
          tree.write('.husky/pre-commit', 'npm test');
          callback(undefined, '', '');
          return '';
        }
        return;
      }
    ),
  };
});

describe('install generator', () => {
  const options: InstallGeneratorSchema = {};

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await installGenerator(tree, options);

    const preCommit = tree.read('.husky/pre-commit')?.toString('utf-8');
    expect(preCommit).toContain('source "$(dirname -- "$0")/pre-commit-nx"');
    expect(preCommit).not.toContain('npm test');

    expect(tree.exists('.husky/pre-commit-nx')).toBe(true);
  });
});
