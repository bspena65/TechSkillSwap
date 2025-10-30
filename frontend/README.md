⚛️ React + TypeScript + Vite

This project is a modern React + TypeScript front-end built with Vite, providing a fast and flexible development environment with Hot Module Replacement (HMR), ESLint integration, and production-ready optimizations.

🚀 Overview

Vite serves as the build tool and development server, offering lightning-fast startup times and optimized builds.
This setup is ideal for developing scalable and maintainable React applications using TypeScript’s type safety and modern tooling.

🧰 Core Technologies

- React 18+ – UI library for building interactive and dynamic interfaces.
- TypeScript – Adds static typing to JavaScript, improving developer experience and reliability.
- Vite – Lightning-fast build tool and dev server with optimized bundling.
- ESLint – Enforces consistent code style and catches common issues early.
- Prettier – Ensures uniform code formatting across the project.

📁 Project Structure
src/
│
├── assets/               # Static assets (images, icons, etc.)
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── pages/                # Page-level components (routed views)
├── context/              # React Context providers
├── services/             # API calls and business logic
├── types/                # Global TypeScript types/interfaces
├── utils/                # Helper functions
├── App.tsx               # Main application component
└── main.tsx              # Entry point (ReactDOM.render)


⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone <repository-url>
cd <project-folder>

2️⃣ Install Dependencies
npm install
# or
yarn install

3️⃣ Start the Development Server
npm run dev


This will start Vite in development mode with Hot Module Replacement (HMR) enabled.
The application should be available at http://localhost:5173
.

🧾 Available Scripts
Command	            Description
- npm run dev	        Run the app in development mode
- npm run build	      Build the app for production
- npm run preview	    Preview the production build locally
- npm run lint	      Run ESLint to analyze code quality
- npm run format	    Format code using Prettier

🧩 ESLint & TypeScript Configuration

This project uses ESLint for linting and TypeScript for type checking.
For production-grade projects, it is recommended to use type-aware lint rules.

Update your ESLint configuration as follows:


// eslint.config.js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})

Replace:

tseslint.configs.recommended

with:

tseslint.configs.recommendedTypeChecked

or:

tseslint.configs.strictTypeChecked

Optionally add:

...tseslint.configs.stylisticTypeChecked


To enable React-specific linting, install the React ESLint plugin:

npm install eslint-plugin-react --save-dev


Then extend the ESLint configuration:

import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})

🧱 Build for Production

To create a production-ready build:

npm run build


This command generates an optimized output in the /dist folder.
You can preview it locally before deploying:

npm run preview

☁️ Deployment

You can deploy the production build to any static hosting service, such as:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Simply configure your platform to serve the /dist folder as the site root.

🧩 Environment Variables (Optional)

Create a .env file in the project root if your app requires environment variables:

VITE_API_URL=https://api.yourservice.com
VITE_GOOGLE_CLIENT_ID=<your-client-id>


Access them in code using:

const apiUrl = import.meta.env.VITE_API_URL

💡 Tips & Recommendations

- Keep dependencies updated regularly.
- Use React.lazy and Suspense for code splitting and lazy loading.
- Configure Prettier for consistent code formatting across teams.
- Use .env variables to manage environment-specific configurations.

🧑‍💻 Author

Developed and maintained by Brayan Peña y Diego Florez and collaborators of the TechSkillSwap project.

🪪 License

This project is open source and available under the MIT License.