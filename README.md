# 🗳️ EleEdu AI - Intelligent Election Assistant

EleEdu AI is a production-ready, accessible, and secure web application designed to empower voters with information, eligibility checks, and real-time guidance using AI and Google Services.

## 🚀 Features

- **Smart Conversational Assistant**: Context-aware chat interface integrated with AI for election queries.
- **Animated Election Flow**: Visual, step-by-step interactive guide to the voting process.
- **Eligibility Checker**: Quick verification logic for voter eligibility.
- **Polling Booth Locator**: Google Maps integration to find nearest booths and directions.
- **Voice-First Accessibility**: Speech-to-Text (Input) and Text-to-Speech (Output) for inclusive design.
- **Misinformation Detection**: Automated flags for common election-related myths.
- **Multilingual Support**: Real-time translation into regional languages.
- **Calendar Integration**: Add important election dates to Google Calendar.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, Lucide React, CSS Modules.
- **Backend**: Node.js, Express, Helmet, Express Rate Limit.
- **AI/Google Services**: Gemini API (Simulated), Google Maps API, Google Translate API, Google Speech APIs.
- **Database/Auth**: Firebase (Authentication & Firestore).
- **Testing**: Vitest (Frontend), Jest & Supertest (Backend).

## 📁 Project Structure

```text
/client
  /src
    /components   # Reusable UI components
    /pages        # Main application pages
    /hooks        # Custom React hooks (useVoice, etc.)
    /services     # API services
    /utils        # Helper functions
    /tests        # Frontend unit tests
/server
  /controllers    # Route handlers
  /routes         # API route definitions
  /middlewares    # Security and validation
  /services       # Third-party integrations (Google/AI)
  /utils          # Core business logic (Eligibility)
  /tests          # Backend unit tests
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Firebase Account
- Google Cloud Console Project (with Maps, Translate, and Speech APIs enabled)

### Installation

1. **Clone the repository**
2. **Install Root Dependencies**
   ```bash
   npm install
   ```
3. **Setup Client**
   ```bash
   cd client
   npm install
   ```
4. **Setup Server**
   ```bash
   cd server
   npm install
   ```
5. **Configure Environment Variables**
   - Copy `.env.example` to `server/.env` and `client/.env` (with `VITE_` prefix for client).
   - Add your Google and Firebase keys.

### Running the Project

- **Start Backend**: `cd server && npm run dev`
- **Start Frontend**: `cd client && npm run dev`

## 🧪 Testing

- **Backend Tests**: `cd server && npm test`
- **Frontend Tests**: `cd client && npm test`

## 🔐 Security & Accessibility

- **Security**: Rate limiting, Helmet (HTTP headers), Input sanitization, Secure Firebase rules.
- **Accessibility**: High contrast UI, ARIA labels, Keyboard navigation, Voice interaction.

---
Built with ❤️ for Democracy.
