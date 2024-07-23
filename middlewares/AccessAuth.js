const { verifyJwtToken } = require("../helpers/JWT.Verify");
const User = require("../models/User.model");

const accessAuth = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("token: ", token);
            // return res
            //   .status(401)
            //   .send("Authorization Not Procces Because Of Bad Token");
            const payload = await verifyJwtToken(token);
            const user = await User.findOne({ email: payload.email });
            if (user) {
                console.log("user in Authorization", user);
                req.user = user;
                next();
            } else {
                return res.status(401).json({
                    error: "Authorization Not Procces Because Of Bad Token",
                });
            }
        } catch (error) {
            console.log("error: ", error);
            return res.status(401).json({
                error: "Authorization Not Procces Because Of Bad Token",
            });
        }
    } else {
        return res
            .status(401)
            .json({ error: "Authorization Not Procces Because Of Bad Token" });
    }
};

const authorizeUser = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            try {
                const findRole = await User.findOne({
                    email: req.user.email,
                }).select("role");
                console.log("findRole: ", findRole);

                if (!roles.includes(findRole.role)) {
                    console.log("Access denied 1");
                    return res.status(403).json({ error: "Access denied" });
                } else {
                    next();
                }
            } catch (error) {
                console.log("error: ", error);
                console.log("Access denied 2");
                return res.status(403).json({ error: "Access denied" });
            }
        } else {
            if (!roles.includes(req.user.role)) {
                console.log(
                    "req.user.role: ",
                    req.user.role,
                    "roles: ",
                    roles[0],
                );
                console.log("Access denied 3");
                return res.status(403).json({
                    error: `Access denied because you are a ${req.user.role}`,
                });
            } else {
                next();
            }
        }
    };
};

module.exports = { accessAuth, authorizeUser };
