import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessageService } from "../services/MessagesService";

interface IParams {
	text: string;
	email: string;
}

io.on("connect", (socket) => {
	const connectionsService = new ConnectionsService();
	const usersService = new UsersService();
	const messageService = new MessageService();
	//Eventos do client
	socket.on("client_first_access", async (params) => {
		const socket_id = socket.id;
		const { text, email } = params as IParams;
		let user_id = null;

		const userExists = await usersService.findByEmail(email);

		if (!userExists) {
			const user = await usersService.create(email);
			user_id = user.id;

			await connectionsService.create({
				socket_id,
				user_id,
			});
		} else {
			user_id = userExists.id;
			const connection = await connectionsService.findByUserId(user_id);

			if (!connection) {
				await connectionsService.create({
					socket_id,
					user_id,
				});
			} else {
				connection.socket_id = socket.id;
				await connectionsService.create(connection);
			}
		}

		await messageService.create({
			text,
			user_id,
		});

		const allMessages = await messageService.listByUser(user_id);

		socket.emit("client_list_all_messages", allMessages);

		const connectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
		io.emit("connections_without_admin", connectionsWithoutAdmin);
	});

	socket.on("client_send_to_admin", async (params) => {
		const { text, socket_admin_id } = params;
		const socket_id = socket.id;

		const { user_id } = await connectionsService.findBySocketId(socket_id);

		const message = await messageService.create({ text, user_id });
		if (socket_admin_id) {
			io.to(socket_admin_id).emit("admin_receive_message", {
				message,
				socket_id,
			});
		}
	});
});
