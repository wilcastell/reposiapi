const mongooose = require('mongoose');
const { Schema } = mongooose;
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.methods.toJSON = function () {
  let user = this.toObject();
  delete user.password;
  return user;
};

UserSchema.methods.comparePasswords = function (password) {
  return compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(user.password, salt);
  user.password = hashedPassword;
  next();
});

module.exports = mongooose.model('User', UserSchema);
