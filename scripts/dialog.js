import { ToDoItem } from "./classes.js";
import { items, findItemById, refreshTODOList } from "./main.js";

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

discardChangesButton.addEventListener('click', closeDialog);

export function openDialog(itemId) {
  isNewItem = itemId == null;
  item = !isNewItem
         ? findItemById(itemId) 
         : new ToDoItem('New Item', 'Description for new item');

  editNameElement.value = item.name;
  editDescriptionElement.value = item.description;
  editPriorityElement.value = Number(item.priority);
  editStatusElement.value = Number(item.status);

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
    items.push(item);
    refreshTODOList();
  } else {
    item.name = editNameElement.value;
    item.description = editDescriptionElement.value;
    item.priority = Number(editPriorityElement.value);
    item.status = Number(editStatusElement.value);

    refreshTODOList();
  }
}
