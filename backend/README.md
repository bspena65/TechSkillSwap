```js
🧠 TechSkillSwap Backend

📌 Project Description

TechSkillSwap is the backend system for a social networking platform tailored to software developers who want to exchange technical skills, collaborate on projects, and grow professionally.

This backend provides APIs and real-time services that power features such as authentication, chat, meeting scheduling, notifications, user ratings, and document management.

🚀 Overview

The backend is built using Node.js with TypeScript, following a layered (clean) architecture to promote scalability, maintainability, and testability.

🧰 Core Technologies

- Node.js + Express.js → Web framework for routing and REST API endpoints.
- TypeORM → ORM for PostgreSQL providing an elegant and type-safe database layer.
- Socket.IO → Enables real-time, bidirectional communication for chat and notifications.
- Passport.js → Handles authentication (local and OAuth for Google & GitHub).
- AWS S3 / Local Storage → For document and media file management.
- JWT (JSON Web Tokens) → For secure session management and user authorization.

⚙️ Key Features
🔐 Authentication

- Local signup and login with email/password (secured using bcryptjs).
- OAuth integration with Google and GitHub for seamless third-party login.
- Session handling and JWT-based authorization.

💬 Real-Time Chat

- One-on-one and group messaging powered by Socket.IO.
- Message persistence in PostgreSQL via TypeORM.
- Online/offline status tracking.

📅 Meetings

- Schedule and manage professional meetings.
- Store meeting metadata (links, participants, date/time).
- Integration-ready for Zoom or other video services.

🔔 Notifications

- Real-time in-app and email notifications for key events:
- New messages
- Connection requests
- Meeting invitations and reminders

⭐ User Ratings

- Peer review system (1–5 stars) with optional comments.
- Averages and feedback stored per user for credibility.

📁 Document Management

- Upload and store CVs, certifications, or portfolios.
- Configurable to use AWS S3 or local file system.

🧩 Architecture Overview

The system follows a Clean Architecture pattern:

src/
│
├── application/          # Controllers, DTOs, and use cases
├── domain/               # Entities, repositories, and core business logic
├── infrastructure/       # Database, external services, and adapters
├── shared/               # Common utilities, middleware, and helpers
└── main.ts               # Entry point of the application


⚙️ Environment Setup

Create a .env file at the project root and include:

PORT=3000
DATABASE_HOST=<your-db-host>
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=<your-db-password>
DATABASE_NAME=techskillswap
JWT_SECRET=<your-jwt-secret>
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_REGION=<aws-region>
AWS_BUCKET_NAME=<bucket-name>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GITHUB_CLIENT_ID=<github-client-id>
GITHUB_CLIENT_SECRET=<github-client-secret>

🧠 Useful Commands
Command	Description
npm install	                    Install all dependencies
npm run dev	                    Start server in development mode
npm run build	                Compile TypeScript to JavaScript
npm start	                    Run the compiled app in production mode
npm run migration:generate	    Generate a new TypeORM migration
npm run migration:run	        Apply all pending migrations
npm run migration:revert	    Revert the last migration

🧪 Testing

To run tests (if implemented):

- npm test


Ensure tests pass before submitting a pull request.

🤝 Contributing

1. Fork the repository.
2. Create your feature branch: git checkout -b feature/my-feature.
3. Commit your changes: git commit -m "Add my feature".
4. Push to the branch: git push origin feature/my-feature.
5. Create a new Pull Request.

Please follow project coding standards and run all tests before committing changes.

🧑‍💻 Author

Developed and maintained by Brayan Peña y Diego Florez and collaborators of the TechSkillSwap project.

🪪 License

This project is licensed under the MIT License.
See the LICENSE
 file for details.

📚 Additional Resources

- TypeORM Documentation - https://typeorm.io
- Express.js Guide - https://expressjs.com
- Socket.IO Documentation - https://expressjs.com
- Passport.js Docs - http://www.passportjs.org
- AWS SDK for Node.js - https://docs.aws.amazon.com/sdk-for-javascript/