const Todo = require('../models/Todo');

// @desc    Get todos
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json(todos);
};

// @desc    Create todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: 'Please add a text field' });
  }

  const todo = await Todo.create({
    text: req.body.text,
    user: req.user.id,
  });

  res.status(201).json(todo);
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Check for user
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Make sure the logged in user matches the todo user
  if (todo.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTodo);
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Check for user
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Make sure the logged in user matches the todo user
  if (todo.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await todo.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};