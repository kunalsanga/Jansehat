# Jansehat - AI-Powered Unified Healthcare Ecosystem
##(Deployed Link: https://jansehat.vercel.app/login)
##(Youtube Link: https://youtu.be/zJiAplzOQNU?si=kurrvDkNa_AiWwmM)

Jansehat is a next-generation telemedicine platform designed to bridge the gap between patients, healthcare providers, and pharmacists. Built with **React 19** and **Google Gemini AI**, it provides an intelligent, accessible, and seamless healthcare experience.


<img width="1907" height="908" alt="Screenshot 2026-01-25 160428" src="https://github.com/user-attachments/assets/bf8c034d-3166-4edd-9b9c-e0f640a433d8" />
<img width="1902" height="906" alt="Screenshot 2026-01-25 160514" src="https://github.com/user-attachments/assets/a69a9e4b-d0d4-4d4e-8391-264c39b18be7" />
<img width="1896" height="915" alt="Screenshot 2026-01-25 160544" src="https://github.com/user-attachments/assets/d76aef73-be29-4a69-be63-5a1924e2367e" />
<img width="1888" height="912" alt="Screenshot 2026-01-25 160556" src="https://github.com/user-attachments/assets/625e2efa-08b3-4b07-87bd-f1fde4de3439" />
<img width="1898" height="910" alt="Screenshot 2026-01-25 160607" src="https://github.com/user-attachments/assets/3aa80cb9-ada9-43f2-9366-7abf7cd83a7b" />
<img width="1903" height="918" alt="Screenshot 2026-01-25 160619" src="https://github.com/user-attachments/assets/9bd907d1-79ee-483e-a6b7-a73a67c50012" />
<img width="1899" height="913" alt="Screenshot 2026-01-25 160630" src="https://github.com/user-attachments/assets/c6a7e576-9bf3-4d32-bf0f-30feeb2e80db" />


## 🌟 Overview

Jansehat integrates three key pillars of healthcare into a single digital ecosystem:
1.  **Patient Portal** - For AI-driven diagnosis, booking, and consultations.
2.  **Doctor Dashboard** - For appointments, patient records, and tele-consultation.
3.  **Pharmacist Portal** - For inventory management and medicine availability.

---

## 🚀 Key Features

### 🩺 For Patients
-   **🤖 AI Symptom Checker**: Preliminary diagnosis powered by ** LLM QWEN 2.5 & Google Gemini AI**.
-   **🗣️ Voice-First Interface**: Complete app navigation and query support in **Hindi, English, and Punjabi**.
-   **📹 Video Consultation**: High-quality video calls with doctors using **ZegoCloud**.
-   **🏥 Hospital Locator**: GPS-integrated navigation to nearby hospitals with department guidance.
-   **💊 Medicine Finder**: Locomotive search for medicine availability in nearby pharmacies.
-   **🚨 One-Touch Emergency**: Instant access to emergency services and contacts.
-   **📂 Health Records**: Secure digital storage for medical history and prescriptions.

### 👨‍⚕️ For Doctors
-   **📊 Professional Dashboard**: Centralized view of appointments and metrics.
-   **🗓️ Appointment Management**: View "Today's Appointments" and manage schedule.
-   **🚑 Emergency Response**: Dedicated interface for handling emergency patient calls.
-   **📄 Digital Health Records**: Access patient history and reports instantly.
-   **💻 Telemedicine Suite**: Integrated video calling for remote consultations.

### 💊 For Pharmacists
-   **🏪 Digital Storefront**: Login/Signup capabilities for pharmacies.
-   **📦 Stock Management**: Dashboard to update medicine availability and pricing.

---

## 🛠️ Tech Stack

### Core Frameworks
-   **Frontend**: React 19, Vite, Tailwind CSS
-   **Backend**: Node.js, Express.js

### Specialized Computations & Services
-   **🤖 Artificial Intelligence**: Google Gemini API (Symptom Analysis & NLP)
-   **🎥 Real-time Video**: ZegoCloud UIKit
-   **🌍 Maps & Navigation**: Leaflet, React-Leaflet, Leaflet Routing Machine
-   **🌐 Internationalization**: i18next (Multi-language support)
-   **🔌 Communication**: SockJS, StompJS (Real-time updates)

---

## 📋 Prerequisites

-   **Node.js**: v16 or higher
-   **npm**: v8 or higher
-   **Google Gemini API Key**: via [Google AI Studio](https://aistudio.google.com/)

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/kunalsanga/Jansehat.git
cd Jansehat
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Gemini AI Configuration
GEMINI_API_KEY=your_server_gemini_key
VITE_GEMINI_API_KEY=your_client_gemini_key

# Backend Configuration
PORT=3001
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Launch Application
Run both frontend and backend concurrently (Recommended):
```bash
npm run dev:full
```

Or run separately:
```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

The application will be available at:
-   **Frontend**: `http://localhost:5173`
-   **Backend**: `http://localhost:3001`

---

## 🐳 Docker Support

Run the entire stack in a container:

```bash
docker build -t jansehat .
docker run -p 3001:3001 -p 4173:4173 jansehat
```

---

## 📁 Project Structure

```bash
Jansehat/
├── public/                 # Static assets & images
├── src/
│   ├── components/         # Shared components (SymptomChecker, VoiceMic, etc.)
│   ├── doctor/             # Doctor Dashboard & Pages
│   │   ├── pages/          # (Dashboard, Appointments, Emergency, etc.)
│   │   └── ...
│   ├── i18n.js            # Language configuration
│   ├── rtc/               # Real-time communication logic
│   ├── App.jsx            # Main Router & Layout
│   └── main.jsx           # Entry point
├── server.js              # Express Backend
├── Dockerfile             # Container configuration
└── package.json           # Dependencies
```

---

## 🤝 Contributing
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/NewFeature`)
3.  Commit changes (`git commit -m 'Add NewFeature'`)
4.  Push to branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

---

**Made with ❤️ for accessible healthcare.**
