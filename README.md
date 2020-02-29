# Authenticate a Node ES6 API with JSON Web Tokens

https://scotch.io/tutorials/authenticate-a-node-es6-api-with-json-web-tokens

# Folder structure
Here's what our folder structure will look like:
```
├── config.js
├── controllers
│   └── users.js
├── index.js
├── models
│   └── users.js
├── routes
│   ├── index.js
│   └── users.js
├── utils.js
```
Quickly create it using the following commands:
```
mkdir -p jwt-auth/{controllers/users.js,models/users.js,routes/index.js,routes/users.js}
cd jwt-auth
touch utils.js && touch config.js && touch index.js
```

# Prerequisites & Dependencies

The only global install we'll need is node.js so make sure you have that installed. After that, let's install our local project dependencies.

Run the following command to initialize our package.json file.
```
npm init --yes
```
Install all our dependencies by running:
```
npm install express body-parser bcrypt dotenv jsonwebtoken mongoose  --save
npm install morgan nodemon cross-env  --save-dev
```

# Why these dependencies?

**Dependencies**

body-parser: This will add all the information we pass to the API to the request.body object.

bcrypt: We'll use this to hash our passwords before we save them our database.

dotenv: We'll use this to load all the environment variables we keep secret in our .env file.

jsonwebtoken: This will be used to sign and verify JSON web tokens.

mongoose: We'll use this to interface with our mongo database.

**Development dependencies**

morgan: This will log all the requests we make to the console whilst in our development environment.

nodemon: We'll use this to restart our server automatically whenever we make changes to our files. 

cross-env: This will make all our bash commands compatible with machines running windows.

**Environment variables**

Here's what my .env file looks like. As an example, wherever in our code you see, MONGO_LOCAL_CONN_URL we're referencing the value after the = sign in our .env file. The same applies to JWT_SECRET and MONGO_DB_NAME
```
JWT_SECRET=addjsonwebtokensecretherelikeQuiscustodietipsoscustodes
MONGO_LOCAL_CONN_URL=mongodb://127.0.0.1:27017/jwt-auth
MONGO_DB_NAME=users
```

# Server initialization

Now, let's set up our server.

Add the following line to your package.json file.
Inside the already existing scripts object, add the dev key value pair.
```
"scripts": {
    "dev": "cross-env NODE_ENV=development nodemon index.js"
  },
```

We'll now start our server with the npm run dev command.

Every time we do this, development is automatically set as a value for the NODE_ENV key in our process object. The command nodemon index.js will allow nodemon to restart our server every time we make changes in our folder structure.
