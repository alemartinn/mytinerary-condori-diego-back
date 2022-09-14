const User = require('../models/User');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const sendMail = require('./sendMail');

const userController ={

    signUp: async(req, res) => {
        let {name, lastName, mail, password, photo, country, role, from} = req.body;
        try{
            let user = await User.findOne({mail})
            if (!user){
                // let code: unique key of user or unique string.
                let code = crypto.randomBytes(15).toString('hex'); 
                let loggedIn = false;
                let verified = false;
                
                if (from === 'form'){
                    // Hash or hashing: This converts a password on a secure password who any human can't translate it or reference it. 
                    // Don't save passwords without hash it previously.
                    password = bcryptjs.hashSync(password, 10); // Level security 10.
                    user = await new User({name, lastName, mail, password, photo, country, role, from, loggedIn, verified, code}).save();
                    //Incorporate function to send a verification mail.
                    sendMail(mail, code);
                    res.status(201).json({
                        message: "User signed up.",
                        success: true
                    });
                } else{
                    password = bcryptjs.hashSync(password, 10); // Level security 10.
                    verified = false;
                    user = await new User({name, lastName, mail, password, photo, country, role, from: [from], loggedIn: loggedIn, verified, code}).save();
                    res.status(201).json({
                        message: "User signed up.",
                        success: true
                    });
                }
            } else {
                if (user.from.includes(from)){
                    res.status(200).json({
                        message: "User already registered",
                        success: false // Porque no completo el registro.
                    });
                } else{
                    user.from.push(from); //Agrego nuevo origen de registro.
                    user.verified = true;
                    user.password.push(bcryptjs.hashSync(password,10));
                    await user.save();
                    res.status(201).json({
                        message: "User signed up with " + from,
                        success: true
                    });
                }
            }
        }
        catch(error){
            console.log(error);
            res.status(400).json({
                message: "Couldn't signed up",
                success: false
            });
        }
    },
    //unique and random code generated by signup method
    verifyMail: async(req, res) => {
        
        const {code} = req.params;
        let userFounded = await User.findOne({code});

        try{
            if (userFounded){
                userFounded.verified = true;
                await userFounded.save();
                res.status(200).redirect('https://www.google.com');
            } else {
                res.status(404).json({
                    message: "This mail has not a vinculed account yet",
                    success: false
                });
            }
        }
        catch(error){
            console.log(error);
            res.status(400).json({
                message: "Something failed, try it again",
                success: false
            });
        }
    },
    //Method to sign in a user.
    signIn: async(req, res) => {

        const {mail, password, from} = req.body;
        
        try {
            const user = await User.findOne({mail});

            if(!user){
                res.status(404).json({
                    message: "User doesn't exist"
                })
            } else if (!user.verified){
                res.status(400).json({
                    message: "Please, verify your account",
                    success: false
                })
            } else {
                //Compare each element(password from db)
                const checkPass = user.password.filter(element=> bcryptjs.compareSync(password, element));
                if (from === 'form'){
                    if(checkPass.length > 0){

                        const userLogged = {
                            id: user._id,
                            role: user.role,
                            name: user.name,
                            mail: user.mail,
                            photo: user.photo,
                            from: user.from
                        }
                        user.loggedIn = true;
                        await user.save();

                        res.status(200).json({
                            message: 'Welcome '+user.name,
                            response: {user: userLogged},
                            success: true
                        });
                    }
                    else{
                        res.status(400).json({
                            message: "Failed to sign in",
                            success: false
                        });
                    }
                } else {
                    if(checkPass.length > 0){
                        const userLogged = {
                            id: user._id,
                            role: user.role,
                            name: user.name,
                            mail: user.mail,
                            photo: user.photo,
                            from: user.from
                        }
                        user.loggedIn = true;
                        await user.save();

                        res.status(200).json({
                            message: 'Welcome ' + user.name,
                            response: {user: userLogged},
                            success: true
                        });
                    }
                    else{
                        res.status(400).json({
                            message: "Invalid credentials",
                            success: false
                        });
                    }
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }
}

module.exports = userController;