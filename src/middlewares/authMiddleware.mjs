import jsonwebtoken from "jsonwebtoken";

const error = { message: "403: unauthorized request" };

export const authMiddleware = () => {
  return (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(403).json(error);
    }

    const parts = header.split(" ");

    if (parts.length !== 2) {
      return res.status(403).json(error);
    }

    if (parts[0].toLowerCase() !== "bearer") {
      return res.status(403).json(error);
    }

    let token;
    try {
      token = jsonwebtoken.verify(parts[1], process.env.SECRET);
    } catch {
      return res.status(403).json(error);
    }

    req.auth = { _id: token._id };
    next();
  };
};
