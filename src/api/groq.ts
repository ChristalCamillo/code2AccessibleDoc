import type { ContentToFeed } from './github';

async function groqFetch(url: string, body: string) {
	const openaiKey = import.meta.env.VITE_GROQ_KEY;
	const res = await fetch(url, {
		method: 'POST',
		body,
		headers: {
			Authorization: `Bearer ${openaiKey}`,
			'Content-Type': 'application/json'
		}
	});
	return res;
}

const systemPrompt =
	'You will write a documentation for the code repository given to you.\n\nThe documentation must have an output in Markdown and be as acessible to any reader as it can be, so making sure every image you may need to user has alt captions as well as good explanation of what\'s happening and good vertical disposition of the text to make it easier to read for screen readers.\n\nThe code you\'ll have to read to turn into a documentation is written in the following format:\n\n[{path: "README.md",content: "# Portfolio\n\nThis is an online portfolio where I describe my skills, education and experience."},{path: "src/App.js",content: \'import "./App.css";import { Navbar } from "./components/Navbar";import Header from "./components/Header";import AboutMe from "./components/AboutMe";function App() {return (<><Navbar /><Header /><AboutMe /></>);}export default App;\'}]\n\nIn other terms, it\'ll be an array of objects, where each object contains the path to a file and the contents inside of it, so you can read the code and make sense of the full scope of the project.';

async function completeWithGroq(repoToRead: ContentToFeed[]) {
	const res = await groqFetch(
		'https://api.groq.com/openai/v1/chat/completions',
		JSON.stringify({
			model: 'llama3-8b-8192',
			messages: [
				{
					role: 'system',
					content: systemPrompt
				},
				{
					role: 'user',
					content: JSON.stringify(repoToRead)
				}
			]
		})
	);
	const data = await res?.json?.();
	const message = (data?.choices?.[0]?.message?.content || '') as string;
	return message;
}

export { completeWithGroq };
