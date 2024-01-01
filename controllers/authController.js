const jwt = require('jsonwebtoken');
const User = require('../models/users');
const logger = require('../utils/logger');
const bcrypt = require('../utils/bcrypt');
const uuid = require('uuid4');
const Auth = require('../models/auth')

const register = async (req, res) => {
    logger.info("register API gets called.");
    const { username, password } = req.body;
    let code, resBody;
    if (!username || !password) {
        logger.error("All fields are required. Request Body", req.body)
        code = 400;
        resBody = {
            message: 'All fields are required'
        };
    } else {
        try {
            const user = new User();
            const userDoc = await User.find({ 'username': username });
            if (userDoc.length > 0) {
                code = 409;
                resBody = { message: "username already exist. username: " + username };
            } else {
                user._id = uuid();
                user.username = username;
                user.password = bcrypt.encrypt(password);

                await user.save();

                code = 201;
                resBody = {
                    message: "User created Successfully.",
                    userInfo: {
                        username: user.username,
                    }
                };

            }

        } catch (e) {
            logger.error(e.message);
            code = 500;
            resBody = {
                message: "An error has occured.",
                error: e.message,
            };
        }
    }

    res.status(code).json(resBody);

};

const login = async (req, res) => {
    logger.info("Login API gets called.");
    const { username, password } = req.body;
    let recoveryMsg = '', code, resBody;
    if (!username || !password) {
        logger.info('username and password required, RequestBody', req.body);
        code = 400
        resBody = { message: 'username and password required.' }
    } else {
        try {

            const userDoc = await User.findOne({ 'username': username });

            if (bcrypt.validate(password, userDoc.password)) {

                logger.info("User Verified with username: ", username);
                const token = jwt.sign(
                    {
                        userId: userDoc._id
                    },
                    process.env.SECRET,
                    {
                        expiresIn: "12h"
                    }
                );
                //creating auth doc in mongo
                const auth = new Auth();
                auth._id = uuid();
                auth.token = token;
                auth.isValid = true;
                auth.userId = userDoc._id;
                auth.save();
                logger.info("Auth doc inserted successfully.")
                if (userDoc['expiresAt']) {
                    logger.info("Accound under Grace Period.")
                    recoveryMsg = "Account recovered successfully."
                    userDoc.expiresAt = undefined;
                    userDoc.save();
                }
                logger.info("Auth Successful, Token:", token)
                code = 200;
                resBody = {
                    message: recoveryMsg != '' ? recoveryMsg : "Auth successful",
                    token: token
                };

            } else {
                logger.error("User Password Mis-Incorrect.");
                code = 401;
                resBody = {
                    message: "Incorrect password!"
                };
            }
        } catch (e) {
            logger.error(e.message, "username: " + username)
            code = 409;
            resBody = {
                message: "User doesn't exist with username.",
                error: e.message,
            };
        }
    }

    res.status(code).json(resBody);
};

const logout = async (req, res) => {
    logger.info("Logout API gets called.");

    let code, resBody;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token || token.startsWith('Bearer ')) {
        logger.info("Token starts with Bearer")
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            await Auth.findOneAndUpdate({ 'token': token }, { isValid: false });
            code = 200;
            resBody = {
                message: "User logout success."
            };
        } catch (e) {
            logger.error(e.message);
            code = 409;
            resBody = {
                message: "Error Occured while feteching authDoc from auths collection.",
                error: e.message
            }
        }
    }
    res.status(code).json(resBody);
}

const testUserCleanUp = async (req, res) => {
    let code, resBody;
    try {
        const filter = { 'username': "NotesAppTestUser" }
        const userDocs = await User.find(filter);
        if(userDocs.length == 0){
            code = 409;
            resBody = {
                message: "no test user doc exist in Users"
            };
            return res.status(code).json(resBody);
        }
        await User.deleteMany(filter);
        code = 200;
        resBody = {
            message: "Successfully deleted testUser.",
        };
        

    } catch (e) {
        logger.error(e.message);
        code = 500;
        resBody = {
            message: "Error occured while deleting test-User.",
            error: e.message,
        };
    }

    res.status(code).json(resBody);

}

module.exports = {
    register,
    login,
    logout,
    testUserCleanUp
};
