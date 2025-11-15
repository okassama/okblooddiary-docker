# OK Blood Diary

A modern, private, and secure web application to track, visualize, and get insights on your blood pressure readings. Record daily measurements, view trends, and export your health data for your doctor.

## ✨ Key Features

-   **Privacy First:** All your health data is stored securely in your browser using IndexedDB. No data ever leaves your device.
-   **Multi-User Support:** Create separate, password-protected profiles for different family members on the same device.
-   **Track Readings:** Easily log your systolic, diastolic, and pulse readings for morning and evening.
-   **Data Visualization:** Interactive and beautiful charts (Line, Bar, Area) to visualize your blood pressure trends over time.
-   **Instant Classification:** Each reading is automatically categorized (Normal, Elevated, Hypertension Stage 1, etc.) based on AHA guidelines.
-   **AI-Powered Insights (Optional):** Optionally provide your own API key for services like Google Gemini to get personalized, easy-to-understand analysis of your recent readings and general wellness tips.
-   **Comprehensive Exports:** Generate professional-looking reports in **Microsoft Word (.docx)** and **Excel (.xlsx)** formats, or compose a text-based report for email.
-   **Data Management:** Securely delete individual readings or wipe an entire profile's data when needed.
-   **Light & Dark Mode:** A comfortable viewing experience in any lighting condition.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript
-   **Styling:** Tailwind CSS
-   **Charting:** Recharts
-   **AI Insights:** Google Gemini API (`@google/genai`) and other providers.
-   **Local Storage:** IndexedDB
-   **Deployment:** Docker, Nginx
-   **Document Generation:** `docx`, `xlsx` (SheetJS)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Docker](https://www.docker.com/get-started) and Docker Compose

### Running the Application

This project is configured to run inside a Docker container using Nginx. There are no API keys to configure to get started.

1.  **Build and run the Docker container:**
    ```bash
    docker-compose up -d
    ```

2.  **Open the application:**
    The application will be available at `http://localhost:7772`.

## 📖 Usage

1.  **Create a Profile:** On your first visit, you'll be prompted to create your first local profile. You can add an optional password to secure it.
2.  **Select Profile:** If multiple profiles exist, you'll see a selection screen. Click on your profile to log in (enter password if required).
3.  **Add a Reading:** Click the `+` button to open the modal and log your systolic, diastolic, and pulse numbers.
4.  **View Your History:** All your readings are listed in chronological order on the main dashboard.
5.  **Analyze Trends:** The chart at the top visualizes your data. You can switch between Line, Bar, and Area chart types.
6.  **Get Insights:** The Insights card provides basic analysis. To enable advanced AI insights, click the settings icon on the card and enter your own API key from a provider like Google AI Studio.
7.  **Export Data:** Use the controls to export your complete history to a Word document, Excel spreadsheet, or to draft an email report.

## 📂 Project Structure

```
.
├── src/
│   ├── components/        # React components (UI elements)
│   ├── constants.ts       # Application constants (e.g., BP categories)
│   ├── services/          # Service modules (DB interactions)
│   ├── types.ts           # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Entry point for React
├── docker-compose.yml     # Docker configuration
├── index.html             # Main HTML file
└── README.md              # You are here!
```

## ✍️ Author

Created by **O Kassama**.