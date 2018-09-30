const mongoose  = require('mongoose')
const User      = require('../../model/user')
const async     = require('async')


function authUser(req, res) {
    let body                = req.body
    let password            = body.password;
    let username            = body.username;
    let email               = body.email;

    if(!email || !password) {
        return res.send({
            error : true,
            message : "Enter all the details"
        })
    }

    if(username) { signUp() } 
    else { login() }

     //user try to signup
    function signUp() {

        async.waterfall([
            findUser,
            checkUser
        ], function(err, result) {
            if (err) { 
                return res.send({
                    error : true,
                    message : "Database Error"
                })
            }

            else {
                return res.send({
                    error   : false,
                    message : "Signup done successfully",
                    userDoc : result
                })
            }
        })


        function findUser(callback) {
            User.findOne({ "email" : email}).exec((err, docs) => {
                if(err) { return callback(err) }

                else { return callback(null, docs)}
            })
        }


        function checkUser(userDoc, callback) {
            if(userDoc) {
                return res.send({
                    error : true,
                    message : 'User already exist with this email'
                });
            }

            else {
                let user                           =   new User()
                user.username                      =   username;
                user.email                         =   email;
                user.password                      =   user.generateHash(password);
                user.save(er => {
                    if (er) { return callback(er) }

                    else { return callback(null, user) }
                })
            }
        }
    }

    //user try to login
    function login() {

        async.waterfall([
            findUser,
            checkUser
        ], function(err, result) {
            if (err) { 
                return res.send({
                    error   : true,
                    message : "Database Error"
                })
            }

            else {
                return res.send({
                    error   : false,
                    message : "Login done successfully",
                    userDoc : result
                })
            }
        })


        function findUser(callback) {
            User.findOne({ "email": email }).exec((err, docs) => {
                if(err) { return callback(err) }

                else { return callback(null, docs)}
            })
        }

        function checkUser(userDoc, callback) {
            if(userDoc && userDoc.validPassword(password)) {
                return callback(null, userDoc)
            }

            else if(userDoc && !userDoc.validPassword(password)) {
                return res.send({
                    error   : true,
                    message : "Password is incorrect"
                })
            }

            else { 
                return res.send({
                    error   : true,
                    message : "Enter valid email and password"
                }) 
            }
        }

    }
}

module.exports = {
    authUser
}