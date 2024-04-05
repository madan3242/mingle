import mongoose from "mongoose";
import { MessageInterface } from "../interfaces";

const messageSchema = new mongoose.Schema<MessageInterface>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
