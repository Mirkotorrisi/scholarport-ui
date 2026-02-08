# ScholarPort UI

ScholarPort UI is a modern, responsive frontend application for managing scholarly articles and citations. Built with React and TypeScript, it provides a clean interface for researchers to organize their work.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Mirkotorrisi/scholarport-ui.git
    cd scholarport-ui
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory (you can copy `.env.example` if available) and configure your backend URL:

    ```env
    VITE_BASE_URL=http://localhost:3000
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## 📁 Project Structure

The source code is organized in the `src` directory:

- **`api/`**: API client configuration and service functions (using Axios).
- **`components/`**: Reusable UI components (e.g., `ArticleRow`, `CitationList`, `Modal`) and feature-specific components (`ArticleForm`, `CitationForm`).
- **`context/`**: Context providers for global state management (e.g., `ArticlesContext` for managing article data and forms).
- **`hooks/`**: Custom React hooks (e.g., `useArticles`).
- **`pages/`**: Main page components (`ArticlesPage`, `ArticleDetailPage`).
- **`types/`**: TypeScript interfaces and type definitions.

## 🛠 Technologies

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🔧 Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_BASE_URL` | The base URL for the backend API | `http://localhost:3000` |

Make sure to restart the dev server after changing `.env` files.

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit testing.

To run the tests, execute:

```bash
npm run test
```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run test`: Runs unit tests using Vitest.
