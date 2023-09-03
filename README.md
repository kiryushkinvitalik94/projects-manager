# Project Management App

![GitHub](https://img.shields.io/github/license/your-username/project-management-app)

The Project Management App is a web application designed for managing projects and tasks. It provides an intuitive interface for creating, tracking, and managing projects, as well as assigning tasks to users.

## Features

- Create projects and tasks.
- Assign tasks to users.
- Track task status (in progress, completed, etc.).
- User authentication.
- Secure password storage.
- Informational notifications.
- Integration with MySQL database.
- Styling with Tailwind CSS.

## Installation Requirements

- [Node.js](https://nodejs.org/) (recommended version 14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Installation and Running

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/project-management-app.git

   ```

1. Navigate to the project directory:
   cd project-management-app
1. Install dependencies:
   npm install

# or

yarn

Create a .env.local file in the project's root directory and define the following environment variables:
DATABASE_HOST=your-database-host
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=your-database-name
SECRET_KEY=your-secret-key

Replace your-database-host, your-database-user, your-database-password, your-database-name, and your-secret-key with your actual values.

4. Start the application:
   npm run dev

# or

yarn dev

The application will be available at http://localhost:3000.

# Usage

1. Registration: Go to the registration page to create an account.
2. Login: After registration, log in with your credentials.
3. Create Project: Once logged in, you can create a new project by providing its name and description.
4. Create Tasks: For each project, you can create tasks with a title and description.
5. Task Assignment: Assign tasks to users so they can see their tasks in their profiles.
6. Track Status: Mark tasks as "in progress" or "completed" for efficient task management.

License
This project is licensed under the MIT License.

Author
Vitalii Kiriushkin
