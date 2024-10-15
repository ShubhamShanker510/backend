# Github push link : https://github.com/ShubhamShanker510/backend.git

# Step 1 Setup empty files and folder

### public
      1. temp
      1.1 gitkeep

### src
      1. controllers
      2. db
      3. middlewares
      4. models
      5. routes
      6. utils
      7. app.js
      8. constants.js
      9. index.js

### gitignore

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

# Step 3 Custom Api and Error Handling

1. In index.js .then and catch method used after databse connection to run the port 

2. In app.js cors, static urlencoded and cookie parser are configure

3. For Handling promises build a file asyncHandler in utiliy and also similary to handle api response and api error similarly files are created in utils to use then as wrapper function

### Status Code
    
    1. Informational responses 100-199

    2. Successful responses 200-299

    3. Redirection messages 300-399

    4. Client error responses 400-499

    5. Server error responses 500-599


### package Installed are cors an cookie-parser

# Step 4 User model and Video with hooks and JWT

1. Created User model and video model in models files
2. Use bcrypt for hashing the password and also to compare the password by making some custom methods
3. Similarly use jwt token for generating access token and generating refresh token 
4. All access token are stored in .env file for security

### For generating token use jwt generator secret online (link: https://jwtsecret.com/generate)

### package installed are bcrypt and jsonwebtoken