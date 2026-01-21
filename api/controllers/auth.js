import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db.js";
import { JWT_SECRET } from "../config.js";

export const register = async (req, res) => {
  try {
    const database = getDb();
    const users = database.collection("users");

    const existing = await users.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (existing) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await users.insertOne({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      img: req.body.img ?? null,
      createdAt: new Date(),
    });

    return res.status(200).json("User has been created.");
  } catch (err) {
    return res.status(500).json({ error: err.message ?? err });
  }
};

export const login = async (req, res) => {
  try {
    const database = getDb();
    const users = database.collection("users");

    const user = await users.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

    // keep response shape close to MySQL version: include "id"
    // eslint-disable-next-line no-unused-vars
    const { password, _id, ...other } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ id: _id.toString(), ...other });
  } catch (err) {
    return res.status(500).json({ error: err.message ?? err });
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("User has been logged out.")
};
