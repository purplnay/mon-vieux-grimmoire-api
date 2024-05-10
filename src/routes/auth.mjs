import { Router, json } from "express";
import User from "../models/User.mjs";
import { compare, hash } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const authRouter = Router();

authRouter.use(json());

authRouter.post("/signup", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: await hash(req.body.password, 10),
  });

  try {
    await user.save();
  } catch (error) {
    return res.status(400).json(error);
  }

  res.status(201).json({ message: "201: created" });
});

authRouter.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json(new Error("Utilisateur inconnu."));
  }

  if (!(await compare(req.body.password, user.password))) {
    return res.status(400).json(new Error("Mot de passe invalide."));
  }

  const token = jsonwebtoken.sign({ _id: user._id }, process.env.SECRET);

  res.json({ token, userId: user._id });
});

export default authRouter;
