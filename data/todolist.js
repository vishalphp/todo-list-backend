const fs = require('node:fs/promises');

const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');

async function readData() {
  const data = await fs.readFile('todolists.json', 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile('todolists.json', JSON.stringify(data));
}

async function getAll() {
  const storedData = await readData();
  if (!storedData.todolists) {
    throw new NotFoundError('Could not find any todo.');
  }
  return storedData.todolists;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.todolists || storedData.todolists.length === 0) {
    throw new NotFoundError('Could not find any todo.');
  }

  const todolist = storedData.todolists.find((ev) => ev.id === id);
  if (!todolist) {
    throw new NotFoundError('Could not find todo for id ' + id);
  }

  return todolist;
}

async function add(data) {
  const storedData = await readData();
  storedData.todolists.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.todolists || storedData.todolists.length === 0) {
    throw new NotFoundError('Could not find any todo.');
  }

  const index = storedData.todolists.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError('Could not find todo for id ' + id);
  }

  storedData.todolists[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.todolists.filter((ev) => ev.id !== id);
  await writeData({todolists: updatedData});
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
