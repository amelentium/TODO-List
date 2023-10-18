class ToDoItem {
  id;
  name;
  description;
  priority;
  createdAt;
  status;

  constructor(name, description, priority) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.createdAt = Date.now();
    this.status = Status.Planned;
    this.id = self.crypto.randomUUID();
  }
}

const Priority = Object.freeze({
	Minor: 0,
	Normal: 1,
	Major: 2,
});

const Status = Object.freeze({
	Planned: 0,
	InProgress: 1,
	Completed: 2,
	Canceled: 3,
});

const StatusGroupId = Object.freeze({
  0: 'planned_group',
  1: 'progress_group',
  2: 'completed_group',
  3: 'canceled_group',
});

const items = [];
const itemGroupElements = {};

let draggableElement, dragOffsetY, dragOffsetX;

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
  groupBody.innerHTML = ''
  groupItems = items.filter(item => item.status == status)
  groupItems.forEach(item => {
    groupBody.innerHTML += createItemElementHTML(item);
  });
}

function createItem() {
  items.push(new ToDoItem(
    `New Item`,
    `Description for new item`,
    Status.Planned,
  ));

  redrawTODOListStatusGroup(Status.Planned);
}

function createItemElementHTML(item) {
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

  return `
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
  `
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

function findItemById(id) {
    const item = items.find(item => item.id == id);
    return item
}

function itemDragDown(e) {
  e.preventDefault();

  draggableElement = e.target.closest('.draggable');

  const elementRect = draggableElement.getBoundingClientRect();
  const elementWidth = Math.floor(elementRect.width);
  dragOffsetX = e.clientX - elementRect.x;
  dragOffsetY = e.clientY - elementRect.y;

  draggableElement.style.position = 'absolute';
  draggableElement.style.width = elementWidth + 'px';
  draggableElement.style.top = e.clientY - dragOffsetY + 'px';
  draggableElement.style.left = e.clientX - dragOffsetX + 'px';

  document.onmouseup = itemDragUp;
  document.onmousemove = itemDragMove;
}

function itemDragMove(e) {
  e.preventDefault();
  
  draggableElement.style.top = e.clientY - dragOffsetY + 'px';
  draggableElement.style.left = e.clientX - dragOffsetX + 'px';
}

function itemDragUp(e) {
  draggableElement.style = null;
  
  const item = findItemById(draggableElement.id);
  const itemOldStatus = item.status;
  
  item.status = findNewItemStatusByGroupLeftOffset(e.clientX);
  if (itemOldStatus !== item.status) {
    redrawTODOListStatusGroup(itemOldStatus);
    redrawTODOListStatusGroup(item.status);
  }

  document.onmouseup = null;
  document.onmousemove = null;
}

function findNewItemStatusByGroupLeftOffset(leftOffset) {
  const groupElementLeftOffsets = [];

  Object.keys(StatusGroupId).forEach(status => 
    groupElementLeftOffsets.push({
      status: status, 
      offset: itemGroupElements[status].offsetLeft,
    })
  );

  groupElementLeftOffsets.sort((a, b) => a.offset - b.offset);

  let status = groupElementLeftOffsets[0].status;

  for(let i = 1; i < groupElementLeftOffsets.length; i++) {
    if (groupElementLeftOffsets[i].offset < leftOffset)
      status = groupElementLeftOffsets[i].status
    else break;
  }

  return status;
}