# Quasar

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-d0689d?style=for-the-badge&logo=sass&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-orange?style=for-the-badge&logo=D3&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-white?style=for-the-badge&logo=chart.js&logoColor=red)
![Vite](https://img.shields.io/badge/Vite-8f74fe?style=for-the-badge&logo=vite&logoColor=white)

🔗 **Backend Repository:** [https://github.com/SosnowskiMichal/HotSpotter.git](https://github.com/SosnowskiMichal/HotSpotter.git)

---

## 📖 About

**Quasar** helps developers and managers understand the dynamics of software evolution by combining structural metrics with historical data from Git.

The central element of the application interface is a fully interactive 3D visualization of a repository in the form of a **“code city.”** In this model, each file is represented as a building, where the height reflects the number of changes and the width corresponds to the file size measured in lines of code. This representation allows users to intuitively understand the structure of the analyzed repository. In a single view, it is possible to trace the directory hierarchy, identify dominant *“skyscrapers”* indicating areas most prone to changes, and notice wide, massive buildings representing files that have been developed over a long period of time.

Different screens of the tool present the *“code city”* in various visual variants, enabling repository analysis from multiple perspectives and highlighting different aspects of its structure. For example, the *“hotspots”* view identifies areas with the highest risk of technical debt.

| 3D Code City Model |
|:---:|
| ![Code City](./docs/city.png) |

---

## 📂 Project Structure

Here's an overview of the project's directory structure:

-   **`city/`**: Code city utils
-   **`components/`**: Reusable Vue components
    -   `city/`: Components for building city pages
    -   `common/`: Small, versatile UI components
    -   `modals/`: Dialog boxes and popups
    -   `sections/`: Larger parts of the interface
    -   `settings/`: Settings page components
    -   `visuals/`: Graphic elements
-   **`composables/`**: Composables logic
-   **`locales/`**: Translation files for different languages
-   **`plugins/`**: Application functionality extensions
-   **`router/`**: Vue Router configuration
-   **`services/`**: Communication with external APIs
-   **`stores/`**: Pinia modules for global state management
-   **`styles/`**: SCSS files
-   **`types/`**: Custom TypeScript types
-   **`views/`**: Components representing entire pages of the application

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v24+)
* npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/marg4ryn/Quasar.git
    cd Quasar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    Create a `.env` file in the root directory based on the `.env.example` file.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

---

## 🐳 Running with Docker

If you prefer to run the application using Docker:

1.  **Build the image:**
    ```bash
    docker build -t quasar-frontend .
    ```

2.  **Run the container:**
    ```bash
    docker run -d -p 5173:80 quasar-frontend
    ```

---
