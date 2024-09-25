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
	`You will write a documentation targeting developers for the code repository given to you.
	\n\n\You must read all of the files within the github repository before composing the documentation.
	\nThe documentation must have an output in Markdown and be as acessible to any reader as it can be, specially focusing in accessibility for disabilities, so making sure every image you may need to user has alt captions as well as good explanation of what\'s happening and good vertical disposition of the text to make it easier to read for screen readers.
	\n\nThe code you\'ll have to read the total content inside every single directory to turn into a documentation must be written in the following format:
	\n\n[
    {
        "path": "src/index.html",
        "content": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css\"\n      integrity=\"sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog==\"\n      crossorigin=\"anonymous\"\n    />\n    <link rel=\"stylesheet\" href=\"style.css\" />\n    <title>Background Slider</title>\n  </head>\n  <body>\n    <div class=\"slider-container\">\n      <div\n        class=\"slide active\"\n        style=\"\n          background-image: url('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80');\n        \"\n      ></div>\n      <div\n        class=\"slide\"\n        style=\"\n          background-image: url('https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80');\n        \"\n      ></div>\n\n      <div\n        class=\"slide\"\n        style=\"\n          background-image: url('https://images.unsplash.com/photo-1495467033336-2effd8753d51?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80');\n        \"\n      ></div>\n\n      <div\n        class=\"slide\"\n        style=\"\n          background-image: url('https://images.unsplash.com/photo-1522735338363-cc7313be0ae0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2689&q=80');\n        \"\n      ></div>\n\n      <div\n        class=\"slide\"\n        style=\"\n          background-image: url('https://images.unsplash.com/photo-1559087867-ce4c91325525?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80');\n        \"\n      ></div>\n\n      <button class=\"arrow left-arrow\" id=\"left\">\n        <i class=\"fas fa-arrow-left\"></i>\n      </button>\n\n      <button class=\"arrow right-arrow\" id=\"right\">\n        <i class=\"fas fa-arrow-right\"></i>\n      </button>\n    </div>\n    <script src=\"script.js\"></script>\n  </body>\n</html>\n"
    },
    {
        "path": "src/script.js",
        "content": "const body = document.body;\nconst slides = document.querySelectorAll(\".slide\");\nconst leftBtn = document.getElementById(\"left\");\nconst rightBtn = document.getElementById(\"right\");\n\nlet activeSlide = 0;\n\nrightBtn.addEventListener(\"click\", () => {\n  activeSlide++;\n\n  if (activeSlide > slides.length - 1) {\n    activeSlide = 0;\n  }\n\n  setBgToBody();\n  setActiveSlide();\n});\n\nleftBtn.addEventListener(\"click\", () => {\n  activeSlide--;\n\n  if (activeSlide < 0) {\n    activeSlide = slides.length - 1;\n  }\n\n  setBgToBody();\n  setActiveSlide();\n});\n\nsetBgToBody();\n\nfunction setBgToBody() {\n  body.style.backgroundImage = slides[activeSlide].style.backgroundImage;\n}\n\nfunction setActiveSlide() {\n  slides.forEach((slide) => slide.classList.remove(\"active\"));\n\n  slides[activeSlide].classList.add(\"active\");\n}\n"
    },
    {
        "path": "src/style.css",
        "content": "@import url(\"https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap\");\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: \"Roboto\", sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  overflow: hidden;\n  margin: 0;\n  background-position: center center;\n  background-size: cover;\n  transition: 0.4s;\n}\n\nbody::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.7);\n  z-index: -1;\n}\n\n.slider-container {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n  height: 70vh;\n  width: 70vw;\n  position: relative;\n  overflow: hidden;\n}\n\n.slide {\n  opacity: 0;\n  height: 100vh;\n  width: 100vw;\n  background-position: center center;\n  background-size: cover;\n  position: absolute;\n  top: -15vh;\n  left: -15vw;\n  transition: 0.4s ease;\n  z-index: 1;\n}\n\n.slide.active {\n  opacity: 1;\n}\n\n.arrow {\n  position: fixed;\n  background-color: transparent;\n  color: #fff;\n  padding: 20px;\n  font-size: 30px;\n  border: 2px solid orange;\n  top: 50%;\n  transform: translateY(-50%);\n  cursor: pointer;\n}\n\n.arrow:focus {\n  outline: 0;\n}\n\n.left-arrow {\n  left: calc(15vw - 65px);\n}\n\n.right-arrow {\n  right: calc(15vw - 65px);\n}\n"
    }
]
	\n\nIn other terms, it\'ll be an array of objects, where each object contains the path to a file and the contents inside of it, so you can read the code and make sense of the full scope of the project.\n\n your code should explain what tools, programs and programming langguages are necessary to use the application regarding the code you read, and explain every part and functionality in detail`;

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
