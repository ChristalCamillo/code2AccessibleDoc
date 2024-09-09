# Code 2 Doc

A simple app that turns GitHub repositories' URLs into Markdown documentation targeting accessibility

## Dependencies

- NodeJS 18+
- Vite 4
- TypeScript 5
- Marked 14

## Running

First you must grab a GitHub API Key from your account as well as a Groq AI key (wich you get by registering free) and add them both to a file called `.env` ar the root folder.

An example of such is given at `.env.example`.

Then you must install the modules with:

```
npm run install
```

Once the install is finished you may run the project by running:

```
npm run dev
```

The website will be available locally at `http://localhost:5173`.

## Quality Control

Remember to always run before commiting anything:

```
npm run prepush
```

This script will check the types, will run the Prettier to format the code and will run ESLint to check for code problems.
