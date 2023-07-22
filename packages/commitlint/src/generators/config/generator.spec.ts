import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import { configGenerator } from './generator';

describe('config generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await configGenerator(tree);
    expect(tree.exists('commitlint.config.js')).toBe(true);
  });
});
