// Instead of using require, use import for ES modules
import mongoose from 'mongoose';
// Import user and role models using ES module syntax
import User from './user.model.js';
import Role from './role.model.js';

mongoose.Promise = global.Promise;

const db = {};

db.user = User;
db.role = Role;

db.ROLES = ['user', 'admin'];

export default db;
