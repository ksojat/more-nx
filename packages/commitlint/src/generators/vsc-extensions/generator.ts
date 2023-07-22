import { updateJson, formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';

function updateExtensions(tree: Tree) {
  const extensions = '.vscode/extensions.json';
  const recommended = [
    'nrwl.angular-console',
    'vivaxy.vscode-conventional-commits',
  ];

  if (tree.exists(extensions)) {
    updateJson(tree, extensions, (json) => {
      json = json ?? {};
      json.recommendations = json.recommendations ?? [];

      for (const name of recommended) {
        if (!json.recommendations.includes(name)) {
          json.recommendations.push(name);
        }
      }

      return json;
    });
  } else {
    generateFiles(tree, path.join(__dirname, 'files'), '.vscode', {});
  }
}

export async function recommendedExtensionsGenerator(tree: Tree) {
  updateExtensions(tree);
  await formatFiles(tree);
}

export default recommendedExtensionsGenerator;
