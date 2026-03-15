import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { disease, parameters, prediction, probability } = await request.json()

    // Check if we have at least one API key
    if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "No AI API key configured. Set GROQ_API_KEY or GEMINI_API_KEY." }, { status: 500 })
    }

    // Create a prompt based on the disease type and parameters
    let prompt = ""

    if (disease === "kidney") {
      const hypertension = parameters.hypertension === 1 ? "has hypertension" : "does not have hypertension"
      const diabetesMellitus = parameters.diabetes_mellitus === 1 ? "has diabetes" : "does not have diabetes"
      const cad = parameters.coronary_artery_disease === 1 ? "has coronary artery disease" : "does not have coronary artery disease"
      const appetite = parameters.appetite === 0 ? "normal appetite" : "poor appetite"
      const edema = parameters.peda_edema === 1 ? "has pedal edema" : "does not have pedal edema"
      const anaemia = parameters.aanemia === 1 ? "has anaemia" : "does not have anaemia"
      const rbcStatus = parameters.red_blood_cells === 0 ? "normal" : "abnormal"
      const pcStatus = parameters.pus_cell === 0 ? "normal" : "abnormal"
      const pcClumps = parameters.pus_cell_clumps === 1 ? "present" : "not present"
      const bacteria = parameters.bacteria === 1 ? "present" : "not present"

      prompt = `You are a certified AI medical assistant with deep expertise in nephrology, hematology, and diagnostic medicine.

Based on the provided input, our AI system predicts that the individual ${prediction === 1 ? "has" : "does not have"} a high risk of chronic kidney disease (CKD), with a model confidence of ${(probability * 100).toFixed(2)}%.

The parameters are as follows:

- Age: ${parameters.age}
- Blood Pressure: ${parameters.blood_pressure} mmHg
- Specific Gravity: ${parameters.specific_gravity}
- Albumin (1-5 scale): ${parameters.albumin}
- Sugar (0-5 scale): ${parameters.sugar}
- Red Blood Cells: ${rbcStatus}
- Pus Cell: ${pcStatus}
- Pus Cell Clumps: ${pcClumps}
- Bacteria: ${bacteria}
- Blood Glucose (Random): ${parameters.blood_glucose_random} mg/dL
- Blood Urea: ${parameters.blood_urea} mg/dL
- Serum Creatinine: ${parameters.serum_creatinine} mg/dL
- Sodium: ${parameters.sodium} mEq/L
- Potassium: ${parameters.potassium} mEq/L
- Hemoglobin: ${parameters.haemoglobin} g/dL
- Packed Cell Volume: ${parameters.packed_cell_volume}%
- White Blood Cell Count: ${parameters.white_blood_cell_count} /cumm
- Red Blood Cell Count: ${parameters.red_blood_cell_count} million cells/cmm
- Hypertension: ${hypertension}
- Diabetes Mellitus: ${diabetesMellitus}
- Coronary Artery Disease: ${cad}
- Appetite: ${appetite}
- Pedal Edema: ${edema}
- Anaemia: ${anaemia}

Generate a detailed medical report (200-250 words) addressing parameter implications, abnormal indicators, comorbidity links, clinical symptom relevance, model reasoning, and actionable follow-up advice. Focus purely on medical insights in an empathetic yet professional tone.`
    } else if (disease === "depression") {
      const gender = parameters.Gender === 1 ? "male" : "female"
      const academicPressure = ["very low", "low", "moderate", "high", "very high"][parameters["Academic Pressure"] - 1] || "moderate"
      const studySatisfaction = ["very dissatisfied", "dissatisfied", "neutral", "satisfied", "very satisfied"][parameters["Study Satisfaction"] - 1] || "neutral"
      const sleepDuration = ["less than 5 hours", "5-6 hours", "7-8 hours", "more than 8 hours", "irregular or unknown"][parameters["Sleep Duration"]] || "unknown"
      const dietaryHabits = ["unhealthy", "moderate", "healthy", "not specified"][parameters["Dietary Habits"]] || "unknown"
      const degreeStatus = ["graduated", "post-graduate", "higher secondary", "other"][parameters.New_Degree] || "unknown"
      const suicidalThoughts = parameters["Have you ever had suicidal thoughts ?"] === 1 ? "has experienced suicidal thoughts" : "has not reported suicidal thoughts"
      const familyHistory = parameters["Family History of Mental Illness"] === 1 ? "has a family history of mental illness" : "has no known family history of mental illness"

      prompt = `You are a specialized mental health AI assistant with clinical training in psychology, psychiatry, and behavioral science.

Based on the input parameters, the AI model has predicted that this individual ${prediction === 1 ? "is at a high risk" : "is not currently at high risk"} for depression, with a confidence score of ${(probability * 100).toFixed(2)}%.

Psychosocial Profile:
- Gender: ${gender}
- Age: ${parameters.Age}
- Academic Pressure: ${academicPressure}
- CGPA: ${parameters.CGPA}
- Study Satisfaction: ${studySatisfaction}
- Sleep Duration: ${sleepDuration}
- Dietary Habits: ${dietaryHabits}
- Education Level: ${degreeStatus}
- ${suicidalThoughts}
- Study/Work Hours per Day: ${parameters["Work/Study Hours"]}
- Financial Stress Level (1-5): ${parameters.Financial_Stress}
- ${familyHistory}

Write an approximately 200-word summary interpreting these psychological, academic, and lifestyle factors in relation to depression risk. Explain model reasoning and patterns, highlight key influences, and offer 2-3 targeted self-care or intervention tips. Avoid disclaimers; maintain a gentle, clear, and empowering tone.`
    } else if (disease === "stroke") {
      const gender = parameters.gender === 0 ? "male" : "female"
      const hypertension = parameters.hypertension === 1 ? "has hypertension" : "does not have hypertension"
      const heartDisease = parameters.heart_disease === 1 ? "has heart disease" : "does not have heart disease"
      const maritalStatus = parameters.ever_married === 1 ? "is married" : "is not married"
      const workType = ["Private", "Self-employed", "Government Job", "Children", "Never worked"][parameters.work_type] || "Unknown"
      const residence = parameters.residence_type === 0 ? "Urban" : "Rural"
      const smokingStatus = ["never smoked", "formerly smoked", "smokes", "unknown"][parameters.smoking_status] || "unknown"

      prompt = `You are a trusted AI medical expert with specialization in cardiovascular neurology and epidemiology.

Our machine learning model estimates that this person ${prediction === 1 ? "has" : "does not have"} a high risk of stroke, with a confidence score of ${(probability * 100).toFixed(2)}%.

Patient Profile:
- Gender: ${gender}
- Age: ${parameters.age}
- Marital Status: ${maritalStatus}
- Hypertension: ${hypertension}
- Heart Disease: ${heartDisease}
- Work Type: ${workType}
- Residence Type: ${residence}
- Average Glucose Level: ${parameters.avg_glucose_level} mg/dL
- Body Mass Index (BMI): ${parameters.bmi}
- Smoking Status: ${smokingStatus}

Generate a highly informative and structured summary (200-250 words) that includes:

1. An explanation of how each factor (like hypertension, glucose level, BMI, heart condition, and smoking) physiologically affects stroke risk.
2. The statistical weight of each risk based on existing epidemiological studies or known thresholds.
3. The interplay between lifestyle indicators (work type, residence, marital status) and health outcomes in stroke prediction.
4. A model-based explanation of how the system likely made this prediction using risk clustering or parameter thresholds.
5. Actionable, compassionate health management insights tailored to this patient's profile - without alarms or disclaimers.

Keep the tone clinical yet clear, avoid medical jargon, and focus solely on *stroke-specific insights*.`
    } else if (disease === "thyroid") {
      const gender = parameters.sex === 1 ? "male" : "female"
      const items = [
        parameters.thyroxine === 1 && "is currently taking thyroxine",
        parameters.queryonthyroxine === 1 && "there is a query on thyroxine intake",
        parameters.onantithyroidmedication === 1 && "is on antithyroid medication",
        parameters.sick === 1 && "is currently sick",
        parameters.pregnant === 1 && "is pregnant",
        parameters.thyroidsurgery === 1 && "has undergone thyroid surgery",
        parameters.I131treatment === 1 && "has received I131 treatment",
        parameters.queryhypothyroid === 1 && "suspected hypothyroidism",
        parameters.queryhyperthyroid === 1 && "suspected hyperthyroidism",
        parameters.lithium === 1 && "history of lithium use",
        parameters.goitre === 1 && "has goitre",
        parameters.tumor === 1 && "has a tumor",
        parameters.hypopituitary === 1 && "has hypopituitarism",
        parameters.psych === 1 && "has psychological conditions"
      ].filter(Boolean).join(", ")

      prompt = `You are a senior endocrinologist AI expert analyzing thyroid function using clinical biomarkers and patient history.

Model prediction: This individual ${prediction === 1 ? "has" : "does not have"} thyroid dysfunction. Confidence: ${(probability * 100).toFixed(2)}%.

Profile Summary:
- Age: ${parameters.age}
- Gender: ${gender}
- Conditions: ${items}
- TSH: ${parameters.TSH}, T3: ${parameters.T3}, T4: ${parameters.T4}, T4U: ${parameters.T4U}, FTI: ${parameters.FTI}

Generate a 200-250 word clinical interpretation covering:
1. What TSH, T3, T4, T4U, and FTI suggest about thyroid health.
2. How historical treatments may influence hormone levels.
3. Risk implications from comorbidities.
4. Diagnostic logic for thyroid classification.
5. Specific, relevant clinical suggestions.

Stay precise and thyroid-focused, in calm medical language.`
    } else if (disease === "diabetes") {
      const smokingStatusOptions = ["never smoked", "is a current smoker", "is a former smoker", "has no information about smoking history"]
      const smokingStatus = smokingStatusOptions[parameters.smoking_history] || "unknown"

      prompt = `
You are a highly qualified medical AI assistant with expertise in clinical diagnosis, human biology, chemistry, and statistical modeling.

Based on the input parameters, our machine learning model predicts that this individual ${prediction === 1 ? "has" : "does not have"} a high risk of ${disease}, with a confidence score of ${(probability * 100).toFixed(2)}%.

Generate a structured medical summary (200 words) that includes:

1. A breakdown of each biological and chemical marker (glucose: ${parameters.blood_glucose_level} mg/dL, HbA1c: ${parameters.HbA1c_level}%, BMI: ${parameters.bmi}, hypertension: ${parameters.hypertension === 1 ? "Yes" : "No"}, heart disease: ${parameters.heart_disease === 1 ? "Yes" : "No"}, smoking status: ${smokingStatus}, age: ${parameters.age}) and its clinical significance in relation to ${disease}.
2. How these parameters influence cellular, metabolic, or hormonal processes associated with ${disease}.
3. Statistical relevance of these factors (e.g., thresholds, ranges, percentiles, correlations).
4. A concise explanation of how the model likely made this prediction based on these variables.
5. Actionable, non-alarming insights on health management tailored to these factors.

The language should be medically accurate yet simplified for a non-medical audience. Avoid generic advice. Do not use disclaimers or repeat that this is not a medical diagnosis. Only focus on diagnosis insights and risk interpretation—precise, informative, and insightful.
`
    } else if (disease === "parkinsons") {
      const gender = parameters.gender === 0 ? "male" : "female"
      const ethnicityMap = ["Caucasian", "African American", "Asian", "Other"]
      const ethnicity = ethnicityMap[parameters.ethnicity] || "Unknown"
      const educationLevelMap = ["no formal education", "high school", "bachelor's degree", "higher education"]
      const education = educationLevelMap[parameters.education_level] || "Unknown"

      const familyHistory = parameters.family_history_parkinsons === 1 ? "has a family history of Parkinson's disease" : "does not have a family history of Parkinson's disease"
      const brainInjury = parameters.traumatic_brain_injury === 1 ? "has experienced traumatic brain injury" : "has no history of brain injury"
      const hypertension = parameters.hypertension === 1 ? "has hypertension" : "has no hypertension"
      const diabetes = parameters.diabetes === 1 ? "has diabetes" : "has no diabetes"
      const depression = parameters.depression === 1 ? "has been diagnosed with depression" : "has no history of depression"
      const stroke = parameters.stroke === 1 ? "has suffered a stroke in the past" : "has not experienced a stroke"

      const tremor = parameters.tremor === 1 ? "exhibits tremors" : "no tremors observed"
      const rigidity = parameters.rigidity === 1 ? "has muscle rigidity" : "no muscle rigidity"
      const bradykinesia = parameters.bradykinesia === 1 ? "experiences bradykinesia" : "no bradykinesia"
      const posturalInstability = parameters.postural_instability === 1 ? "shows postural instability" : "normal posture"
      const speechProblems = parameters.speech_problems === 1 ? "has speech problems" : "normal speech"
      const sleepDisorders = parameters.sleep_disorders === 1 ? "experiences sleep disorders" : "normal sleep patterns"
      const constipation = parameters.constipation === 1 ? "suffers from constipation" : "no constipation"

      prompt = `You are a leading AI neurologist specializing in movement disorders and neurodegenerative diseases.

Our predictive AI system has evaluated this patient and predicts that they ${prediction === 1 ? "have" : "do not have"} Parkinson's disease, with a confidence probability of ${(probability * 100).toFixed(2)}%.

Patient Overview:
- Demographic: ${parameters.age} year old ${gender}, Ethnicity: ${ethnicity}, Education: ${education}
- Lifestyle Factors: BMI: ${parameters.bmi}, Smoking: ${parameters.smoking}, Alcohol Consumption: ${parameters.alcohol_consumption}, Physical Activity (0-10): ${parameters.physical_activity}, Diet Quality (0-10): ${parameters.diet_quality}, Sleep Quality (0-10): ${parameters.sleep_quality}
- Medical History: ${familyHistory}, ${brainInjury}, ${hypertension}, ${diabetes}, ${depression}, ${stroke}
- Cardiovascular Health: BP: ${parameters.systolic_bp}/${parameters.diastolic_bp} mmHg, Total Cholesterol: ${parameters.cholesterol_total} mg/dL (LDL: ${parameters.cholesterol_ldl}, HDL: ${parameters.cholesterol_hdl}, Triglycerides: ${parameters.cholesterol_triglycerides})
- Clinical Assessments: UPDRS Score: ${parameters.updrs}, MoCA Score: ${parameters.moca}, Functional Assessment: ${parameters.functional_assessment}
- Neurological & Autonomic Symptoms: ${tremor}, ${rigidity}, ${bradykinesia}, ${posturalInstability}, ${speechProblems}, ${sleepDisorders}, ${constipation}

Generate a comprehensive clinical summary (200-250 words) including:
1. Interpretation of the primary motor symptoms (tremor, rigidity, bradykinesia) and UPDRS score.
2. The relevance of non-motor symptoms (sleep disorders, constipation, depression) and cognitive assessment (MoCA score).
3. How lifestyle, cardiovascular health, and medical history might influence the risk or progression of the disease.
4. Provide next steps for clinical management (e.g., DaTscan, levodopa trial, physical therapy, cognitive monitoring).

Make the summary professional, clear, and highly focused on Parkinson's disease biomarkers and symptoms. Avoid generic advice.`
    } else if (disease === "hepatitis") {
      const gender = parameters.sex === 0 ? "female" : "male"

      prompt = `You are an expert hepatologist and AI medical assistant.

Our diagnostic model has evaluated the liver function tests and predicts that this patient ${prediction === 1 ? "has" : "does not have"} a high risk of Hepatitis (or exhibits significant hepatic laboratory abnormalities), with a model confidence of ${(probability * 100).toFixed(2)}%.

Patient Laboratory Profile:
- Age: ${parameters.age}
- Gender: ${gender}
- Albumin (ALB): ${parameters.alb}
- Cholinesterase (CHE): ${parameters.che}
- Cholesterol (CHOL): ${parameters.chol}
- Creatinine Log (CREA_log): ${parameters.crea_log}
- Bilirubin Log (BIL_log): ${parameters.bil_log}
- Alanine Transaminase Log (ALT_log): ${parameters.alt_log}
- Gamma-Glutamyl Transferase Log (GGT_log): ${parameters.ggt_log}
- Aspartate Aminotransferase Log (AST_log): ${parameters.ast_log}
- Alkaline Phosphatase Log (ALP_log): ${parameters.alp_log}

Create a comprehensive clinical summary (200-250 words) including:

1. Analysis of liver function biomarkers (ALB, CHE, CHOL, AST, ALT, ALP, GGT, BIL) in relation to hepatic cellular damage, cholestasis, or synthetic function.
2. Interpretation of the provided biomarkers and their significance in identifying hepatitis or other liver conditions.
3. How these log-transformed enzymes correlate with hepatic inflammation or injury.
4. Provide next steps for clinical management (e.g., hepatitis viral panel, liver ultrasound, lifestyle modifications, regular liver function monitoring).

Ensure that the summary is clear, concise, and professional. Avoid generic advice; focus strictly on liver function and biomarker-related insights based solely on the data provided.`
    } else if (disease === "heart") {
      const gender = parameters.gender === 0 ? "female" : "male"
      const chestPainType = [
        'Typical Angina',
        'Atypical Angina',
        'Non-anginal Pain',
        'Asymptomatic'
      ][parameters.chestpaintype] || "Unknown"

      const fastingBloodSugar = parameters.fastingbloodsugar === 1 ? "has fasting blood sugar > 120 mg/dL" : "has fasting blood sugar <= 120 mg/dL"
      const restingECG = [
        'Normal',
        'ST-T Abnormality',
        'Left Ventricular Hypertrophy'
      ][parameters.restingelectro] || "Unknown"

      const exerciseInducedAngina = parameters.exerciseangia === 1 ? "has exercise-induced angina" : "does not have exercise-induced angina"
      const slopeOfSTSegment = [
        'Unknown',
        'Upsloping',
        'Flat',
        'Downsloping'
      ][parameters.slope] || "Unknown"

      const targetText = prediction === 1 ? "has heart disease" : "does not have heart disease"

      prompt = `You are a cardiologist AI analyzing the heart disease risk in patients based on clinical biomarkers and symptoms.

Prediction Result: The model suggests this patient ${targetText}, with a probability of ${(probability * 100).toFixed(2)}%.

Patient Clinical Profile:
- Age: ${parameters.age} years
- Gender: ${gender}
- Chest Pain Type: ${chestPainType}
- Resting Blood Pressure: ${parameters.restingbloodpressure} mmHg
- Serum Cholesterol: ${parameters.serumcholesterol} mg/dL
- Fasting Blood Sugar: ${fastingBloodSugar}
- Resting ECG: ${restingECG}
- Maximum Heart Rate Achieved: ${parameters.maxheartrate}
- Exercise Induced Angina: ${exerciseInducedAngina}
- Oldpeak (ST Depression): ${parameters.oldpeak}
- Slope of ST Segment: ${slopeOfSTSegment}
- Number of Major Vessels Colored: ${parameters.noofmajorvessels}

Create a comprehensive clinical summary (200-250 words) including:

1. *Interpretation of Key Biomarkers*: Explain the significance of resting blood pressure, cholesterol levels, and heart rate in determining heart disease risk.
2. *Chest Pain and Symptoms*: Discuss how the type of chest pain (e.g., typical angina) and symptoms like exercise-induced angina or oldpeak (ST depression) influence the likelihood of heart disease.
3. *Resting ECG*: Analyze the ECG result and its implication on heart function and risk of coronary artery disease.
4. *Clinical Implications of Fasting Blood Sugar*: Discuss the correlation between fasting blood sugar levels and cardiovascular risk.
5. *Risk Assessment*: Combine all factors (chest pain type, ECG, exercise-induced angina, etc.) to provide a clear clinical assessment.
6. *Clinical Recommendations*: Suggest follow-up actions such as further diagnostic tests (e.g., stress test, angiography) or lifestyle modifications (e.g., exercise, dietary changes).

Make the summary professional, focused on heart disease, and based on logical clinical insights. Avoid generic or unrelated suggestions.`
    } else {
      prompt = `You are a medical AI assistant providing a summary of health risk factors.
      
A predictive model has analyzed the patient's data for ${disease} and returned a prediction of ${prediction} with ${(probability * 100).toFixed(2)}% confidence (where 1 typically indicates higher risk).

Please provide a medically sound, compassionate 150-200 word summary explaining what this result might mean generally and what standard precautions or next steps someone should take when managing risks associated with ${disease}.

(Note: this is an automated general response as specific parameter mapping was unavailable).`
    }

    // Primary: Use Groq API (OpenAI-compatible format)
    let summaryText = "Unable to extract summary. Please try again."

    if (process.env.GROQ_API_KEY) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Groq API Error:", errorText)
        throw new Error(`Failed to generate summary: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      if (data.choices && data.choices[0] && data.choices[0].message) {
        summaryText = data.choices[0].message.content
      }
    } else if (process.env.GEMINI_API_KEY) {
      // Fallback: Use Gemini API
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Gemini API Error:", errorText)
        throw new Error(`Failed to generate summary: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]) {
        summaryText = data.candidates[0].content.parts[0].text
      }
    } else {
      throw new Error("No AI API key configured. Set GROQ_API_KEY or GEMINI_API_KEY in .env.local")
    }

    return NextResponse.json({ summary: summaryText })
  } catch (error) {
    console.error("AI Summary generation failed:", error)
    return NextResponse.json({ 
      error: "Failed to generate AI summary", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}