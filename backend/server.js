import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs/promises';
import OpenAI from 'openai';

const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
	res.json({ message: 'Hello from the server!' });
});

// OpenAI Configuration
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).send({ message: 'No file uploaded.' });
	}
	res
		.status(200)
		.send({ message: 'File uploaded successfully!', filePath: req.file.path });
});

// Helper function to split content into chunks
const splitContentIntoChunks = (content, maxTokens) => {
	const chunks = [];
	let currentChunk = '';

	content.split(' ').forEach((word) => {
		if ((currentChunk + word).length > maxTokens) {
			chunks.push(currentChunk);
			currentChunk = word;
		} else {
			currentChunk += ' ' + word;
		}
	});

	if (currentChunk) {
		chunks.push(currentChunk);
	}

	return chunks;
};

// Generate Flashcards Endpoint
app.post('/api/generate', async (req, res) => {
	const { filePath } = req.body;
	try {
		const content = await fs.readFile(filePath, 'utf-8');
		const chunks = splitContentIntoChunks(content, 2000); // Adjust maxTokens as needed
		const flashcards = [];
		const partialContent = content.substring(0, 20);

		// for (const chunk of chunks) {
		const response = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{
					role: 'user',
					content: `Generate flashcards from this content: ${content}`,
				},
			],
		});

		console.log(response);
		flashcards.push(response.choices[0].message.content);
		console.log(
			'response.choices[0].message.content',
			response.choices[0].message.content
		);
		console.log(flashcards);
		// }

		res.send({ flashcards });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Error generating flashcards.' });
	}
});

// Dashboard Data Endpoint
app.get('/api/dashboard', async (req, res) => {
	try {
		// Fetch or generate the data for the dashboard
		const flashcards = ['Flashcard 1', 'Flashcard 2']; // Replace with actual data
		const quizzes = ['Quiz 1', 'Quiz 2']; // Replace with actual data
		const mindMaps = ['Mind Map 1', 'Mind Map 2']; // Replace with actual data
		const studySchedules = ['Schedule 1', 'Schedule 2']; // Replace with actual data

		res.send({ flashcards, quizzes, mindMaps, studySchedules });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Error fetching dashboard data.' });
	}
});

// Start Server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
