const BASE = '';    // 혹시 모르니...
export const api = {
  saveAll: async () => {
    await fetch(`${BASE}/todos/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TodoModule.getTodos())
    });
  },
  loadTodos: async () => {
    const res = await fetch(`${BASE}/todos`);
    return await res.json();
  },
  updateTime: async (id, totalTime) => {
    await fetch(`${BASE}/todo-update/time/${id}?totalTime=${totalTime}`, {
      method: 'PUT'
    });
  },
  updateCompleted: async (id, completed) => {
    await fetch(`${BASE}/todo-update/completed/${id}?completed=${completed}`, {
      method: 'PUT'
    });
  }
};