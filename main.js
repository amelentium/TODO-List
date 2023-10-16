class ToDoItem {
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
  }
}

const Status = {
	Planned: 0,
	InProgress: 1,
	Completed: 2,
	Canceled: 3,
}