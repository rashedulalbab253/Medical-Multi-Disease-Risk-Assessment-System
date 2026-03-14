# 🩺 Medical Multi-Disease Risk Assessment System

A full-stack web application that uses **Machine Learning** to assess the risk of multiple diseases. Users can input their health data and receive instant risk predictions powered by pre-trained ML models, along with AI-powered medical document analysis using **Google Gemini**.

## 🔍 Supported Diseases

| Disease | Model Type |
|---------|-----------|
| Diabetes | Scikit-learn |
| Stroke | Scikit-learn |
| Parkinson's | CatBoost |
| Thyroid | CatBoost |
| Depression | Scikit-learn |
| Hepatitis | Scikit-learn |
| Heart Disease | Scikit-learn |
| Chronic Kidney Disease | Scikit-learn |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | FastAPI (Python 3.12), Uvicorn |
| **Database** | SQLite |
| **ML Models** | Scikit-learn, CatBoost, LightGBM, XGBoost |
| **AI Analysis** | Google Gemini API |

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

- **Python 3.12** ([Download](https://www.python.org/downloads/))
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
5. **Get Results** — Receive an instant **High Risk** or **Low Risk** prediction.
6. **PDF Analysis** — Upload a medical PDF for AI-powered analysis using Google Gemini.

## ⚙️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Make sure you activated the virtual environment and ran `pip install -r requirements.txt` |
| `Failed to fetch` on frontend | Ensure the backend server is running on port 8000 |
| `scikit-learn` unpickling errors | You must use `scikit-learn==1.3.2` (the version the models were trained with) |
| `npm install` errors | Try `npm install --legacy-peer-deps` |
| Database issues | The SQLite database file (`auth_db.db`) is created automatically on first run |

## 📄 License

This project is for educational purposes.

---

Made with ❤️ for health awareness and disease prevention.