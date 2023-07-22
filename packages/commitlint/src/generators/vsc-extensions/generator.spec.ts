import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readJson } from '@nx/devkit';

import { recommendedExtensionsGenerator } from './generator';

describe('vsc-extensions generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await recommendedExtensionsGenerator(tree);

    const extensions = readJson(tree, '.vscode/extensions.json');
    const recommended = extensions?.recommendations ?? [];

    expect(recommended.includes('vivaxy.vscode-conventional-commits')).toBe(
      true
    );
  });
});
