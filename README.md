# 🏥 Medical Multi-Disease Risk Assessment System

A comprehensive, full-stack AI healthcare application designed to assess the risk of multiple diseases based on user input and medical data. The system utilizes traditional Machine Learning models for accurate disease prediction and leverages large language models (LLMs) to analyze medical documents and provide expert-level conversational summaries.

## ✨ Key Features

- **🩺 Multi-Disease Prediction:** Assess the risk factors for 8 critical conditions:
  - Diabetes
  - Stroke
  - Parkinson's Disease
  - Thyroid Disorders
  - Depression
  - Hepatitis
  - Heart Disease
  - Chronic Kidney Disease
- **📄 AI Medical Report Analysis:** Upload medical PDFs to automatically extract diagnoses, medications, patient history, and suggested tests using deep LLM document analysis (Powered by **Groq & Llama-3**).
- **🤖 Intelligent AI Summaries:** Generates personalized, natural-language summaries explaining the assessment results to patients using **Google Gemini API**.
- **🔐 Secure Authentication:** Complete user registration and login system with encrypted passwords using bcrypt and JWT/Session management.
- **⚡ Modern UI/UX:** A responsive, highly interactive frontend built with Next.js and Tailwind CSS.
- **🚀 High-Performance Backend:** Built on FastAPI to ensure rapid ML model inference and completely async API handling.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | FastAPI 0.135.1 (Python 3.12.10), Uvicorn 0.41.0 |
| **Database** | SQLite (via SQLAlchemy 2.0.48) |
| **ML Models** | Scikit-learn 1.3.2, CatBoost 1.2.10, LightGBM 4.6.0, XGBoost 3.2.0 |
| **AI & Cloud** | Google Gemini API, Groq API (Llama-3) |

## 📦 Project Structure

```
Medical-Disease-Risk-Assessment-System/
├── Backend/
│   ├── main.py                # FastAPI application entry point
│   ├── database.py            # Database configuration (SQLite)
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic input schemas for each disease
│   ├── predictor.py           # Disease prediction logic
│   ├── predict_utils.py       # Model loading and prediction utilities
│   ├── utils.py               # Password hashing utilities
│   ├── auth.py                # Authentication helpers
│   ├── models/                # Pre-trained ML model files (.pkl)
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (create manually)
├── Frontend/
│   ├── app/                   # Next.js app directory (pages & routes)
│   ├── components/            # Reusable React components
│   ├── context/               # Auth context provider
│   ├── package.json           # Node.js dependencies
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.12.10** ([Download](https://www.python.org/downloads/release/python-31210/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rashedulalbab253/Medical-Multi-Disease-Risk-Assessment-System.git
cd Medical-Multi-Disease-Risk-Assessment-System
```

---

### 2️⃣ Backend Setup

```bash
# Navigate to the Backend folder
cd Backend

# Create a Python 3.12 virtual environment
py -3.12 -m venv venv

# Activate the virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file inside the `Backend/` folder:

```env
# Database connection string
DATABASE_URL=sqlite:///./auth_db.db

# JWT secret key (change to a random string in production)
SECRET_KEY=your_secret_key_here

# JWT token expiration in minutes
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Google Gemini API Key (get one from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Groq API Key (get one from https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here
```

#### Start the Backend Server

```bash
# Make sure your virtual environment is activated, then run:
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

The backend API will be running at: **http://localhost:8000**
- API Docs (Swagger UI): **http://localhost:8000/docs**

---

### 3️⃣ Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to the Frontend folder
cd Frontend

# Install Node.js dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

Remember to configure your frontend environment variables. Create a `.env.local` file inside the `Frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend will be running at: **http://localhost:3000**

---

## ✅ Quick Start Summary

| Step | Command | Location |
|------|---------|----------|
| 1 | `cd Backend` | Project root |
| 2 | `py -3.12 -m venv venv` | Backend/ |
| 3 | `.\venv\Scripts\Activate.ps1` | Backend/ |
| 4 | `pip install -r requirements.txt` | Backend/ |
| 5 | `.\venv\Scripts\python.exe -m uvicorn main:app --reload` | Backend/ |
| 6 | Open new terminal → `cd Frontend` | Project root |
| 7 | `npm install --legacy-peer-deps` | Frontend/ |
| 8 | `npm run dev` | Frontend/ |

Then open **http://localhost:3000** in your browser.

---

## 🧠 How to Use

1. **Sign Up** — Create an account on the signup page.
2. **Log In** — Use your email and password to log in.
3. **Select a Disease** — Choose from 8 available disease risk assessments.
4. **Fill the Form** — Enter your health data (age, BMI, blood pressure, etc.).
5. **Get Results** — Receive an instant **High Risk** or **Low Risk** prediction along with an AI summary of factors.
6. **PDF Analysis** — Upload a medical PDF for AI-powered analysis to get structured insights.

## ⚙️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Make sure you activated the virtual environment and ran `pip install -r requirements.txt` |
| `Failed to fetch` on frontend | Ensure the backend server is running on port 8000 (`NEXT_PUBLIC_API_URL` is set) |
| `scikit-learn` unpickling errors | You must use `scikit-learn==1.3.2` (the version the models were trained with) |
| `npm install` errors | Try `npm install --legacy-peer-deps` |
| Database issues | The SQLite database file (`auth_db.db`) is created automatically on first run |

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License

This project is intended for educational purposes.

---

Made with ❤️ by Rashedul Albab.