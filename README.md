# 🏥 Medical Multi-Disease Risk Assessment System

An AI-powered, full-stack healthcare web application that predicts the risk of **8 major diseases** using Machine Learning and provides intelligent medical document analysis powered by Large Language Models (LLMs).

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🩺 **Multi-Disease Prediction** | Risk assessment for Diabetes, Stroke, Parkinson's, Thyroid, Depression, Hepatitis, Heart Disease & Kidney Disease |
| 📄 **AI Medical Report Analysis** | Upload medical PDFs for automatic extraction of diagnoses, medications & risk factors (Powered by **Groq & Llama-3**) |
| 🤖 **Intelligent AI Summaries** | Natural-language health summaries explaining results to patients (Powered by **Google Gemini API**) |
| 🔐 **Secure Authentication** | User registration & login with bcrypt-encrypted passwords |
| ⚡ **Modern UI/UX** | Responsive, interactive interface built with Next.js & Tailwind CSS |
| 🚀 **High-Performance API** | FastAPI backend with async request handling and Swagger docs |

---

## 🔍 Supported Diseases & ML Models

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

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | FastAPI 0.135.1, Uvicorn 0.41.0, Python 3.12 |
| **Database** | SQLite via SQLAlchemy 2.0.48 |
| **ML Models** | Scikit-learn 1.3.2, CatBoost 1.2.10, LightGBM 4.6.0, XGBoost 3.2.0 |
| **AI & Cloud** | Google Gemini API, Groq API (Llama-3.3-70B) |

---

## 📦 Project Structure

```
Medical-Disease-Risk-Assessment-System/
├── Backend/
│   ├── main.py                # FastAPI entry point & API routes
│   ├── database.py            # SQLite database configuration
│   ├── models.py              # SQLAlchemy ORM models
│   ├── schemas.py             # Pydantic input schemas per disease
│   ├── predictor.py           # Disease prediction logic
│   ├── predict_utils.py       # Model loading utilities
│   ├── utils.py               # Password hashing helpers
│   ├── auth.py                # Authentication dependency
│   ├── models/                # Pre-trained ML model files (.pkl)
│   └── requirements.txt       # Python dependencies
├── Frontend/
│   ├── app/                   # Next.js App Router (pages & API routes)
│   ├── components/            # Reusable React components
│   ├── context/               # Auth context provider
│   └── package.json           # Node.js dependencies
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/downloads/release/python-31210/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rashedulalbab253/Medical-Multi-Disease-Risk-Assessment-System.git
cd Medical-Multi-Disease-Risk-Assessment-System
```

---

### 2️⃣ Backend Setup

```bash
cd Backend

# Create & activate virtual environment
py -3.12 -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 🔑 Configure Environment Variables

Create a `.env` file inside `Backend/`:

```env
DATABASE_URL=sqlite:///./auth_db.db
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=your_gemini_api_key_here       # https://aistudio.google.com/
GROQ_API_KEY=your_groq_api_key_here           # https://console.groq.com/
```

#### ▶️ Start the Backend

```bash
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

> Backend running at **http://localhost:8000** | Swagger Docs at **http://localhost:8000/docs**

---

### 3️⃣ Frontend Setup

Open a **new terminal**:

```bash
cd Frontend

# Install dependencies
npm install --legacy-peer-deps

# Start the dev server
npm run dev
```

Create a `.env.local` file inside `Frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Frontend running at **http://localhost:3000**

---

## ✅ Quick Start Summary

| Step | Command | Location |
|------|---------|----------|
| 1 | `git clone <repo-url>` | — |
| 2 | `cd Backend && py -3.12 -m venv venv` | Project root |
| 3 | `.\venv\Scripts\Activate.ps1` | Backend/ |
| 4 | `pip install -r requirements.txt` | Backend/ |
| 5 | Create `.env` with API keys | Backend/ |
| 6 | `uvicorn main:app --reload` | Backend/ |
| 7 | `cd Frontend && npm install --legacy-peer-deps` | Project root |
| 8 | `npm run dev` | Frontend/ |

---

## 🧠 How to Use

1. **Sign Up** — Create a new account
2. **Log In** — Authenticate with your email & password
3. **Select a Disease** — Choose from 8 available risk assessments
4. **Fill the Form** — Enter health data (age, BMI, blood pressure, etc.)
5. **Get Results** — Receive instant **High Risk / Low Risk** prediction with AI-generated insights
6. **PDF Analysis** — Upload a medical PDF for AI-powered document analysis

---

## ⚙️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Activate your venv and run `pip install -r requirements.txt` |
| `Failed to fetch` on frontend | Ensure backend is running & `NEXT_PUBLIC_API_URL` is set |
| `scikit-learn` unpickling errors | Must use `scikit-learn==1.3.2` (model training version) |
| `npm install` errors | Use `npm install --legacy-peer-deps` |
| Database issues | SQLite DB is auto-created on first run |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a [pull request](https://github.com/rashedulalbab253/Medical-Multi-Disease-Risk-Assessment-System/pulls).

## 📄 License

This project is intended for educational purposes.

---

Made with ❤️ by **Rashedul Albab**