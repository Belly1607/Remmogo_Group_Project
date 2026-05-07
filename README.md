# Remmogo WebApp

## Description
Remmogo allows Motshelo a communtiy saving group to register, enrol members, record monthly contributions of a fixed amount which is BWP 1000,generate reports and manage loans by giving a 20% monthly interest.

## Technology used

frontend - React, React router, Vite
Backend - Node.js and Express
Database - SQL Server
Authentication - JSON Web Tokens and bcryptjs
Styling - CSS
Deployement - Backend: render
            - Frontend

## Setup instructions 

### 1. clone the repository 
```bash
git clone https://github.com/your-username/re-mmogo.git
cd re-mmogo
```
### 2. Backend setup

```bash
cd backend - # to be in the folder of backend
npm install - # to install of dependencies
create a .env (environment variables) file in the backend folder
.env
PORT=5000
JWT_SECRET=remmogo_super_secret_key_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173/
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root1234
DB_NAME=remmogo_db
```
Run the server 
```bash
node server.js
```
### 3. Frontend setup
```bash
cd REMMOGO FRONTEND #open the folder called REMMOGO FRONTEND in cmd
npm install

npm run dev # to run in web browser
 ```
 it will be available at `http://localhost:5173`

 ### 4. Database setup
 Run the SQL scripts in `/database/schema.sql` against your SQL Server instance to create all tables and relationships.

 ## Live URL

 ```bash

 https://frontend-nine-pink-49.vercel.app/login # for Frontend
 https://remmogo-group-project.onrender.com/    # for Backend
 ```

 ## Github Repository
```bash
 https://github.com/Belly1607/Remmogo_Group_Project.git
```
## Group members

Tresford Chipili 23019012
Esli Quest Esabu 24019733
Mutsawashe Maraidza 24020134
Laone Mashabane 24019382
Esabel Mutisi 24020114

## Recent Updates & After Presentation

### Security Fix — Role Based Access Control (RBAC)
- Identified a vulnerability where any logged in user could approve transactions
- Fixed by adding role checks to the approval endpoint
- Only users with **signatory** or **admin** role can now approve transactions
- Group creator is automatically assigned the **admin** role on group creation
- Named signatories are automatically assigned the **signatory** role

### ERD Fix
- Corrected relationship errors in the Entity Relationship Diagram
- Updated to accurately reflect the database table relationships


