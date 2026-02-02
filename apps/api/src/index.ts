import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { requestLogger } from "./utils/logger";
import { generateCode } from "./ai/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		message: "Welcome to snap-to-code API",
		version: "v1",
	});
});

app.get("/health", (req: Request, res: Response) => {
	res.status(200).json({ status: "API is healthy" });
});

app.post("/generate", async (req: Request, res: Response, next: NextFunction) => {
	const { base64Buffer } = req.body;

	if (!base64Buffer) {
		res.status(404).json({
			success: false,
			message: "Image Url Required",
		});
		return;
	}

	const arr = base64Buffer.split(",");
	const mime = arr[0].slice(5).split(";")[0];
	const base64ImageFile = arr[1];

	try {
		const result = await generateCode(mime, base64ImageFile);
		res.status(200).json({
			success: true,
			message: result,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error });
	}
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
