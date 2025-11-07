# 🟩 Vue 3 + Vite + TypeScript + SCSS + Vitest


## 1️⃣ Install dependencies

```bash
npm install
```

## 🚀 Running the application

To start the development server:

```bash
npm run dev
```

The application will be available at: [http://localhost:5173](http://localhost:5173)

## 🏗 Building the project

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🧪 Tests (Vitest)

To run the tests:

```bash
npm run test
```

Run tests in watch mode (re-runs on file changes):

```bash
npm run test:watch
```

Run tests and generate coverage report:

```bash
npm run test:coverage
```

Run tests with the Vitest interactive UI:

```bash
npm run test:ui
```

## Code Quality

To format the code:

```bash
npm run format
```

To lint the code:

```bash
npm run lint
```

## Project Structure

Here's an overview of the project's directory structure:

-   **`components/`**: Reusable Vue components.
    -   `common/`: Small, versatile UI components
    -   `layout/`: Page wireframes
    -   `modals`: Dialog boxes and popups
    -   `sections`: Larger parts of the interface
    -   `settings`: Settings page components
    -   `visuals`: Graphic elements
-   **`locales/`**: Stores translation files for different languages.
-   **`router/`**: Vue Router configuration.
-   **`services/`**: Files containing business logic and communication with external APIs.
-   **`stores/`**: Pinia modules for global state management.
-   **`styles/`**: SCSS files.
-   **`views/`**: Components representing entire pages/views of the application.
