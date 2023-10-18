import { ToDoItem } from "./classes.js";
import { findItemById, addNewItem, refreshTODOList } from "./main.js";

const editDialog = document.getElementById('edit_dialog');
const editNameElement = editDialog.querySelector('#name');
const editDescriptionElement = editDialog.querySelector('#description');
const editPriorityElement = editDialog.querySelector('#priority');
const editStatusElement = editDialog.querySelector('#status');
const createItemButton = document.getElementById('add_button');
const saveChangesButton = document.getElementById('save_button');
const discardChangesButton = document.getElementById('discard_button');
let item, isNewItem;

createItemButton.addEventListener('click', (e) => {
  const itemId = e.target.closest('.item')?.id;
  openDialog(itemId);
});

saveChangesButton.addEventListener('click', () => {
  saveItemChanges()
  closeDialog();
})

discardChangesButton.addEventListener('click', () => {
  closeDialog();
});

export function openDialog(itemId) {
  isNewItem = itemId == null;
  item = !isNewItem
         ? findItemById(itemId) 
         : new ToDoItem('New Item', 'Description for new item');

  editNameElement.value = item.name;
  editDescriptionElement.value = item.description;
  editPriorityElement.value = item.priority;
  editStatusElement.value = item.status;

  editDialog.showModal();
}

function closeDialog() {
  editNameElement.value = '';
  editDescriptionElement.value = '';
  editPriorityElement.value = 1;
  editStatusElement.value = 0;

  editDialog.close();
}

function saveItemChanges() {
  if (isNewItem) {
    addNewItem(item);
  } else {
    item.name = editNameElement.value;
    item.description = editDescriptionElement.value;
    item.priority = editPriorityElement.value;
    item.status = editStatusElement.value;

    refreshTODOList();
  }
}