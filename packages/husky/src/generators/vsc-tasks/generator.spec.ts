import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import { tasksGenerator } from './generator';

describe('vsc-tasks generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await tasksGenerator(tree);
    expect(tree.exists('.vscode/tasks.json')).toBe(true);
  });
});
