const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, minlength: 2 },
  lastName: { type: String, required: true, minlength: 2 },
});

UserSchema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toJSON', { getters: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
