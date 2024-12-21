'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGeneratedData } from '../context/GeneratedDataContext'; // Corrected import path

export default function Upload() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const router = useRouter();
	const { setGeneratedData } = useGeneratedData();

	const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		if (file) {
			formData.append('file', file);
		}

		try {
			const response = await fetch('http://localhost:8000/api/upload', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();
			console.log('Upload Response:', data);
			setMessage(data.message);

			if (response.ok) {
				await handleGenerate(data.filePath); // Invoke handleGenerate with the file path
			}
		} catch (error) {
			setMessage('Error uploading file.');
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleGenerate = async (filePath: string) => {
		try {
			const response = await fetch('http://localhost:8000/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filePath }), // Use the file path from the upload response
			});

			const data = await response.json();
			console.log('Generated Flashcards:', data.flashcards);

			// Store the generated data in context
			setGeneratedData({
				flashcards: data.flashcards,
				quizzes: data.quizzes || [],
				mindMaps: data.mindMaps || [],
				studySchedules: data.studySchedules || [],
			});

			// Navigate to the Dashboard page
			router.push('/dashboard');
		} catch (error) {
			setMessage('Error generating flashcards.');
			router.push('/dashboard?error=Error generating flashcards.');
		}
	};

	return (
		<motion.div
			className="flex flex-col items-center justify-center min-h-screen py-2"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Card className="w-full max-w-md">
				<CardHeader>
					<h1 className="text-2xl font-bold">Upload Your Study Material</h1>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleUpload} className="mt-4">
						<Input type="file" onChange={handleFileChange} className="mb-4" />
						<Button type="submit" variant="default" disabled={!file || loading}>
							{loading ? 'Uploading...' : 'Upload'}
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					{message && <p className="mt-4 text-lg">{message}</p>}
				</CardFooter>
			</Card>
		</motion.div>
	);
}
