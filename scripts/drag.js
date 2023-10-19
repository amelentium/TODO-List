import { Status, StatusGroupId } from './classes.js';
import { refreshTODOList, findItemById } from './main.js';

export function itemDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  e.dataTransfer.effectAllowed = 'move';
}

Object.values(Status).forEach(status => {
  const groupId = StatusGroupId[status];
  const groupElement = document.getElementById(groupId);

  groupElement.addEventListener('dragover', (event) => itemDragover(event));
  groupElement.addEventListener('drop', (event) => itemDrop(event, status));
});

function itemDragover(e) {
  e.preventDefault();
}

function itemDrop(e, status) {
  const itemId = e.dataTransfer.getData('text/plain');
  const item = findItemById(itemId);
  
  if (item.status !== status) {
    item.status = status;
    refreshTODOList();
  }
}