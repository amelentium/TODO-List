export class ToDoItem {
  id;
  name;
  description;
  priority;
  status;
  createdAt;

  constructor(name,
              description,
              priority = Priority.Normal,
              status = Status.Planned) {
    this.id = self.crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.createdAt = Date.now();
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
