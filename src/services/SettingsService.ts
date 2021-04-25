import { getCustomRepository, Repository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { Settings } from "../entities/Settings";

interface SettingsInterface {
	username: string;
	chat: boolean;
}

class SettingsService {
	// Para não criar o Repositorio toda vez, criamos um private e um constructor, que afetam toda a classe que a contem, mencionamos tal constructor com o this. e podemos usar em vários pontos do codigo.
	private settingsRepo: Repository<Settings>;

	constructor() {
		this.settingsRepo = getCustomRepository(SettingsRepository);
	}
	async create({ username, chat }: SettingsInterface) {
		//Select * from settings where username = 'username' limit 1;
		const userAlreadyExists = await this.settingsRepo.findOne({
			username,
		});

		if (userAlreadyExists) throw new Error("User already exists!");

		const settings = this.settingsRepo.create({
			username,
			chat,
		});

		await this.settingsRepo.save(settings);
	}

	async findByUsername(username: string) {
		const settings = await this.settingsRepo.findOne({
			username,
		});

		return settings;
	}
	async update(username: string, chat: boolean) {
		await this.settingsRepo
			.createQueryBuilder()
			.update(Settings)
			.set({ chat })
			.where("username = :username", {
				username,
			})
			.execute();
	}
}

export { SettingsService };
