import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import {
  addTask,
  addTaskToJson,
  hasTaskWithCommand,
  hasTaskInJson,
  updateTasks,
} from './tasks';
import { readJson, writeJson } from '@nx/devkit';

describe('vsc-tasks tools', () => {
  describe('hasTasksInJson', () => {
    const json = {
      version: '2.0.0',
      tasks: [
        {
          label: 'Task1',
          command: 'command1',
          args: ['arg1', 'arg2'],
        },
        {
          label: 'Task2',
          command: 'command2 arg1 arg2',
        },
      ],
    };

    it('Should return true if function matches any task', () => {
      expect(
        hasTaskInJson(json, (task) => task.command === 'command2 arg1 arg2')
      ).toBe(true);
    });

    it('Should return false if function does not match any task', () => {
      expect(
        hasTaskInJson(json, (task) => task.command === 'command1 arg1 arg2')
      ).toBe(false);
    });
  });

  describe('hasTaskWithCommand', () => {
    const task1 = {
      label: 'Task1',
      command: 'command1',
    };

    const task2 = {
      label: 'Task2',
      command: 'command2',
      args: [
        {
          value: 'arg0',
          quoting: 'escaping',
        },
        'arg1',
      ],
    };

    it('Should return true if task has command', () => {
      const check = hasTaskWithCommand({
        command: 'command2',
        args: [
          {
            value: 'arg0',
            quoting: 'escaping',
          },
          'arg1',
        ],
      });

      expect(check(task2)).toBe(true);
    });

    it('Should return false if task has no command', () => {
      const check = hasTaskWithCommand({
        command: 'commandX',
      });

      expect(check(task1)).toBe(false);
    });
  });

  describe('addTaskToJson', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let json: any;

    beforeEach(() => {
      json = {
        version: '2.0.0',
        tasks: [
          {
            label: 'Task1',
            command: 'command1',
          },
          {
            label: 'Task2',
            command: 'command2',
          },
        ],
      };
    });

    it('Should add new task if it is missing', () => {
      addTaskToJson(
        json,
        { label: 'Task3', command: 'command3' },
        { position: 'begining' }
      );

      expect(json).toMatchInlineSnapshot(`
        {
          "tasks": [
            {
              "command": "command3",
              "label": "Task3",
            },
            {
              "command": "command1",
              "label": "Task1",
            },
            {
              "command": "command2",
              "label": "Task2",
            },
          ],
          "version": "2.0.0",
        }
      `);
    });

    it('Should not add new task if it already exists', () => {
      addTaskToJson(
        json,
        { label: 'Task3', command: 'command1' },
        { position: 'begining' }
      );

      expect(json).toMatchInlineSnapshot(`
        {
          "tasks": [
            {
              "command": "command1",
              "label": "Task1",
            },
            {
              "command": "command2",
              "label": "Task2",
            },
          ],
          "version": "2.0.0",
        }
      `);
    });
  });

  describe('updateTasks', () => {
    it('Should update existing file if it exists', () => {
      const tree = createTreeWithEmptyWorkspace();

      writeJson(tree, '.vscode/tasks.json', {
        version: '2.0.0',
        tasks: [
          {
            label: 'Task1',
            command: 'command1',
          },
        ],
      });

      updateTasks(tree, (json) => {
        json.tasks = json.tasks ?? [];
        json.tasks = [...json.tasks, { label: 'Task2', command: 'command2' }];
        return json;
      });

      expect(readJson(tree, '.vscode/tasks.json')).toMatchInlineSnapshot(`
        {
          "tasks": [
            {
              "command": "command1",
              "label": "Task1",
            },
            {
              "command": "command2",
              "label": "Task2",
            },
          ],
          "version": "2.0.0",
        }
      `);
    });

    it('Should create new file if it does not exist', () => {
      const tree = createTreeWithEmptyWorkspace();

      updateTasks(tree, (json) => {
        json.tasks = json.tasks ?? [];
        json.tasks = [...json.tasks, { label: 'Task1', command: 'command1' }];
        return json;
      });

      expect(readJson(tree, '.vscode/tasks.json')).toMatchInlineSnapshot(`
        {
          "tasks": [
            {
              "command": "command1",
              "label": "Task1",
            },
          ],
          "version": "2.0.0",
        }
      `);
    });
  });

  describe('addTask', () => {
    it('Should add task if it does not exist', () => {
      const tree = createTreeWithEmptyWorkspace();

      addTask(tree, { label: 'Task1', command: 'command1' });
      expect(readJson(tree, '.vscode/tasks.json')).toMatchInlineSnapshot(`
        {
          "tasks": [
            {
              "command": "command1",
              "label": "Task1",
            },
          ],
          "version": "2.0.0",
        }
      `);
    });

    it('Should not add task if it already exists', () => {
      const tree = createTreeWithEmptyWorkspace();

      writeJson(tree, '.vscode/tasks.json', {
        version: '2.0.0',
        tasks: [
          {
            label: 'Task1',
            command: 'command1',
          },
          {
            label: 'Task2',
            command: 'command2',
          },
        ],
      });

      addTask(tree, { label: 'Task3', command: 'command2' });
      expect(readJson(tree, '.vscode/tasks.json')).toMatchInlineSnapshot(`
        {
          "tasks": [
            {
              "command": "command1",
              "label": "Task1",
            },
            {
              "command": "command2",
              "label": "Task2",
            },
          ],
          "version": "2.0.0",
        }
      `);
    });
  });
});
