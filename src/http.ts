import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import "./database/index";
import { routes } from "./routes";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("viewengine", "html");

app.get("/client", (req, res) => {
	return res.render("html/client.html");
});

app.get("/admin", (req, res) => {
	return res.render("html/admin.html");
});

export const http = createServer(app); //Criando protocolo http
export const io = new Server(http); // Criando protocolo websocket (ws)

io.on("connection", (socket: Socket) => {
	console.log("conectado usuário ", socket.id);
});

app.use(routes);

/**
 * GET = Buscas
 * POST = Criação
 * PUT = Alteração
 * DELETE = Deleção
 * PATCH = Alterar uma informação específica
 */

app.get("/", (request, response) => {
	return response.json({
		message: "Olá NLW 05.",
	});
});

app.post("/users", (request, response) => {
	return response.json({ message: "Usuário conectado." });
});
