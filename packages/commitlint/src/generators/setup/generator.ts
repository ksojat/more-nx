import recommendedExtensionsGenerator from '../vsc-extensions/generator';
import configGenerator from '../config/generator';
import { Tree } from '@nx/devkit';

export async function setupGenerator(tree: Tree) {
  await recommendedExtensionsGenerator(tree);
  await configGenerator(tree);
}

export default setupGenerator;
