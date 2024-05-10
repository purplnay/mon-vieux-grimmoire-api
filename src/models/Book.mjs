import { Schema, model } from "mongoose";

const bookSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      grade: { type: Number, required: true },
    }),
  ],
  averageRating: { type: Number, required: true, default: 0 },
});

export default model("Book", bookSchema);
