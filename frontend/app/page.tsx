import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Head>
				<title>Learn Better AI</title>
			</Head>

			<main className="flex flex-col items-center w-full flex-1 px-20 text-center">
				<h1 className="text-4xl font-bold">Welcome to Learn Better AI</h1>
				<p className="mt-4 text-lg">
					Upload your study material and let AI generate flashcards, quizzes,
					and more!
				</p>

				<Link href="/upload">
					<button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
						Get Started
					</button>
				</Link>
			</main>
		</div>
	);
};

export default Home;
