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

const Priority = {
	Minor: 0,
	Normal: 1,
	Major: 2,
};

const Status = Object.freeze({
	Planned: 0,
	InProgress: 1,
	Compconsted: 2,
	Canceled: 3,
});

const StatusGroupId = {
  0: 'planned_group',
  1: 'progress_group',
  2: 'completed_group',
  3: 'canceled_group',
};

const items = [];
const itemGroupElements = {};

let itemElement, dragOffsetY, dragOffsetX;

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
    groupBody.innerHTML += `
      <div id=${item.id} class="item">
        <div class="header draggable"
             onmousedown="itemDragDown(event)">
          •••
        </div>
        <div class="name">
          ${item.name}
        </div>
        <div class="description">
          ${item.description}
        </div>
      </div>
    `
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

function itemDragDown(e) {
  e.preventDefault();

  itemElement = e.target.parentElement;

  const elementRect = itemElement.getBoundingClientRect();
  const elementWidth = Math.floor(elementRect.width);
  dragOffsetX = e.clientX - elementRect.x;
  dragOffsetY = e.clientY - elementRect.y;

  itemElement.style.position = 'absolute';
  itemElement.style.width = elementWidth + 'px';
  itemElement.style.top = e.clientY - dragOffsetY + 'px';
  itemElement.style.left = e.clientX - dragOffsetX + 'px';

  document.onmouseup = itemDragUp;
  document.onmousemove = itemDragMove;
}

function itemDragMove(e) {
  e.preventDefault();
  
  itemElement.style.top = e.clientY - dragOffsetY + 'px';
  itemElement.style.left = e.clientX - dragOffsetX + 'px';
}

function itemDragUp(e) {
  itemElement.style = null;
  
  const itemId = itemElement.id;
  const item = items.find(item => item.id == itemId);
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