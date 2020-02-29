const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {

    //create user
    add: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const name = req.body.name;
                const password = req.body.password;

                let user = new User();
                user.name = name;
                user.password = password;

                //hash password by save method
                user.save((err, user) => {
                    if (!err) {
                        result.status = status;
                        result.result = user;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }

                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;

                res.status(status).send(result);
            }
        });
    },

    //do login
    login: (req, res) => {
        const { name, password } = req.body;

        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                User.findOne({ name }, (err, user) => {
                    if (!err && user) {
                        //check password
                        bcrypt.compare(password, user.password)
                            .then(match => {
                                if (match) {
                                    //create token
                                    const payload = { user: user.name };
                                    const options = { expiresIn: '2d', issuer: 'https://smarthome.io' };
                                    const secret = process.env.JWT_SECRET;
                                    const token = jwt.sign(payload, secret, options);

                                    result.token = token;
                                    result.status = status;
                                    result.result = user;
                                } else {
                                    status = 401;
                                    result.status = status;
                                    result.result = 'authentication error';
                                }

                                res.status(status).send(result);

                            }).catch(err => {
                                status = 500;
                                result.status = status;
                                result.error = err;

                                res.status(status).send(result);
                            });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = err;

                        res.status(status).send(result);
                    }
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;

                res.status(status).send(result);
            }
        });
    },

    //get all users
    getAll: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
            let result = {};
            status = 200;

            if (!err) {
                const payload = req.decoded;
                if (payload && payload.user === 'admin') {
                    User.find((err, users) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = users;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }

                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;

                    res.status(status).send(result);
                }
            } else {
                status = 500;
                result.status = status;
                result.error = err;

                res.status(status).send(result);
            }
        });
    },

}