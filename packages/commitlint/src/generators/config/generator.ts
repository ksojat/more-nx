import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  Tree,
} from '@nx/devkit';
import * as path from 'path';

export async function configGenerator(tree: Tree) {
  generateFiles(tree, path.join(__dirname, 'files'), '.', {});
  await formatFiles(tree);

  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@commitlint/cli': '^17.6.7',
      '@commitlint/config-conventional': '^17.6.7',
      '@commitlint/config-nx-scopes': '^17.6.4',
    }
  );

  return () => installPackagesTask(tree);
}

export default configGenerator;
