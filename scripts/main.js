import { Status, StatusGroupId } from './classes.js';
import { openDialog } from './dialog.js';
import { itemDragStart } from './drag.js';
import { seed } from './seed.js';

export function refreshTODOList() {
  sortItems();
  saveItems();
  redrawTODOList();
}

export function findItemById(id) {
    const item = items.find(item => item.id == id);
    return item;
}

export function deleteItemById(id) {
  const itemIndex = items.findIndex(item => item.id == id)
  items.splice(itemIndex, 1);
}

export function addItem(item) {
  items.push(item);
}

const items = [];
const itemsLocalStorageKey = 'toDoList';
const itemGroupElements = {};

Object.keys(StatusGroupId).forEach(status => {
  const groupId = StatusGroupId[status];
  const itemGroup = document.getElementById(groupId);
  itemGroupElements[status] = itemGroup;
});

init();

function init() {
  let isalreadySeeded = Boolean(localStorage.getItem('isSeeded'));

  if (!isalreadySeeded) {
    seed();
    localStorage.setItem('isSeeded', true);
    refreshTODOList();
  } else {
    loadItems();
    redrawTODOList();
  }
}

function loadItems() {
  items.push(...JSON.parse(localStorage.getItem(itemsLocalStorageKey)));
}

function saveItems() {
  localStorage.setItem(itemsLocalStorageKey, JSON.stringify(items));
}

function redrawTODOList() {
  Object.values(Status).forEach(status => {
    const groupBody = itemGroupElements[status].querySelector('.body');
    const groupItems = items.filter(item => item.status === status);

    groupBody.innerHTML = '';    
    groupItems.forEach(item => {
      groupBody.appendChild(createItemElement(item));
    });
  });
}

function sortItems() {
  items.sort((a, b) => 
    a.priority !== b.priority
    ? b.priority - a.priority
    : b.createdAt - a.createdAt
  );
}

function createItemElement(item) {
  const itemResolved = item.status == Status.Canceled
                     || item.status ==   Status.Completed;

  const cancelButton = `
    <span class="button cancel_button">
      ✗
    </span>`

  const completeButton =`
    <span class="button complete_button">
      ✓
    </span>`

  const itemElement = new DOMParser().parseFromString(`
  <div id=${item.id}
       class="item"
       priority="${item.priority}">
    <div class="header">
      ${!itemResolved ? cancelButton : ''}
      <span class="content">
        •••
      </span>
      ${!itemResolved ? completeButton : ''}
    </div>
    <div class="body">
      <div class="name">
        ${item.name}
      </div>
      <div class="description">
        ${item.description}
      </div>
    </div>
  </div>
  `, 'text/html').body.firstChild;

  itemElement.setAttribute('draggable', 'true');
  itemElement.addEventListener('dragstart', itemDragStart);

  const itemElementBody = itemElement.querySelector('.body');
  itemElementBody.addEventListener('click', () => { openDialog(item.id); });

  if (!itemResolved) {
    const cancelButton = itemElement.getElementsByClassName('cancel_button')[0];
    cancelButton.addEventListener('click', cancelItem);

    const completeButton = itemElement.getElementsByClassName('complete_button')[0];
    completeButton.addEventListener('click', completeItem);
  }

  return itemElement;
}

function cancelItem(e) {
  const itemElement = e.target.closest('.item');
  const item = findItemById(itemElement.id);

  item.status = Status.Canceled;
  refreshTODOList();
}

function completeItem(e) {
  const itemElement = e.target.closest('.item');
  const item = findItemById(itemElement.id);

  item.status = Status.Completed;
  refreshTODOList();
}
