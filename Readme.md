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

# Step 5 Upload file in Backend

1. Use Cloudinary for saving files for which we need cloud name, api key and api secret and for securance put it in .env file(In utils folder as cloudinary.js)

2. User multer as middleware for file handling to store file in disk storge

### It is better to store file in disk storage as image or video or any other file can be of large memory

### package installed are multer and cloudinary

# Step 6 Router and controller debugging

1. create registerUser and user.controller in controller folder

2. Import registerUser in user.routes and created first route

3. Import userRoute in app.js and step up it

### Always remember to set up routes in app.js always start with /api/v1

### despending on which version you are working on

# Step 7 Logic Build to register User

1. created registerUser in user.controller file

2. use middleware in routes with the help of multer 

# Step 8 setting up postman

 create new collections and enviroment variables in postman and connectiog both

# Step 9 Access Refresh Token, Middleware and cookies in Backend

1. create a logged in and logout user in user controller

2.  create a constant fuction generateaccessandrefreshtokens in user controller

3. create auth middleware to get user token for logout

4. passed in user.routes

### Basically use of refresh token is to not make user to type email and password for login again and again 

### refresh token expiry time is basically larger than access token

# Step 11 Generating new Refresh Token and also done some debugging

1. create a refreshToken in usercontroller

2. passed in user.route

### basically when the accesstoken got expired during that time what happen rather than showing it error a new fresh token got generated just by comparing the token

# Step 12 Writting update controllers for users

1. Change current password , get user and getting user just because of auth middleware , update avatar, update cover image, update account details in user controller

2. Created Subscription model also

# step 13 Understanding mongodb aggregation pipeliness

1. created getUserChannelProfile in which we are adding new field connectiong databases and for more further wathc chai aur code mongodb aggregation pipelines 