export class ToDoItem {
  id;
  name;
  description;
  priority;
  createdAt;
  status;

  constructor(name,
              description,
              status = Status.Planned,
              priority = Priority.Normal) {
    this.name = name;
    this.description = description;
    this.createdAt = Date.now();
    this.status = status;
    this.priority = priority;
    this.id = self.crypto.randomUUID();
  }
}

export const Priority = Object.freeze({
	Minor: 0,
	Normal: 1,
	Major: 2,
});

export const Status = Object.freeze({
	Planned: 0,
	InProgress: 1,
	Completed: 2,
	Canceled: 3,
});

export const StatusGroupId = Object.freeze({
  0: 'planned_group',
  1: 'progress_group',
  2: 'completed_group',
  3: 'canceled_group',
});
