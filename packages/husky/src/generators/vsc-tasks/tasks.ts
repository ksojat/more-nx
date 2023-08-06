import { Tree, updateJson, writeJson } from '@nx/devkit';
import * as _ from 'lodash';

export type Command = {
  command: string;
  args?: (string | { value: string; quoting: string })[];
};

export type Task = Command;

export type CheckFn<T extends Task> = (task: T) => boolean;

export function hasTaskInJson<T extends Task>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any,
  check: CheckFn<T>
): boolean {
  for (const task of json.tasks || []) {
    if (check(task)) {
      return true;
    }
  }

  return false;
}

export const hasTaskWithCommand =
  <T extends Task>(command: T) =>
  (task: T): boolean => {
    const strip = (value: unknown) => _.pick(value, ['command', 'args']);

    return _.isEqual(strip(task), strip(command));
  };

export function addTaskToJson<T extends Task>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any,
  task: T,
  options: { position: 'begining' | 'end' } = { position: 'end' }
) {
  if (hasTaskInJson(json, hasTaskWithCommand(task))) {
    return json;
  }

  json.tasks = json.tasks ?? [];
  json.tasks =
    options.position === 'begining'
      ? [task, ...json.tasks]
      : [...json.tasks, task];

  return json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateTasks(tree: Tree, fn: (json: any) => any) {
  const tasksFile = '.vscode/tasks.json';

  if (tree.exists(tasksFile)) {
    updateJson(tree, tasksFile, (json) => {
      return fn(json);
    });
  } else {
    writeJson(
      tree,
      tasksFile,
      fn({
        version: '2.0.0',
        tasks: [],
      })
    );
  }
}

export function addTask<T extends Task>(
  tree: Tree,
  task: T,
  options: { position: 'begining' | 'end' } = { position: 'end' }
) {
  updateTasks(tree, (json) => {
    return addTaskToJson(json, task, options);
  });
}
