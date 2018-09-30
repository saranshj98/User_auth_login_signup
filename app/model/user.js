const bcrypt    = require('bcrypt-nodejs')
const md5       = require('md5');
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;


const UserSchema = new Schema({
    username    : { 
        type    : String, 
        required: true 
    },
    email       : {
        type: String,
        required: true
    },
    password    : {
        type: String,
        required: true
    }
}, {
    timestamps : {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection : 'User'
});

UserSchema.methods.generateHash = function(password) {
	var md5Pass = md5(password);
	return bcrypt.hashSync(md5Pass, bcrypt.genSaltSync(8), null);
}


UserSchema.methods.validPassword = function(password) {
	var md5Pass = md5(password);
	return bcrypt.compareSync(md5Pass, this.password);
}


module.exports = mongoose.model('User', UserSchema);

//bcrypt.hashSync(data, salt, null);
//genSaltSync(8) - default value is 10. 