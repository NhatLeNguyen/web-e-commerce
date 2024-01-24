import pkg from 'mongoose';
import mongoose from 'mongoose';
const { model, Schema } = pkg;

const Role = mongoose.model(
  'Role',
  new Schema({
    name: String,
  }),
);

export default Role;
