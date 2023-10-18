let draggableElement, dragOffsetY, dragOffsetX;

function itemDragDown(e) {
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