import { MessagesRepository } from "../repositories/MessagesRepository";
import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";

interface IMessageCreate {
	admin_id?: string;
	text: string;
	user_id: string;
}

class MessageService {
	// Para não criar o Repositorio toda vez, criamos um private e um constructor, que afetam toda a classe que a contem, mencionamos tal constructor com o this. e podemos usar em vários pontos do codigo.
	private messagesRepo: Repository<Message>;

	constructor() {
		this.messagesRepo = getCustomRepository(MessagesRepository);
	}

	async create({ admin_id, text, user_id }: IMessageCreate) {
		const message = this.messagesRepo.create({
			admin_id,
			text,
			user_id,
		});

		await this.messagesRepo.save(message);
		return message;
	}

	async listByUser(user_id: string) {
		const list = await this.messagesRepo.find({
			where: { user_id },
			relations: ["user"],
		});
		return list;
	}
}

export { MessageService };
