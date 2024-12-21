'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

interface GeneratedDataContextType {
	flashcards: string[];
	quizzes: string[];
	mindMaps: string[];
	studySchedules: string[];
	setGeneratedData: (data: {
		flashcards: string[];
		quizzes: string[];
		mindMaps: string[];
		studySchedules: string[];
	}) => void;
}

const GeneratedDataContext = createContext<
	GeneratedDataContextType | undefined
>(undefined);

export const GeneratedDataProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [flashcards, setFlashcards] = useState<string[]>([]);
	const [quizzes, setQuizzes] = useState<string[]>([]);
	const [mindMaps, setMindMaps] = useState<string[]>([]);
	const [studySchedules, setStudySchedules] = useState<string[]>([]);

	const setGeneratedData = (data: {
		flashcards: string[];
		quizzes: string[];
		mindMaps: string[];
		studySchedules: string[];
	}) => {
		setFlashcards(data.flashcards);
		setQuizzes(data.quizzes);
		setMindMaps(data.mindMaps);
		setStudySchedules(data.studySchedules);
	};

	return (
		<GeneratedDataContext.Provider
			value={{
				flashcards,
				quizzes,
				mindMaps,
				studySchedules,
				setGeneratedData,
			}}
		>
			{children}
		</GeneratedDataContext.Provider>
	);
};

export const useGeneratedData = () => {
	const context = useContext(GeneratedDataContext);
	if (!context) {
		throw new Error(
			'useGeneratedData must be used within a GeneratedDataProvider'
		);
	}
	return context;
};
