import mongoose from 'mongoose';
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

 
}
