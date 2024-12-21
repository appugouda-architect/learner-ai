'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from '../../components/ui/card';
import { motion } from 'framer-motion';
import { useGeneratedData } from '../context/GeneratedDataContext'; // Corrected import path

export default function Dashboard() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	const { flashcards, quizzes, mindMaps, studySchedules } = useGeneratedData();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		if (error) {
			setErrorMessage(error);
		}
	}, [error]);

	return (
		<motion.div
			className="flex flex-col items-center justify-center min-h-screen py-2"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Card className="w-full max-w-4xl">
				<CardHeader>
					<h1 className="text-2xl font-bold text-center text-blue-500">
						Dashboard
					</h1>
				</CardHeader>
				<CardContent>
					{errorMessage ? (
						<p className="mt-4 text-lg text-red-500">{errorMessage}</p>
					) : (
						<>
							<h2 className="text-xl font-semibold">Flashcards</h2>
							<ul className="list-disc pl-5">
								{flashcards.map((flashcard, index) => (
									<li key={index}>{flashcard}</li>
								))}
							</ul>

							<h2 className="text-xl font-semibold mt-6">Quizzes</h2>
							<ul className="list-disc pl-5">
								{quizzes.map((quiz, index) => (
									<li key={index}>{quiz}</li>
								))}
							</ul>

							<h2 className="text-xl font-semibold mt-6">Mind Maps</h2>
							<ul className="list-disc pl-5">
								{mindMaps.map((mindMap, index) => (
									<li key={index}>{mindMap}</li>
								))}
							</ul>

							<h2 className="text-xl font-semibold mt-6">Study Schedules</h2>
							<ul className="list-disc pl-5">
								{studySchedules.map((schedule, index) => (
									<li key={index}>{schedule}</li>
								))}
							</ul>
						</>
					)}
				</CardContent>
				<CardFooter />
			</Card>
		</motion.div>
	);
}
