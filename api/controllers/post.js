import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { JWT_SECRET } from "../config.js";

export const getPosts = (req, res) => {
  (async () => {
    try {
      const database = getDb();
      const posts = database.collection("posts");

      const filter = req.query.cat ? { cat: req.query.cat } : {};
      const data = await posts
        .find(filter)
        .sort({ date: -1, createdAt: -1 })
        .toArray();

      // keep MySQL-like "id"
      return res.status(200).json(
        data.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }))
      );
    } catch (err) {
      return res.status(500).send({ error: err.message ?? err });
    }
  })();
};

export const getPost = (req, res) => {
  (async () => {
    try {
      const database = getDb();
      const posts = database.collection("posts");
      const users = database.collection("users");

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid post id");
      }

      const post = await posts.findOne({ _id: new ObjectId(req.params.id) });
      if (!post) return res.status(404).json("Post not found!");

      const author =
        post.uid && ObjectId.isValid(post.uid)
          ? await users.findOne({ _id: new ObjectId(post.uid) })
          : post.uid
            ? await users.findOne({ _id: new ObjectId(post.uid.toString()) })
            : null;

      return res.status(200).json({
        id: post._id.toString(),
        username: author?.username ?? null,
        title: post.title,
        desc: post.desc,
        img: post.img ?? null,
        userImg: author?.img ?? null,
        cat: post.cat ?? null,
        date: post.date ?? null,
        uid: post.uid?.toString?.() ?? post.uid ?? null,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message ?? err });
    }
  })();
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  // Allow publishing without login as well (uid will be null)
  if (!token) {
    (async () => {
      try {
        const database = getDb();
        const posts = database.collection("posts");

        await posts.insertOne({
          title: req.body.title,
          desc: req.body.desc,
          img: req.body.img ?? null,
          cat: req.body.cat ?? null,
          date: req.body.date ?? new Date().toISOString(),
          uid: null,
          createdAt: new Date(),
        });

        return res.json("Post has been created.");
      } catch (e) {
        return res.status(500).json({ error: e.message ?? e });
      }
    })();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    (async () => {
      try {
        const database = getDb();
        const posts = database.collection("posts");

        const uid = ObjectId.isValid(userInfo.id)
          ? new ObjectId(userInfo.id)
          : userInfo.id;

        await posts.insertOne({
          title: req.body.title,
          desc: req.body.desc,
          img: req.body.img ?? null,
          cat: req.body.cat ?? null,
          date: req.body.date ?? new Date().toISOString(),
          uid,
          createdAt: new Date(),
        });

        return res.json("Post has been created.");
      } catch (e) {
        return res.status(500).json({ error: e.message ?? e });
      }
    })();
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    (async () => {
      try {
        const database = getDb();
        const posts = database.collection("posts");

        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json("Invalid post id");
        }

        const uid = ObjectId.isValid(userInfo.id)
          ? new ObjectId(userInfo.id)
          : userInfo.id;

        const result = await posts.deleteOne({
          _id: new ObjectId(req.params.id),
          uid,
        });

        if (!result.deletedCount)
          return res.status(403).json("You can delete only your post!");

        return res.json("Post has been deleted!");
      } catch (e) {
        return res.status(500).json({ error: e.message ?? e });
      }
    })();
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    (async () => {
      try {
        const database = getDb();
        const posts = database.collection("posts");

        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json("Invalid post id");
        }

        const uid = ObjectId.isValid(userInfo.id)
          ? new ObjectId(userInfo.id)
          : userInfo.id;

        const result = await posts.updateOne(
          { _id: new ObjectId(req.params.id), uid },
          {
            $set: {
              title: req.body.title,
              desc: req.body.desc,
              img: req.body.img ?? null,
              cat: req.body.cat ?? null,
              updatedAt: new Date(),
            },
          }
        );

        if (!result.matchedCount)
          return res.status(403).json("You can update only your post!");

        return res.json("Post has been updated.");
      } catch (e) {
        return res.status(500).json({ error: e.message ?? e });
      }
    })();
  });
};
