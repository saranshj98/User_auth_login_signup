const mongoose  = require('mongoose')
const User      = require('../../model/user')


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

    //user try to signup
    else if(username) {
        User.findOne({ "email": email }).exec((err, docs) => {
            if (err) { 
                return res.send({
                    error : true,
                    message : "Database Error"
                })
            }
            
            else if (docs) {
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
                    if (er) { 
                        return res.send({
                            error: true,
                            message: "Database error"
                        })
                    }

                    else {
                        return res.send({
                            error : false,
                            message: "Signup done successfully",
                            userDoc: user
                        })
                    }
                    
                })
            }
        })
    }

    //user try to login
    else {
        User.findOne({ "email": email }).exec((err, docs) => {
            if (err) { 
                return res.send({
                    error : true,
                    message : "Database Error"
                })
            }

            else if (docs) {

                if (docs.validPassword(password)) {
                    return res.send({
                        error : false,
                        message : "Login done successfully",
                        userDoc: docs
                    })
                } 

                else { 
                    return res.send({
                        error   : true,
                        message : "Please enter a valid password"
                    })
                }

            }

            else { 
                return res.send({
                    error : true,
                    message : "Enter valid email and password"
                }) 
            } 
        })
    }
}

module.exports = {
    authUser
}