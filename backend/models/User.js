const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this later!
  role: { type: String, default: 'user' }, // helps distinguish between admin/user
  
  // ADDED: Array of Book ObjectIds referencing your Book collection
  starredBooks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book' 
  }],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);