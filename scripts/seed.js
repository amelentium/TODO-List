import { ToDoItem, Status, Priority } from './classes.js';
import { addItem } from './main.js';

export function seed() {
  const canceledItem = new ToDoItem('Canceled item',
    'A canceled item is considered as resolved and does not have quick status change buttons',
    Status.Canceled);

  const minorItem = new ToDoItem('Minor priority item',
    'A minor priority item has a blue background and is placed below items with other priorities',
    Status.Planned, Priority.Minor);

  const normalItem = new ToDoItem('Normal priority item',
    'A normal priority item has a green background and is placed between items with other priorities',
    Status.Planned, Priority.Normal);

  const majorItem = new ToDoItem('Major priority item',
    'A major priority item has a red background and is placed above items with other priorities',
    Status.Planned, Priority.Major);

  const oldItem = new ToDoItem('Old item',
    'Older ones after them',
    Status.InProgress);

  const newItem = new ToDoItem('New item',
    'Newer tasks go first',
    Status.InProgress);

  const completedItem = new ToDoItem('Completed item',
    'A completed item is considered as resolved and does not have quick status change buttons',
    Status.Completed);

  oldItem.createdAt -= 100;

  addItem(canceledItem);
  addItem(completedItem);
  addItem(minorItem);
  addItem(normalItem);
  addItem(majorItem);
  addItem(oldItem);
  addItem(newItem);
}