import { getCustomRepository, Repository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import { User } from "../entities/User";

class UsersService {
	// Para não criar o Repositorio toda vez, criamos um private e um constructor, que afetam toda a classe que a contem, mencionamos tal constructor com o this. e podemos usar em vários pontos do codigo.
	private usersRepo: Repository<User>;
	constructor() {
		this.usersRepo = getCustomRepository(UsersRepository);
	}

	async create(email: string) {
		//Verificar se o user existe, se não: salvar na DB, se sim, return user;
		const userExists = await this.usersRepo.findOne({
			email,
		});
		if (userExists) {
			return userExists;
		}
		const user = this.usersRepo.create({
			email,
		});
		await this.usersRepo.save(user);
		return user;
	}
	async findByEmail(email: string) {
		const user = await this.usersRepo.findOne({ email });

		return user;
	}
}
export { UsersService };
