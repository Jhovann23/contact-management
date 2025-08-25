const { where } = require("sequelize");
const { users } = require("../models");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return res.status(403).json({ msg: "invalid token" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.status(403);
        const userId = user.id;
        const username = user.username;

        const accessToken = jwt.sign(
          { userId, username },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "20s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = refreshToken
