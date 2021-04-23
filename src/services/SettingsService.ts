import { getCustomRepository, Repository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { Settings } from "../entities/Settings";

interface SettingsInterface {
	chat: boolean;
	username: string;
}

class SettingsService {
	// Para não criar o Repositorio toda vez, criamos um private e um constructor, que afetam toda a classe que a contem, mencionamos tal constructor com o this. e podemos usar em vários pontos do codigo.
	private settingsRepository: Repository<Settings>;

	constructor() {
		this.settingsRepository = getCustomRepository(SettingsRepository);
	}
	async create({ chat, username }: SettingsInterface) {
		//Select * from settings where username = 'username' limit 1;
		const userAlreadyExists = await this.settingsRepository.findOne({
			username,
		});
		if (userAlreadyExists) {
			throw new Error("User already exists!");
		}

		const settings = this.settingsRepository.create({
			chat,
			username,
		});

		await this.settingsRepository.save(settings);

		return settings;
	}
}

export { SettingsService };