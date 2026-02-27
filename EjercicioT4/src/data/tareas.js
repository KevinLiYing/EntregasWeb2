// Datos de tareas

export const tareas = {
    lista:[
    {   
      id: 1, title: "Título de la tarea", 
      description: "Descripción de la tarea",priority: "low",
      completed: false, dueDate: "2024-12-31",
      tags: ["tag1", "tag2"], createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2, title: "Título de la tarea 2", 
      description: "Descripción de la tarea 2",priority: "medium",
      completed: true, dueDate: "2025-11-01",
      tags: ["tag2", "tag3"], createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
]
}