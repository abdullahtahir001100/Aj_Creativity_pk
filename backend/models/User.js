const mongoose = require('mongoose');

class User {
  constructor(id, username, password, isAdmin = false) {
    this.id = id;
    this.username = username;
    this.password = password; // In a real app, this would be hashed
    this.isAdmin = isAdmin;
    this.createdAt = new Date();
  }
}

// In-memory users database
const users = [
  new User('1', 'admin', 'admin123', true) // Default admin user
];

module.exports = {
  // Find user by username
  findByUsername: (username) => {
    return users.find(user => user.username === username);
  },
  
  // Find user by ID
  findById: (id) => {
    return users.find(user => user.id === id);
  },
  
  // Create a new user
  create: (username, password, isAdmin = false) => {
    const id = Date.now().toString();
    const newUser = new User(id, username, password, isAdmin);
    users.push(newUser);
    return newUser;
  },
  
  // Get all users
  getAll: () => {
    return [...users];
  }
};