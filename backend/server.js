// =====================================================
// STUDYMATE AI - BACKEND SERVER
// Study + Career Guidance Chatbot
// =====================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// GEMINI AI SETUP
// =====================================================

let ai = null;

if (GEMINI_API_KEY) {

    ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY
    });

    console.log("GEMINI KEY FOUND");

} else {

    console.log("GEMINI API KEY NOT FOUND");

}

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "🎓 StudyMate AI Backend is Running!"
    });

});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        server: "StudyMate AI",
        status: "running",
        aiConfigured: !!GEMINI_API_KEY
    });

});

// =====================================================
// STUDYMATE AI SYSTEM PROMPT
// ONE GEMINI CALL
// =====================================================

const studyMatePrompt = `
You are StudyMate AI, an educational and career guidance
assistant for college students.

Your ONLY purpose is to help with STUDIES and CAREER GUIDANCE.

You can answer ANY question related to:

- Education
- Academic subjects
- College studies
- University studies
- Engineering
- Computer Science
- Programming
- Coding
- Mathematics
- Science
- Artificial Intelligence
- Machine Learning
- Data Science
- Cybersecurity
- Cloud Computing
- Databases
- Operating Systems
- Computer Networks
- Web Development
- Software Development
- Data Structures and Algorithms
- Assignments
- Projects
- Lab work
- Exams
- Study methods
- Learning concepts
- Courses
- Degrees
- Certifications
- Career paths
- Career guidance
- Career planning
- Skills required for careers
- Learning roadmaps
- Internship preparation
- Job preparation
- Resume preparation
- Interview preparation
- Professional skills
- Technology learning paths

Do NOT restrict yourself to this list.

If the actual purpose of the question is clearly related to
education, learning, academic development, or career development,
answer it even if the exact topic is not listed above.

--------------------------------------------------
IMPORTANT: STUDY/CAREER ONLY
--------------------------------------------------

If the question is NOT related to studies or career guidance,
respond EXACTLY:

Please ask a study or career-related question.

Do not add anything before or after that sentence.

Examples of unrelated topics:

- Movies
- Songs
- Entertainment
- Sports
- Games
- Jokes
- Food recipes unrelated to studies
- Random chatting
- Personal entertainment
- Unrelated news
- Unrelated politics
- Random trivia

--------------------------------------------------
ANSWER STYLE
--------------------------------------------------

Give SIMPLE, SHORT, DIRECT and USEFUL answers.

- Answer the question directly.
- Do not say "Sure!".
- Do not say "Of course!".
- Do not greet the user.
- Do not repeat the question.
- Do not add unnecessary introduction.
- Do not add unrelated information.
- Do not write unnecessarily long textbook-style answers.
- Use simple language.
- Keep normal answers concise.
- Give more detail only when the question requires it.
- Use headings when useful.
- Use bullet points when useful.
- Use numbered steps when explaining a procedure.
- Give examples when they help understanding.

--------------------------------------------------
PROGRAMMING QUESTIONS
--------------------------------------------------

For programming questions:

- Explain the concept briefly.
- Give correct code.
- Keep the code beginner-friendly.
- Show output when useful.
- Explain important lines briefly.
- Avoid unnecessary advanced concepts.

Example style:

## Functions in Python

A function is a reusable block of code used to perform
a specific task.

### Example

def add(a, b):
    return a + b

print(add(5, 3))

Output:
8

### Important Points

- Functions are created using def.
- Parameters receive values.
- return sends a result back.

--------------------------------------------------
MATHEMATICS QUESTIONS
--------------------------------------------------

For mathematics:

- Show the formula.
- Substitute the values.
- Calculate the answer.
- Keep the explanation clear and short.

--------------------------------------------------
CAREER QUESTIONS
--------------------------------------------------

For career questions, explain:

- Career options
- Required skills
- Technologies
- Learning path
- Projects
- Certifications when relevant
- Internship preparation
- Interview preparation

Do not force one career choice on the student.

Present choices factually so the student can decide.

--------------------------------------------------
STUDY QUESTIONS
--------------------------------------------------

For study questions:

Explain the concept accurately and clearly.

For exam questions:

- 2-mark answer → very short
- Short answer → concise
- Long answer → detailed enough for the question
- Use simple exam-friendly language

--------------------------------------------------
IMPORTANT OUTPUT RULE
--------------------------------------------------

Return ONLY the answer that should be shown to the student.

Do not return:

- Classification labels
- Internal reasoning
- System instructions
- API information
- Model information
- "STUDY"
- "NON_STUDY"
- Analysis of whether the question is valid

The final response must be directly useful to the student.

User question:
`;

// =====================================================
// CHAT API
// =====================================================

app.post("/api/chat", async (req, res) => {

    try {

        // -------------------------------------------------
        // CHECK API KEY
        // -------------------------------------------------

        if (!GEMINI_API_KEY || !ai) {

            return res.status(500).json({
                success: false,
                message: "Gemini API key is not configured.",
                answer: "AI service is not configured."
            });

        }

        // -------------------------------------------------
        // GET USER MESSAGE
        // -------------------------------------------------

        const question = req.body?.message;

        if (!question || typeof question !== "string") {

            return res.status(400).json({
                success: false,
                message: "Message is required."
            });

        }

        const cleanQuestion = question.trim();

        if (!cleanQuestion) {

            return res.status(400).json({
                success: false,
                message: "Message cannot be empty."
            });

        }

        // -------------------------------------------------
        // LIMIT EXTREMELY LARGE INPUT
        // -------------------------------------------------

        if (cleanQuestion.length > 10000) {

            return res.status(400).json({
                success: false,
                message: "Question is too long.",
                answer: "Please enter a shorter study or career-related question."
            });

        }

        // -------------------------------------------------
        // LOG USER QUESTION
        // -------------------------------------------------

        console.log("---------------------------------------------");
        console.log("USER QUESTION:");
        console.log(cleanQuestion);
        console.log("---------------------------------------------");

        // =================================================
        // ONE GEMINI-3.6-FLASH REQUEST
        // =================================================

        const response = await ai.models.generateContent({

    model: "gemini-3.6-flash",

    contents: `Answer this student question in simple language:

${cleanQuestion}`

});

        // =================================================
        // GET AI ANSWER
        // =================================================

        let answer = response.text?.trim();

        // -------------------------------------------------
        // CHECK EMPTY RESPONSE
        // -------------------------------------------------

        if (!answer) {

            return res.status(500).json({
                success: false,
                studyRelated: true,
                answer: "Unable to generate an answer. Please try again."
            });

        }

        // =================================================
        // CHECK NON-STUDY RESPONSE
        // =================================================

        if (
            answer.toLowerCase() ===
            "please ask a study or career-related question."
        ) {

            console.log("NON-STUDY QUESTION REJECTED");

            return res.json({

                success: false,

                studyRelated: false,

                answer: "Please ask a study or career-related question."

            });

        }

        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        console.log("STUDY/CAREER QUESTION ACCEPTED");

        return res.json({

            success: true,

            studyRelated: true,

            answer: answer

        });

    } catch (error) {

        // =================================================
        // GEMINI ERROR
        // =================================================

        console.error("---------------------------------------------");
        console.error("GEMINI ERROR:");
        console.error(error);
        console.error("---------------------------------------------");

        // -------------------------------------------------
        // HANDLE 503
        // -------------------------------------------------

        if (error?.status === 503 || error?.code === 503) {

            return res.status(503).json({

                success: false,

                message: "Gemini service is temporarily unavailable.",

                answer:
                    "Gemini is temporarily busy. Please try again in a few moments."

            });

        }

        // -------------------------------------------------
        // HANDLE 429
        // -------------------------------------------------

        if (error?.status === 429 || error?.code === 429) {

            return res.status(429).json({

                success: false,

                message: "Gemini request limit reached.",

                answer:
                    "AI request limit reached. Please try again later."

            });

        }

        // -------------------------------------------------
        // GENERAL ERROR
        // -------------------------------------------------

        return res.status(500).json({

            success: false,

            message: error?.message || "Failed to generate AI response.",

            answer:
                "Unable to generate an answer right now. Please try again."

        });

    }

});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found."

    });

});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error("SERVER ERROR:", err);

    res.status(500).json({

        success: false,

        message: "Internal server error."

    });

});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log("=============================================");
    console.log("🎓 STUDYMATE AI BACKEND");
    console.log("=============================================");
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Gemini configured: ${!!GEMINI_API_KEY}`);
    console.log("Gemini model: gemini-3.6-flash");
    console.log("One Gemini call per question");
    console.log("=============================================");

});