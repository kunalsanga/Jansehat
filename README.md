# Jansehat - AI-Powered Telemedicine Platform

A comprehensive telemedicine application built with React and Express.js, featuring AI-powered symptom checking, health records management, and video consultation capabilities.

![Jansehat Logo](public/images/custom/Screenshot%202025-09-19%20213255.png)

## 🚀 Features

- **🤖 AI Symptom Checker** - Powered by Google Gemini AI for preliminary health analysis
- **🎤 Multilingual Voice Commands** - Speak in Hindi, English, Punjabi with AI-powered intent recognition
- **📋 Health Records** - Manage and access medical history securely
- **💊 Medicine Availability** - Check medicine availability and pricing
- **📹 Video Consultation** - Telemedicine video calling interface
- **🗺️ Hospital Navigation** - GPS-based hospital and department navigation
- **🚨 Emergency Mode** - Quick access to emergency services
- **📱 Mobile Responsive** - Works seamlessly on all devices
- **🎨 Modern UI** - Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Express.js** - Node.js web framework
- **Google Gemini AI** - AI-powered symptom analysis
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Google Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/kunalsanga/Jansehat.git
cd Jansehat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
VITE_API_BASE_URL=http://localhost:3001
```

**To get your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key and replace `your_gemini_api_key_here` in the `.env` file

### 4. Run the Application

#### Option 1: Run Both Servers (Recommended)
```bash
npm run dev:full
```

#### Option 2: Run Servers Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 🐳 Run with Docker

> Perfect for teammates who just want to clone the GitHub repo and run everything in a container.

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunalsanga/Jansehat.git
   cd Jansehat
   ```

2. **Create a `.env` file or export the required environment variables**
   ```env
   GEMINI_API_KEY=your_backend_key
   VITE_GEMINI_API_KEY=your_frontend_key
   VITE_API_BASE_URL=http://localhost:3001
   ```

3. **Build the image (inject build-time secrets if needed)**
   ```bash
   docker build \
     --build-arg GEMINI_API_KEY=$GEMINI_API_KEY \
     --build-arg VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
     --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL \
     -t jansehat .
   ```

4. **Run the container**
   ```bash
   docker run --rm \
     -p 3001:3001 \
     -p 4173:4173 \
     -e GEMINI_API_KEY=$GEMINI_API_KEY \
     -e VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
     -e VITE_API_BASE_URL=$VITE_API_BASE_URL \
     jansehat
   ```

5. **Open the app**
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## 📁 Project Structure

```
Jansehat/
├── public/
│   └── images/
│       ├── custom/          # Carousel images
│       ├── vcDoctor.jpg     # Video consultation image
│       └── video-bg.jpg     # Background images
├── src/
│   ├── components/
│   │   ├── SymptomChecker.jsx    # AI symptom analysis
│   │   ├── HealthRecords.jsx     # Medical records management
│   │   ├── MedicineAvailability.jsx # Medicine finder
│   │   ├── VideoConsultation.jsx # Video calling interface
│   │   ├── PhotoCarousel.jsx     # Image carousel
│   │   ├── ServiceCard.jsx       # Service cards
│   │   ├── TopBar.jsx           # Top navigation
│   │   ├── SideNav.jsx          # Side navigation
│   │   └── MobileTabBar.jsx     # Mobile navigation
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.jsx             # App entry point
├── server.js                # Express.js backend
├── config.js                # Configuration settings
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── .env                     # Environment variables
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run server` | Start backend API server |
| `npm run dev:full` | Start both frontend and backend |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Symptom Checker
```
POST /api/symptom-check
```
**Request Body:**
```json
{
  "symptoms": "I have a headache and fever"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "AI-generated health analysis...",
  "timestamp": "2025-01-19T10:30:00.000Z"
}
```

## 🎨 Customization

### Changing Image Carousel Speed

Edit `tailwind.config.js`:

```javascript
animation: {
  'marquee-fast': 'marquee 8s linear infinite',    // Fast
  'marquee-medium': 'marquee 12s linear infinite', // Medium
  'marquee-slow': 'marquee 20s linear infinite',   // Slow
}
```

### Adding New Images

1. Add images to `public/images/custom/`
2. Update the `photos` array in `src/components/PhotoCarousel.jsx`

### Styling

The project uses Tailwind CSS. Modify `src/index.css` or component files for custom styles.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add multilingual voice commands and AI integration"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set environment variables:
     - `VITE_GEMINI_API_KEY` = your Gemini API key
   - Click "Deploy"

3. **For Backend (Railway/Heroku):**
   - Deploy `server.js` separately
   - Update `VITE_API_BASE_URL` in Vercel environment variables

### Manual Deployment

#### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform

#### Backend (Heroku/Railway)
1. Deploy the `server.js` file
2. Set environment variables in your hosting platform
3. Update `VITE_API_BASE_URL` in frontend

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `VITE_GEMINI_API_KEY` | Frontend Gemini API key | Yes |
| `PORT` | Backend server port | No (default: 3001) |
| `VITE_API_BASE_URL` | Backend API URL | No (default: http://localhost:3001) |

## 🐛 Troubleshooting

### Common Issues

**1. "Unable to connect to AI service"**
- Check if your Gemini API key is correctly set in `.env`
- Verify the API key is valid at [Google AI Studio](https://aistudio.google.com/)

**2. "Module not found" errors**
- Run `npm install` to install dependencies
- Check if all files are in the correct directories

**3. Port already in use**
- Change the `PORT` in `.env` file
- Kill existing processes using the port

**4. CORS errors**
- Ensure backend server is running on the correct port
- Check `VITE_API_BASE_URL` matches the backend URL

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure both frontend and backend servers are running
4. Check the network tab in browser dev tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email kunalsanga@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- React and Express.js communities
- Tailwind CSS for the styling framework
- All contributors and users of this project

---

**Made with ❤️ for better healthcare accessibility**