import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);
export default class DatabaseConnector {
  constructor() {
    this.connectDB();
  }

  async connectDB() {
    try {
      await mongoose.connect('mongodb://localhost:27017/E-commerce', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connect Success');
    } catch (error) {
      console.log('Fail');
    }
  }

  getUserModel() {
    return User;
  }
}
