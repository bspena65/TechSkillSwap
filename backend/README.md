# Back TechSkills

**Novalabs**



# Project Title

This project is a robust backend system designed for a social networking platform tailored to developers. The system includes features such as user authentication (both local and third-party), real-time chat, meeting scheduling, notifications, user ratings, and document management.

## Overview

This backend system is built using Node.js with TypeScript, utilizing a layered architecture to separate concerns and improve maintainability. The project leverages several key technologies:

- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features to build web and mobile applications.
- **TypeORM**: An ORM (Object-Relational Mapper) for TypeScript and JavaScript, enabling robust and type-safe interaction with PostgreSQL.
- **Socket.IO**: Enables real-time bidirectional event-based communication, used here for implementing the chat and notification features.
- **Passport.js**: Middleware for handling authentication, supporting local strategy as well as OAuth strategies for Google and GitHub.

## Key Features

### Authentication
- **Local Authentication**: User registration and login using email and password, with passwords securely hashed using `bcryptjs`.
- **Third-Party Authentication**: Support for Google and GitHub OAuth for user login, managed by `passport-google-oauth20` and `passport-github2`.

### Chat System
- **Real-Time Messaging**: Implemented using `Socket.IO` to allow real-time chat between users.
- **Chat Rooms**: Users can participate in multiple chat rooms, with each room handling its participants and messages.

### Meetings
- **Meeting Scheduling**: Users can schedule meetings, send invitations, and receive notifications. The meeting details, including the Zoom link, are stored in the database.

### Notifications
- **User Notifications**: Implemented to inform users of various events like new messages, friend requests, or meeting reminders. Notifications can be sent via email or displayed in the app.

### User Ratings
- **Peer Reviews**: Users can rate each other on a scale of 1-5, providing feedback and comments. This feature is crucial for maintaining a quality network.

### Document Management
- **File Upload and Storage**: Users can upload and store documents (e.g., certifications, resumes), which are managed using either local storage or AWS S3, depending on configuration.

## Project Structure

The project is structured to follow best practices in Node.js development:

- **Application Layer**: Contains controllers, DTOs, and use cases, managing the interaction between the user input and the domain layer.
- **Domain Layer**: Includes entities, repositories, and domain services, encapsulating the core business logic.
- **Infrastructure Layer**: Manages external services like database connections, authentication mechanisms, and file storage.
- **Shared Layer**: Contains reusable components like middleware and utility functions.

## Utlis Commands


```json
npx lago
```

## Getting Started

To get started with the project:

1. **Clone the Repository**: `git clone <repository-url>`
2. **Install Dependencies**: Run `npm install` to install all required dependencies.
3. **Set Up Environment Variables**: Create a `.env` file in the root directory and configure the necessary environment variables.
4. **Run the Application**: Use `npm run dev` to start the application in development mode.

## Contributing

Please follow the established code standards and ensure all tests pass before submitting a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
