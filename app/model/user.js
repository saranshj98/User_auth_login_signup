const md5 = require('md5');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    organizationName: {
      type: String
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'user',
    versionKey: false
  }
);

UserSchema.methods.generateHash = function (password) {
  var md5Pass = md5(password);
  return bcrypt.hashSync(md5Pass, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
  var md5Pass = md5(password);
  return bcrypt.compareSync(md5Pass, this.password);
};

module.exports = mongoose.model('user', UserSchema);

//bcrypt.hashSync(data, salt, null);
//genSaltSync(8) - default value is 10.
