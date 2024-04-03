import { belongsTo, boolean, dateonly, hasMany, integer, string } from "@hatchifyjs/core";

export const Schemas = {
  Todo: {
    name: 'Todo', // 👀
    attributes: {
      name: string({ required: true }), // 👀
      dueDate: dateonly(),
      importance: integer(),
      complete: boolean({ default: false }),
    },
    relationships: {
      user: belongsTo('User'), // 👀
    },
  },
  User: {
    name: 'User',
    attributes: {
      name: string({ required: true }),
    },
    relationships: {
      todos: hasMany('Todo'), // 👀
    },
  },
} 
