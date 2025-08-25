const { users } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");

const register = async(req,res) => {
    const {username, password} = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        //validasi username tidak boleh sama
        const existingUser = await users.findOne({
            where: {
                username
            }
        })
        if(existingUser) return res.status(400).json({msg: "username sudah dipakai"})

        //username regex
        const usernameRegex = /^[a-zA-z0-9]{12}$/;
        if(!usernameRegex.test(username)) return res.status(400).json({msg: 'pastikan username 12 huruf dan tanpa spasi'})
            
        await users.create({
            username: username,
            password: hashPassword
        })
        res.json("user berhasil dibuat")
    } catch (error) {
        console.log(error)
    }
}

const login = async(req, res) => {
    try {
        const user = await users.findOne({
            where: {username: req.body.username}
        })
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg: "password salah!"})
        const userId = user.id
        const username = user.username

        const accessToken = jwt.sign(
        {userId, username}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })

        const refreshToken = jwt.sign(
        {userId, username}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        }
        )

        await users.update({
            refresh_token: refreshToken
        },{
            where: {
                id: userId
            }
        }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.json({accessToken})
    } catch (error) {
        res.status(404).json({msg: "username atau password salah!"})
        console.log(error)
    }
}

const logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(204);
    const user = await users.findOne({
        refresh_token: refreshToken,
    })
    if(!user) return res.status(204);
    const userId = user.id
    await user.update({
        refresh_token: null
    }, {
        where: userId
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}

const updateUsername = async(req, res) => {
    const {username} = req.body;
    const user = await users.findOne({
        username: username
    })
    if(!user) return res.sendStatus(400)
    await users.update({
        username: username
    }, {
        where: {
            id: req.userId
        }
    })
    return res.status(200).json({msg: "username berhasil diganti"})
}

const changePassword = async(req, res) => {
    const {password} = req.body;
    const salt = await bcrypt.genSalt();
    const hashNewPassword = await bcrypt.hash(password, salt)
    const user = await users.findOne({
        password: password
    })
    if(!user) return res.sendStatus(500)
    await users.update({
        password: hashNewPassword
    }, {
        where: {
            id: req.userId
        }
    })
    return res.status(200).json({msg: "password berhasil diganti"})
}

module.exports = {
    register,
    login,
    logout,
    updateUsername,
    changePassword
}