import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.mjs";
import Book from "../models/Book.mjs";
import multer from "multer";
import sharp from "sharp";
import { writeFile } from "fs/promises";
import { join } from "path";
import { generateFilename, imagesDir } from "../lib/generateFilename.mjs";

const booksRouter = Router();

booksRouter.get("/", async (req, res) => {
  const books = await Book.find();

  res.json(books);
});

booksRouter.get("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findOne({ _id: req.params.id });
  } catch (error) {
    return res.status(404).json(error);
  }

  res.json(book);
});

booksRouter.get("/bestrating", async (req, res) => {
  let books;
  try {
    books = Book.find().limit(3).sort("averageRating").exec();
  } catch (error) {
    return res.status(500).json(error);
  }

  res.json(books);
});

booksRouter.post(
  "/",
  authMiddleware(),
  multer().single("image"),
  async (req, res) => {
    const data = JSON.parse(req.body.book);
    const image = req.file;

    const buffer = await sharp(image.buffer).webp().toBuffer();
    const filename = generateFilename();

    const book = new Book({
      userId: req.auth._id,
      title: data.title,
      author: data.author,
      year: parseInt(data.year),
      genre: data.genre,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
      ratings: [{ userId: req.auth._id, grade: data.ratings[0].grade }],
      averageRating: data.ratings[0].grade,
    });

    try {
      await book.save();
    } catch (error) {
      return res.status(500).json(error);
    }

    try {
      await writeFile(join(imagesDir, filename), buffer);
    } catch {
      return res.status(400).json({ message: "Image invalide." });
    }

    res.status(201).json({ message: "201: created" });
  }
);

booksRouter.put(
  "/:id",
  authMiddleware(),
  multer().single("image"),
  async (req, res) => {
    const image = req.file;
    const data = image ? JSON.parse(req.body.book) : req.body;

    let buffer = null;
    let filename = null;
    if (image) {
      buffer = await sharp(image.buffer).webp().toBuffer();
      filename = generateFilename();
      data.imageUrl = `${req.protocol}://${req.get("host")}/images/${filename}`;
    }

    try {
      await Book.updateOne({ _id: req.params.id }, data);
    } catch (error) {
      return res.status(400).json(error);
    }

    if (buffer && filename) {
      try {
        await writeFile(join(imagesDir, filename), buffer);
      } catch {
        return res.status(400).json({ message: "Image invalide." });
      }
    }

    res.json({ message: "200: ok" });
  }
);

export default booksRouter;
