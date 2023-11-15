# The Wild Wall TS Project

The Wild Wall TS project is designed to facilitate communication between the Wild Code School and its students. It provides a platform where users can share and archive notes, fostering collaboration within the school community.

## Key Features

- **Main Board:** Users can post notes on a central board visible to everyone.
- **Archive:** A separate archive board allows users to store notes they don't want to delete permanently.
- **User Accounts:** The application includes user account creation and authentication features.
- **Automatic Timestamps:** Notes include automatic timestamps and the name of the user who posted them.
- **Note Customization:** Users can write notes and choose the background color.
- **Role-Based Permissions:**
  - _Administrators and Delegates:_ Can delete and archive all notes, edit their own notes.
  - _Students:_ Can edit, delete, and archive their own notes.
- **Admin Panel:** Administrators have access to an admin panel where they can modify user roles or delete accounts.
- **Responsive Design:** The application is designed to be responsive across various devices, with a preference for desktop use.

## Prerequisites

Before running the application, ensure you have the following installed on your machine:

- Node.js: Make sure Node.js is installed on your machine. You can download it here.
- npm (Node Package Manager): npm comes bundled with Node.js. Make sure you have a recent version. You can check your version by running npm -v in your terminal.
- TypeScript: Ensure TypeScript is installed globally. You can install it using npm install -g typescript.
- MySQL: Install and set up MySQL as the project uses it for the database.

## Installation

1. Clone the repository: `git clone https://github.com/Romain-Constant/The_Wild_Wall_TS.git`
2. Navigate to the project's root directory: `cd ts_wildwall`
3. Install dependencies: `npm install` in "frontend", "backend" and root directories.

## Configuration

### Backend Configuration

1. Create a `.env` file in the "backend" directory.
2. Configure the following environment variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   ```

### Frontend Configuration

1. Create a `.env` file in the "frontend" directory.
2. Configure the following environment variables:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```

## Scripts in the Root Directory

### Development

- Run both frontend and backend concurrently: `npm run dev`

## Usage

1. Start the backend server: `npm run dev` in the "backend" directory.
2. Start the frontend application: `npm run dev` in the "frontend" directory.

## Contact

For any inquiries or issues, please contact Romain via [romain.constant59@gmail.com].
