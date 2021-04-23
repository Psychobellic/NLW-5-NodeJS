import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
	async create(req: Request, res: Response) {
		const { username, chat } = req.body;

		const settingsService = new SettingsService();

		try {
			const settings = await settingsService.create({ username, chat });

			return res.status(201).json(settings);
		} catch (err) {
			return res.status(400).json({
				message: err.message,
			});
		}
	}
	async findByUsername(req: Request, res: Response) {
		const { username } = req.params;

		const settingsService = new SettingsService();
		const settings = await settingsService.findByUsername(username);
		return res.json(settings);
	}
}

export { SettingsController };
