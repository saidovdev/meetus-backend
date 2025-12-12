const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token yo‘q" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Token iskirgan" });
      req.user = user;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi", err });
  }
};

module.exports = authenticateToken;
