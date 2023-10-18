import { ToDoItem, Status, StatusGroupId, Priority } from "./classes.js";
import { openDialog } from "./dialog.js";
import "./drag.js";

const items = [];
const itemGroupElements = {};

Object.keys(StatusGroupId).forEach(status => {
  const groupId = StatusGroupId[status];
  const itemGroup = document.getElementById(groupId);
  itemGroupElements[status] = itemGroup;
});

seed();
redrawTODOList();

function seed() {
  for(let i = 1; i < 13; i++) {
    const item = new ToDoItem(
      `Item ${i}`,
      `Description for item ${i}`,
      i % 3
    );

    item.status = i % 4;

    items.push(item);
  }
}

function redrawTODOList() {
  Object.values(Status).forEach(status => {
    redrawTODOListStatusGroup(status);
  });
}

function redrawTODOListStatusGroup(status) {
  const groupBody = itemGroupElements[status].querySelector('.group_body');
  groupBody.innerHTML = '';
  const groupItems = items.filter(item => item.status == status);
  groupItems.forEach(item => {
    groupBody.appendChild(createItemElement(item));
  });
}

export function addNewItem(item) {
  items.push(item);
  refreshTODOList();
}

export function refreshTODOList() {
  resortItems();
  redrawTODOList();  
}

function resortItems() {

}

function createItemElement(item) {
  const itemResolved = item.status == Status.Canceled
                     || item.status ==   Status.Completed;

  const cancelButton = `
    <span class="cancel_button"
          onclick="cancelItem(event)">
      ✗
    </span>`

  const completeButton =`
    <span class="complete_button"
          onclick="completeItem(event)">
      ✓
    </span>`

  const itemElement = new DOMParser().parseFromString(`
  <div id=${item.id} class="item draggable">
    <div class="header">
      ${!itemResolved ? cancelButton : ''}
      <span class="header_content dragger"
            onmousedown="itemDragDown(event)">
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

  const itemElementBody = itemElement.querySelector('.body');
  itemElementBody.addEventListener('click', () => openDialog(item.id));

  return itemElement;
}

function cancelItem(e) {
  const itemElement = e.target.closest('.item');
  const item = findItemById(itemElement.id);
  const itemOldStatus = item.status;

  item.status = Status.Canceled;
  redrawTODOListStatusGroup(itemOldStatus);
  redrawTODOListStatusGroup(item.status);
}

function completeItem(e) {
  const itemElement = e.target.closest('.item');
  const item = findItemById(itemElement.id);
  const itemOldStatus = item.status;

  item.status = Status.Completed;
  redrawTODOListStatusGroup(itemOldStatus);
  redrawTODOListStatusGroup(item.status);
}

export function findItemById(id) {
    const item = items.find(item => item.id == id);
    return item
}