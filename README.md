A simple API that allows users to "like" articles. 

## Prerequisites
Make sure you have the following installed on your machine:

- Nodejs
- npm
- Git

## Setup Instructions
1. Clone the repository
```bash
git clone https://github.com/tonievictor/nodelike.git
```

2. Install dependencies
```bash
npm install
```

3. Start the project
```bash
npm start
```
- Note: you can also use `npm run dev` but don't forget to uncomment the lines
```js
//await execute(db, createUser, ["John Doe"])
//await execute(db, createArticle, [1, 'Hello world'])
```

4. Using your preferred client, you can query these endpoints on `localhost:3000`
- GET `/`
- POST - `/likes/:id` -  Allows a user to like an article by its id (which defaults to 1, for now.)
