import { createConnection } from "typeorm";

const database = () => {
	createConnection();
};

export default database;
