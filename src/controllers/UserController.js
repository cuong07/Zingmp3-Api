const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require("dotenv").config();

const uploadFiles = require('../utils/uploadImage')


let refreshTokens = [];

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user.id, admin: user.admin },
        process.env.SECRET_KEY,
        { expiresIn: "365d" }
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user.id, admin: user.admin },
        process.env.SECRET_REFRESHTOKEN_KEY,
        { expiresIn: "365d" }
    );
}


exports.signup = async (req, res, next) => {
    const { username, email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng cho một tài khoản khác. Vui lòng sử dụng email khác để đăng ký' });
        }
        const hashPassword = await bcrypt.hash(password, 8);
        const urls = await uploadFiles(req, res);

        const result = await User.create({
            email,
            password: hashPassword,
            username,
            name,
            images: urls,
        });

        const token = generateToken(result);
        res.status(200).json({
            user: result,
            token: token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
}

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email: email } })
        if (!existingUser) {
            return res.status(403).json({ message: "Không tìm thấy người dùng" })
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password)
        if (!matchPassword) {
            return res.status(403).json({ message: "Mật khẩu không đúng mời nhập lại" })
        }

        const token = generateToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser)

        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: 'none'
        })

        res.status(201).json({
            user: existingUser,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}


exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: "You're not not authenticated" })
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: "Token is not valid" });

    try {
        const user = jwt.verify(refreshToken, process.env.SECRET_REFRESHTOKEN_KEY);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none'
        })

        res.status(200).json({
            newToken
        })

        next();
    } catch (error) {
        console.log(error);
    }
}


exports.logout = (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter((token) => token !== req.cookie.refreshToken)
    res.status(200).json({ message: "Login successfully" })
}