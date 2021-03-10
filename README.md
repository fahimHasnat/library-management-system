# Library Management System

## About The Project
A library managemnt API implemented with NodeJS. 

## Features
* User Management (login, jwt authentication, create, update, view, deactivate, activate)
* Role Management (create, update, view, assign)
* Access Management (access validation)
* Book Management (create, update, view, delete, search)
* Author Management (create, read, update, delete)
* Book-loan Managemnt (request, reject, accept, return)
* Category Managemnt (create, update, view, delete)

## Tech Stack
* Platform : Express - NodeJS
* Database : Sequelize - PostgreSQL

## Installation
### Step 1
* Clone the project
* run 
```sh
   npm i -S
   ```
### Step 2
* Connect your postgresql database 
* Change the db credentials in .env to set up your database
* run
```sh
   node .\seeder\seed.js
   ```
This seeder file will populate the database with necessary data to run the application.

### Step
* run
```sh
   npm start
   ```
Now you can try out the different features of the application.

## Usage
* For Admin access login with **username** : Admin and **pass** : "1234"
* For User access login with **username** : User and **pass** : "1234"
