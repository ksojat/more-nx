import { Tree } from '@nx/devkit';
import { SetupGeneratorSchema } from './schema';
import tasksGenerator from '../vsc-tasks/generator';
import installGenerator from '../install/generator';

export async function setupGenerator(
  tree: Tree,
  options: SetupGeneratorSchema
) {
  await installGenerator(tree, options);
  await tasksGenerator(tree);
}

export default setupGenerator;
