import { Socket } from "socket.io"
import cookie from "cookie";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models";
import { Request } from "express";
import { ChatEventEnums } from "../constants";

// io.on("connection", async(socket) => {
//   console.log("Connected with Socket.IO");

//   socket.on("joinChat", (chatId) => {
//     console.log(`User joined the chat. chatId: ${chatId}`);
//     socket.join(chatId);
//   });

//   socket.on("typing", (chatId) => {
//     socket.in(chatId).emit("typing", chatId);
//   });

//   socket.on("stopTyping", (chatId) => {
//     socket.in(chatId).emit("stopTyping", chatId);
//   })

//   socket.on("setup", (userData) => {
//     console.log(userData._id);
//     socket.emit("connected");
//   })

//   socket.on("newMessage", (newMessageReceived) => {
//     let chat = newMessageReceived.chat;

//     if(!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user: any) => {
//       if (user._id == newMessageReceived.sender._id) return;

//       socket.in(user._id).emit("message received", newMessageReceived)
//     });
//   });

//   socket.off("setup", (userData) => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id)
//   })
// });


const initilizeSocketIO = (io: any) => {
    return io.on("connection", async(socket: Socket) => {
        console.log("Connected with Socket.IO");
        try {
            // // parse the cookies from the handshake headers (This is only possible if client has `withCredintials: true`)
            // const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

            // let token = cookies?.accessToken;

            // if (!token) {
            //     // if there is no access token in cookies. Check inside the handshake auth
            //     token = socket.handshake.auth?.token;
            // }

            // if (!token) {
            //     // Token is required for the socket to work
            //     throw new ErrorHandler(401, "Unauthorized handshake, Token is missing");
            // }

            // const decodedToken = jwt.verify(token, JWT_SECRET);

            // const user = await User.findById(decodedToken?._id).select(
            //     "-password"
            // );

            // // retrive the user
            // if (!user) {
            //     throw new ErrorHandler(401, "Unauthorized handshake, Token is invalid");
            // }

            // socket.user = user;

            socket.on(ChatEventEnums.JOIN_CHAT_EVENT, (chatId) => {
                console.log(`User joined the chat. chatId: ${chatId}`);
                socket.join(chatId);
            })

            socket.on(ChatEventEnums.TYPING_EVENT, (chatId) => {
                socket.in(chatId).emit(ChatEventEnums.TYPING_EVENT, chatId);
            });

            socket.on(ChatEventEnums.STOP_TYPING_EVENT, (chatId) => {
                socket.in(chatId).emit(ChatEventEnums.STOP_TYPING_EVENT, chatId);
            });

            socket.on(ChatEventEnums.DISCONNECT_EVENT, (chatId) => {
                console.log(`User disconnected`);
                socket.leave(chatId);
            });
        } catch (error: any) {
            socket.emit(
                ChatEventEnums.SOCKET_ERROR_EVENT,
                error?.message || "Something went wrong while connecting to the socket."
            )
        }
    })
};

const emitSocketEvent = (req: Request, roomId: string, event: string, payload: any) => {
    req.app.get("io").in(roomId).emit(event, payload);
};

export { initilizeSocketIO, emitSocketEvent };