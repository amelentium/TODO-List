import { ToDoItem, Status, Priority } from './classes.js';
import { addItem } from './main.js';

const itemSeeds = [
  {
    name: 'Canceled item',
    description: 'A canceled item is considered as resolved and does not have quick status change buttons',
    status: Status.Canceled,
  },
  {
    name: 'Minor priority item',
    description: 'A minor priority item has a blue background and is placed below items with other priorities',
    priority: Priority.Minor,
  },
  {
    name: 'Normal priority item',
    description: 'A normal priority item has a green background and is placed between items with other priorities',
  },
  {
    name: 'Major priority item',
    description: 'A major priority item has a red background and is placed above items with other priorities',
    priority: Priority.Major
  },
  {
    name: 'Old item',
    description: 'Older ones after them',
    status: Status.InProgress,
    createdAt: Date.now() - 1000,
  },
  {
    name: 'New item',
    description: 'Newer tasks go first',
    status: Status.InProgress,
  },
  {
    name: 'Completed item',
    description: 'A completed item is considered as resolved and does not have quick status change buttons',
    status: Status.Completed,
  },
]

export function seed() {
  itemSeeds.forEach(itemSeed => {
    const item = new ToDoItem(itemSeed.name,
                              itemSeed.description,
                              itemSeed.priority,
                              itemSeed.status);

    if (itemSeed.createdAt) {
      item.createdAt = itemSeed.createdAt;
    }
    
    addItem(item);
  });
}