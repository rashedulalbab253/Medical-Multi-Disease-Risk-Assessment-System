import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { disease, parameters, prediction, probability } = await request.json()

    // Check if we have the API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Create a prompt based on the disease type and parameters
    let prompt = ""

if (disease === "kidney") {
  const gender = parameters.gender === 0 ? "male" : "female"
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
- Albumin (1–5 scale): ${parameters.albumin}
- Sugar (0–5 scale): ${parameters.sugar}
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

Generate a detailed medical report (200–250 words) addressing parameter implications, abnormal indicators, comorbidity links, clinical symptom relevance, model reasoning, and actionable follow-up advice. Focus purely on medical insights in an empathetic yet professional tone.`
}

else if (disease === "depression") {
  const gender = parameters.gender === 1 ? "male" : "female"
  const academicPressure = ["very low", "low", "moderate", "high", "very high"][parameters.academic_pressure - 1]
  const studySatisfaction = ["very dissatisfied", "dissatisfied", "neutral", "satisfied", "very satisfied"][parameters.study_satisfaction - 1]
  const sleepDuration = ["less than 5 hours", "5–6 hours", "7–8 hours", "more than 8 hours", "irregular or unknown"][parameters.sleep_duration]
  const dietaryHabits = ["unhealthy", "moderate", "healthy", "not specified"][parameters.dietary_habits]
  const degreeStatus = ["graduated", "post-graduate", "higher secondary", "other"][parameters.new_degree]
  const suicidalThoughts = parameters.suicidal_thoughts === 1 ? "has experienced suicidal thoughts" : "has not reported suicidal thoughts"
  const familyHistory = parameters.family_history === 1 ? "has a family history of mental illness" : "has no known family history of mental illness"

  prompt = `You are a specialized mental health AI assistant with clinical training in psychology, psychiatry, and behavioral science.

Based on the input parameters, the AI model has predicted that this individual ${prediction === 1 ? "is at a high risk" : "is not currently at high risk"} for depression, with a confidence score of ${(probability * 100).toFixed(2)}%.

Psychosocial Profile:
- Gender: ${gender}
- Age: ${parameters.age}
- City: ${parameters.city}
- Academic Pressure: ${academicPressure}
- CGPA: ${parameters.cgpa}
- Study Satisfaction: ${studySatisfaction}
- Sleep Duration: ${sleepDuration}
- Dietary Habits: ${dietaryHabits}
- Education Level: ${degreeStatus}
- ${suicidalThoughts}
- Study/Work Hours per Day: ${parameters.work_hours}
- Financial Stress Level (1–5): ${parameters.financial_stress}
- ${familyHistory}

Write an approximately 200-word summary interpreting these psychological, academic, and lifestyle factors in relation to depression risk. Explain model reasoning and patterns, highlight key influences, and offer 2–3 targeted self-care or intervention tips. Avoid disclaimers; maintain a gentle, clear, and empowering tone.`
}

else if (disease === "stroke") {
  const gender = parameters.gender === "Male" ? "male" : "female"
  const hypertension = parameters.hypertension === 1 ? "has hypertension" : "does not have hypertension"
  const heartDisease = parameters.heart_disease === 1 ? "has heart disease" : "does not have heart disease"
  const maritalStatus = parameters.ever_married === "Yes" ? "is married" : "is not married"
  const residence = parameters.residence_type
  
  prompt = `You are a trusted AI medical expert with specialization in cardiovascular neurology and epidemiology.

Our machine learning model estimates that this person ${prediction === 1 ? "has" : "does not have"} a high risk of stroke, with a confidence score of ${(probability * 100).toFixed(2)}%.

Patient Profile:
- Gender: ${gender}
- Age: ${parameters.age}
- Marital Status: ${maritalStatus}
- Hypertension: ${hypertension}
- Heart Disease: ${heartDisease}
- Residence Type: ${residence}
- Average Glucose Level: ${parameters.avg_glucose_level} mg/dL
- BMI: ${parameters.bmi}

Create a 200–250 word expert summary that explains stroke risk factors, known epidemiological links, model insights, and personal health strategies specific to this profile. Focus only on stroke-related content with clarity and compassion.`
}

else if (disease === "thyroid") {
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

Generate a 200–250 word clinical interpretation covering:
1. What TSH, T3, T4, T4U, and FTI suggest about thyroid health.
2. How historical treatments may influence hormone levels.
3. Risk implications from comorbidities.
4. Diagnostic logic for thyroid classification.
5. Specific, relevant clinical suggestions.

Stay precise and thyroid-focused, in calm medical language.`
}

    else if (disease === "diabetes") {
      const gender = parameters.gender === 0 ? "male" : "female"
      const hypertension = parameters.hypertension === 1 ? "has" : "does not have"
      const heartDisease = parameters.heart_disease === 1 ? "has" : "does not have"
      let smokingStatus = "never smoked"

      if (parameters.smoking_history === 1) {
        smokingStatus = "is a current smoker"
      } else if (parameters.smoking_history === 2) {
        smokingStatus = "is a former smoker"
      } else if (parameters.smoking_history === 3) {
        smokingStatus = "has no information about smoking history"
      }

      prompt = `
You are a highly qualified medical AI assistant with expertise in clinical diagnosis, human biology, chemistry, and statistical modeling.

Based on the input parameters, our machine learning model predicts that this individual ${prediction === 1 ? "has" : "does not have"} a high risk of ${disease}, with a confidence score of ${(probability * 100).toFixed(2)}%.

Generate a structured medical summary (200 words) that includes:

1. A breakdown of each biological and chemical marker (e.g., glucose, BMI, blood pressure, cholesterol) and its clinical significance in relation to ${disease}.
2. How these parameters influence cellular, metabolic, or hormonal processes associated with ${disease}.
3. Statistical relevance of these factors (e.g., thresholds, ranges, percentiles, correlations).
4. A concise explanation of how the model likely made this prediction based on these variables.
5. Actionable, non-alarming insights on health management tailored to these factors.

The language should be medically accurate yet simplified for a non-medical audience. Avoid generic advice. Do not use disclaimers or repeat that this is not a medical diagnosis. Only focus on diagnosis insights and risk interpretation—precise, informative, and insightful.
`  
    } 

else if (disease === "stroke") {
  const gender = parameters.gender === "Male" ? "male" : "female"
  const hypertension = parameters.hypertension === 1 ? "has hypertension" : "does not have hypertension"
  const heartDisease = parameters.heart_disease === 1 ? "has heart disease" : "does not have heart disease"
  const maritalStatus = parameters.ever_married === "Yes" ? "is married" : "is not married"
  const workType = parameters.work_type.replace("_", " ")
  const residence = parameters.residence_type
  const smokingStatus = (() => {
    switch (parameters.smoking_status) {
      case "formerly smoked":
        return "has a history of smoking"
      case "smokes":
        return "is currently a smoker"
      case "never smoked":
        return "has never smoked"
      default:
        return "has unknown smoking status"
    }
  })()

  prompt = `
You are a trusted AI medical expert with specialization in cardiovascular neurology and epidemiology.

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
5. Actionable, compassionate health management insights tailored to this patient’s profile — without alarms or disclaimers.

Keep the tone clinical yet clear, avoid medical jargon, and focus solely on *stroke-specific insights*.
`
}
else if (disease === "parkinsons") {
  const gender = parameters.Gender === 0 ? "male" : "female"
  const ethnicityMap = ["Caucasian", "African American", "Asian", "Other"]
  const ethnicity = ethnicityMap[parameters.Ethnicity]
  const educationLevelMap = ["no formal education", "high school", "bachelor’s degree", "higher education"]
  const education = educationLevelMap[parameters.EducationLevel]

  const familyHistory = parameters.FamilyHistoryParkinsons === 1 ? "has a family history of Parkinson’s disease" : "does not have a family history of Parkinson’s disease"
  const brainInjury = parameters.TraumaticBrainInjury === 1 ? "has experienced traumatic brain injury" : "has no history of brain injury"
  const hypertension = parameters.Hypertension === 1 ? "has hypertension" : "has no hypertension"
  const diabetes = parameters.Diabetes === 1 ? "has diabetes" : "has no diabetes"
  const depression = parameters.Depression === 1 ? "has been diagnosed with depression" : "has no history of depression"
  const stroke = parameters.Stroke === 1 ? "has suffered a stroke in the past" : "has not experienced a stroke"

  const tremor = parameters.Tremor === 1 ? "exhibits tremors" : "no tremors observed"
  const rigidity = parameters.Rigidity === 1 ? "shows signs of rigidity" : "no rigidity noted"
  const bradykinesia = parameters.Bradykinesia === 1 ? "has bradykinesia (slowness of movement)" : "no bradykinesia present"
  const posturalInstability = parameters.PosturalInstability === 1 ? "exhibits postural instability" : "stable posture"
  const speech = parameters.SpeechProblems === 1 ? "has speech difficulties" : "no speech issues"
  const sleep = parameters.SleepDisorders === 1 ? "reports sleep disturbances" : "no sleep problems"
  const constipation = parameters.Constipation === 1 ? "suffers from constipation" : "no constipation reported"

  prompt = `
You are a senior neurologist AI trained in the diagnosis and progression assessment of Parkinson’s Disease, interpreting complex clinical, motor, and lifestyle data.

Prediction Result: The model suggests this patient ${prediction === 1 ? "has" : "does not have"} Parkinson’s Disease, with a probability of ${(probability * 100).toFixed(2)}%.

Patient Clinical Profile:
- Age: ${parameters.Age}
- Gender: ${gender}
- Ethnicity: ${ethnicity}
- Education Level: ${education}
- BMI: ${parameters.BMI}
- Smoking: ${parameters.Smoking === 1 ? "Yes" : "No"}
- Alcohol Consumption: ${parameters.AlcoholConsumption} units/week
- Physical Activity: ${parameters.PhysicalActivity} hrs/week
- Diet Quality Score: ${parameters.DietQuality}/10
- Sleep Quality Score: ${parameters.SleepQuality}/10

Medical History:
- ${familyHistory}
- ${brainInjury}
- ${hypertension}
- ${diabetes}
- ${depression}
- ${stroke}

Clinical Measurements:
- Blood Pressure: ${parameters.SystolicBP}/${parameters.DiastolicBP} mmHg
- Cholesterol - Total: ${parameters.CholesterolTotal} mg/dL
- LDL: ${parameters.CholesterolLDL} mg/dL
- HDL: ${parameters.CholesterolHDL} mg/dL
- Triglycerides: ${parameters.CholesterolTriglycerides} mg/dL

Motor & Functional Assessments:
- UPDRS Score: ${parameters.UPDRS} / 199
- MoCA Cognitive Score: ${parameters.MoCA} / 30
- Functional Assessment: ${parameters.FunctionalAssessment} / 10

Symptoms:
- ${tremor}
- ${rigidity}
- ${bradykinesia}
- ${posturalInstability}
- ${speech}
- ${sleep}
- ${constipation}

Create a medically detailed clinical summary (200–250 words) covering:

1. Interpretation of UPDRS, MoCA, and Functional Assessment in relation to Parkinson's progression.
2. Logical synthesis of symptoms (tremor, bradykinesia, etc.) and how they align with Parkinson’s diagnostic criteria.
3. Risk factor assessment based on lifestyle, age, and comorbidities (e.g., TBI, depression, stroke).
4. Explain diagnostic reasoning in a human-like manner (symptom clusters ↔ cognitive score ↔ risk history).
5. Offer medically valid next steps (e.g., refer for DaTscan, initiate dopamine therapy, recommend neurorehab, or regular monitoring).

Use professional yet accessible language. Stick strictly to Parkinson’s-related interpretations. Avoid generic health advice or alarming conclusions.
`
}
else if (disease === "hepatitis") {
  const gender = parameters.Sex === 0 ? "female" : "male"
  const categoryMap: { [key: string]: number } = {
    '0=Blood Donor': 0,
    '0s=suspect Blood Donor': 1,
    '2=Fibrosis': 3,
    '3=Cirrhosis': 4
  };
  
  const categoryValue = categoryMap[parameters.category];
  
  if (categoryValue === undefined) {
    // handle invalid category case
    throw new Error(`Invalid category: ${parameters.category}`);
  }
  
  // Now categoryValue is guaranteed to be a number
  const category = categoryValue;
  

  const alb = parameters.ALB
  const che = parameters.CHE
  const chol = parameters.CHOL
  const crea_log = parameters.CREA_log
  const bil_log = parameters.BIL_log
  const alt_log = parameters.ALT_log
  const ggt_log = parameters.GGT_log
  const ast_log = parameters.AST_log
  const alp_log = parameters.ALP_log

  const liverHistory = parameters.liverHistory === 1 ? "has a history of liver disease" : "has no liver disease history"
  const viralHepatitis = parameters.viralHepatitis === 1 ? "has a history of viral hepatitis" : "no history of viral hepatitis"
  const alcoholUse = parameters.alcoholUse === 1 ? "is a regular alcohol user" : "does not consume alcohol regularly"
  const jaundice = parameters.jaundice === 1 ? "shows signs of jaundice" : "no jaundice observed"
  const fever = parameters.fever === 1 ? "has a fever" : "no fever present"
  const fatigue = parameters.fatigue === 1 ? "is experiencing fatigue" : "is not fatigued"
  const nausea = parameters.nausea === 1 ? "reports nausea" : "no nausea"

  prompt = `
You are a senior hepatologist AI analyzing the liver function in individuals based on clinical biomarkers, history, and symptoms.

Prediction Result: The model suggests this patient ${prediction === 1 ? "has" : "does not have"} hepatitis, with a probability of ${(probability * 100).toFixed(2)}%.

Patient Clinical Profile:
- Age: ${parameters.Age}
- Gender: ${gender}
- Category: ${category === 0 ? 'Blood Donor' : category === 1 ? 'Suspect Blood Donor' : category === 3 ? 'Fibrosis' : 'Cirrhosis'}
- ALB: ${alb}
- CHE: ${che}
- CHOL: ${chol}
- CREA_log: ${crea_log}
- BIL_log: ${bil_log}
- ALT_log: ${alt_log}
- GGT_log: ${ggt_log}
- AST_log: ${ast_log}
- ALP_log: ${alp_log}

Medical History:
- ${liverHistory}
- ${viralHepatitis}
- ${alcoholUse}
- ${jaundice}
- ${fever}
- ${fatigue}
- ${nausea}

Create a comprehensive clinical summary (200–250 words) including:

1. Analysis of liver function biomarkers (ALB, CHE, CHOL, ALT, AST, ALP, etc.) in relation to hepatitis diagnosis (viral or alcoholic).
2. Interpretation of clinical symptoms (e.g., jaundice, fever, fatigue) and their significance in hepatitis progression.
3. How previous liver conditions (fibrosis, cirrhosis) and history of viral hepatitis impact current liver function.
4. Risk assessment based on alcohol use, fatigue, and nausea, and any potential association with liver damage.
5. Provide next steps for clinical management (e.g., hepatitis viral load test, liver biopsy, stop alcohol consumption, regular liver function monitoring).

Ensure that the summary is clear, concise, and professional. Avoid generic advice; focus strictly on liver function and hepatitis-related insights.
`
}
else if (disease === "heart_disease") {
  const gender = parameters.Gender === 0 ? "female" : "male"
  const chestPainType = [
    'Typical Angina',
    'Atypical Angina',
    'Non-anginal Pain',
    'Asymptomatic'
  ][parameters.ChestPainType]

  const restingBP = parameters.RestingBloodPressure
  const serumCholesterol = parameters.SerumCholesterol
  const fastingBloodSugar = parameters.FastingBloodSugar === 1 ? "has fasting blood sugar > 120 mg/dL" : "has fasting blood sugar ≤ 120 mg/dL"
  const restingECG = [
    'Normal',
    'ST-T Abnormality',
    'Left Ventricular Hypertrophy'
  ][parameters.RestingECG]

  const maxHeartRate = parameters.MaximumHeartRateAchieved
  const exerciseInducedAngina = parameters.ExerciseInducedAngina === 1 ? "has exercise-induced angina" : "does not have exercise-induced angina"
  const oldpeak = parameters.Oldpeak
  const slopeOfSTSegment = [
    'Upsloping',
    'Flat',
    'Downsloping'
  ][parameters.SlopeOfSTSegment]

  const numMajorVessels = parameters.NumberOfMajorVesselsColored
  const target = parameters.Target === 1 ? "has heart disease" : "does not have heart disease"

  prompt = `
You are a cardiologist AI analyzing the heart disease risk in patients based on clinical biomarkers and symptoms.

Prediction Result: The model suggests this patient ${target}, with a probability of ${(probability * 100).toFixed(2)}%.

Patient Clinical Profile:
- Age: ${parameters.Age} years
- Gender: ${gender}
- Chest Pain Type: ${chestPainType}
- Resting Blood Pressure: ${restingBP} mmHg
- Serum Cholesterol: ${serumCholesterol} mg/dL
- Fasting Blood Sugar: ${fastingBloodSugar}
- Resting ECG: ${restingECG}
- Maximum Heart Rate Achieved: ${maxHeartRate}
- Exercise Induced Angina: ${exerciseInducedAngina}
- Oldpeak (ST Depression): ${oldpeak}
- Slope of ST Segment: ${slopeOfSTSegment}
- Number of Major Vessels Colored: ${numMajorVessels}

Create a comprehensive clinical summary (200–250 words) including:

1. *Interpretation of Key Biomarkers*: Explain the significance of resting blood pressure, cholesterol levels, and heart rate in determining heart disease risk.
2. *Chest Pain and Symptoms*: Discuss how the type of chest pain (e.g., typical angina) and symptoms like exercise-induced angina or oldpeak (ST depression) influence the likelihood of heart disease.
3. *Resting ECG*: Analyze the ECG result and its implication on heart function and risk of coronary artery disease.
4. *Clinical Implications of Fasting Blood Sugar*: Discuss the correlation between fasting blood sugar levels and cardiovascular risk.
5. *Risk Assessment*: Combine all factors (chest pain type, ECG, exercise-induced angina, etc.) to provide a clear clinical assessment.
6. *Clinical Recommendations*: Suggest follow-up actions such as further diagnostic tests (e.g., stress test, angiography) or lifestyle modifications (e.g., exercise, dietary changes).

Make the summary professional, focused on heart disease, and based on logical clinical insights. Avoid generic or unrelated suggestions.
`
}
else {
  prompt = `You are a medical AI assistant providing a summary of health risk factors.

Based on the provided parameters, our prediction model indicates this person ${prediction === 1 ? "has" : "does not have"} a high risk of ${disease}, with a confidence of ${(probability * 100).toFixed(2)}%.

Please provide a concise, informative summary (150–200 words) explaining what this means, potential risk factors, and general advice.

Make sure your tone is empathetic and informative, not alarming. Encourage consulting licensed medical professionals for critical issues. Keep it professional but compassionate.`
}


    // Make the call to the Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,  // Secure your key in environment variables
      },
    
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 60,
          topP: 0.95,
          maxOutputTokens: 400,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error("Failed to get response from Gemini API")
    }

    const data = await response.json()

    // Extract the response text from the Gemini API response
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a summary at this time."

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error in AI summary API:", error)
    return NextResponse.json({ error: "Failed to get summary from AI" }, { status: 500 })
  }
}