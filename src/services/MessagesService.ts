import { MessagesRepository } from "../repositories/MessagesRepository";
import { Message } from "../entities/Message";
import { getCustomRepository, Repository } from "typeorm";

interface IMessageCreate {
	admin_id?: string;
	text: string;
	user_id: string;
}

class MessageService {
	// Para não criar o Repositorio toda vez, criamos um private e um constructor, que afetam toda a classe que a contem, mencionamos tal constructor com o this. e podemos usar em vários pontos do codigo.
	private messagesRepository: Repository<Message>;

	constructor() {
		this.messagesRepository = getCustomRepository(MessagesRepository);
	}

	async create({ admin_id, text, user_id }: IMessageCreate) {
		const message = this.messagesRepository.create({
			admin_id,
			text,
			user_id,
		});

		await this.messagesRepository.save(message);
		return message;
	}

	async listByUser(user_id: string) {
		const messagesRepository = getCustomRepository(MessagesRepository);
		const list = await messagesRepository.find({
			where: { user_id },
			relations: ["user"],
		});
		return list;
	}
}

export { MessageService };
