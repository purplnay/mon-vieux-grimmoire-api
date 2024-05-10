import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.mjs";
import Book from "../models/Book.mjs";
import multer from "multer";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Create the images directory if needed
const imagesDir = join(import.meta.dirname, "..", "..", "images");

if (!existsSync(imagesDir)) {
  mkdir(imagesDir);
}

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
    let filename;
    do {
      filename = `${randomUUID()}.webp`;
    } while (existsSync(join(imagesDir, filename)));

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
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Image invalide." });
    }

    res.status(201).json({ message: "201: created" });
  }
);

export default booksRouter;
