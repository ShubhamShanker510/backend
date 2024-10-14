# Github push link : https://github.com/ShubhamShanker510/backend.git

# Step 1 Setup empty files and folder

## public
   ->temp
   ->gitkeep

## src
   ->controllers
   ->db
   ->middlewares
   ->models
   ->routes
   ->utils
   ->app.js
   ->constants.js
   ->index.js

## gitignore

importing from git generator

### Installing prettier and setup of prettier files

# Step 2 connecting Database

1. Setup of .env file
2. In constant exporting database name
3. create index.js file in db folder and connecting database
4. Importing db folder in index.js and executing it 
5. importing dotenv 
6.  import dotenv from 'dotenv'
7. configuring path of the file:
dotenv.config({
    path: './env'
})
8. In package.json set dev script : "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"

### Always import file with full path 
(For eg : import connectDB from './db/index.js';)

### package Installed are dotenv, mongoose and express
