const JWT = require("jsonwebtoken");

const generateJwtToken = (payload) => {
    return JWT.sign(payload, process.env.JWT_SECRET);
};

const verifyJwtToken = async (token) => {
    const decoded = await JWT.verify(token, process.env.JWT_SECRET);
    return decoded;
};

module.exports = { generateJwtToken, verifyJwtToken };
