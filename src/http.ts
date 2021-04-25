import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import "./database";
import { routes } from "./routes";
import path from "path";

const app = express();

const http = createServer(app); //Criando protocolo http
const io = new Server(http); // Criando protocolo websocket (ws)

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.json());

app.use(routes);

app.get("/client", (req, res) => {
	return res.render("html/client.html");
});

app.get("/admin", (req, res) => {
	return res.render("html/admin.html");
});

io.on("connection", (socket: Socket) => {
	console.log("conectado usuário ", socket.id);
});

export { http, io };

/**
 * GET = Buscas
 * POST = Criação
 * PUT = Alteração
 * DELETE = Deleção
 * PATCH = Alterar uma informação específica
 */
