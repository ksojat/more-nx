import { formatFiles, Tree } from '@nx/devkit';
import { addTask } from './tasks';

const tasks = [
  {
    label: 'Prepare NPM packages',
    type: 'shell',
    command: 'npm install',
    runOptions: {
      runOn: 'folderOpen',
    },
  },
  {
    label: 'Activate Husky',
    type: 'shell',
    command: 'npm run prepare',
    runOptions: {
      runOn: 'folderOpen',
    },
  },
];

export async function tasksGenerator(tree: Tree) {
  for (let i = tasks.length - 1; i >= 0; i--) {
    addTask(tree, tasks[i], { position: 'begining' });
  }

  await formatFiles(tree);
}

export default tasksGenerator;
