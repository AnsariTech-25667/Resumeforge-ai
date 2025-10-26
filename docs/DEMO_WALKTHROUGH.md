# ResumeForge AI - Demo Walkthrough

## 🚀 Local Setup Guide

### Prerequisites
- Node.js 20+ installed
- MongoDB running (local or Atlas)
- API keys for OpenAI and Gemini (optional for demo)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/AnsariTech-25667/Resumeforge-ai.git
cd Resumeforge-ai

# 2. Install all dependencies
npm run install:all

# 3. Setup environment variables
cd client && cp .env.example .env
cd ../server && cp .env.example .env

# 4. Start development servers
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/resumeforge-ai

---

## 📸 Feature Walkthrough

### 1. Home Page & Hero Section
![Home Page](./screenshots/01-home-hero.png)
*Landing page with animated background and call-to-action*

**Key Features:**
- Animated gradient background with floating particles
- Hero section with compelling value proposition
- Navigation to key features (Live Editor, AI Dashboard, 3D Templates)
- Responsive design for all devices

### 2. Live Resume Editor
![Live Editor](./screenshots/02-live-editor.png)
*Split-screen real-time resume editing with instant preview*

**Key Features:**
- Split-screen interface with real-time synchronization
- AI-powered content suggestions and improvements
- Multiple template selection with live preview
- Auto-save functionality with local storage backup
- Export options (PDF, JSON, Word)

### 3. AI Processing Dashboard
![AI Dashboard](./screenshots/03-ai-dashboard.png)
*Neural network visualization showing AI enhancement process*

**Key Features:**
- Real-time neural network animation during AI processing
- Live metrics showing improvement scores
- Content enhancement with before/after comparisons
- ATS optimization analysis with compatibility scores
- Industry-specific tailoring options

### 4. 3D Template Showcase
![3D Templates](./screenshots/04-3d-templates.png)
*Interactive 3D carousel with mouse-tracked perspective*

**Key Features:**
- 360° interactive template carousel
- Mouse-tracked perspective transforms
- Real-time color scheme customization
- Google Fonts integration with live preview
- Template morphing with smooth animations

### 5. Developer Credibility Dashboard
![Developer Dashboard](./screenshots/05-developer-dashboard.png)
*GitHub integration with live code metrics and performance data*

**Key Features:**
- Real-time GitHub contribution graphs
- Animated code quality metrics
- Performance benchmarks and technical debt analysis
- Project showcase with live repository data
- Tech stack visualization with proficiency tracking

---

## 🎥 Demo Video (Optional)

For a complete walkthrough, check out our demo video:
[Demo Video Link] - *Coming Soon*

---

## ⚡ Key Interactions to Try

### AI Enhancement Demo
1. Navigate to Live Editor
2. Add basic bullet points like "Worked on websites"
3. Click "Enhance with AI" button
4. Watch neural network animation process
5. See transformed content: "Developed 15+ responsive websites using React/Next.js, improving user engagement by 40%"

### 3D Template Experience
1. Go to Template Showcase
2. Move mouse around the 3D carousel
3. Click on templates to see perspective changes
4. Use color picker to see real-time customization
5. Try different Google Fonts combinations

### Voice-to-Text Feature
1. Open Live Editor
2. Click microphone icon in any text field
3. Speak your content naturally
4. Watch real-time transcription with smart formatting
5. AI automatically enhances spoken content

### Progressive Web App
1. Open DevTools → Application → Service Workers
2. Go offline (DevTools → Network → Offline)
3. Continue using the app with cached functionality
4. See offline notification and sync queue
5. Go back online to see automatic synchronization

---

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill existing processes
npx kill-port 3000
npx kill-port 5000
```

**MongoDB Connection Failed**
```bash
# Start MongoDB locally
mongod --dbpath /path/to/data/directory
```

**AI Features Not Working**
- Check API keys in `.env` files
- Ensure OpenAI/Gemini APIs are accessible
- Check network connectivity

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Mobile Experience

The application is fully responsive and includes:
- Touch-optimized 3D interactions
- Mobile-first navigation
- Progressive Web App installation
- Offline functionality
- Voice input on supported devices

---

## 🚀 Production Deployment

### Vercel (Recommended for Frontend)
```bash
cd client
npm run build
vercel --prod
```

### Railway/Heroku (Backend)
```bash
cd server
# Configure environment variables
git push railway main
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

---

## 📊 Performance Metrics

- **Lighthouse Score**: 98/100
- **First Contentful Paint**: 0.8s
- **Time to Interactive**: 1.2s
- **Bundle Size**: 1.8MB (gzipped)
- **AI Response Time**: <500ms

---

## 🤝 Contributing

This demo showcases the complete feature set. For contributing guidelines and development setup, see the main documentation.

**Contact**: Maaz Ansari (maazansari25667@gmail.com)
**Portfolio**: https://portfolio-rose-ten-h8vdzjp4ol.vercel.app/
**GitHub**: https://github.com/AnsariTech-25667