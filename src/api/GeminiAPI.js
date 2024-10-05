// geminiAPI.js
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// const apiKey = import.env.VITE_GOOGLE_API_KEY;

const apiKey = 'AIzaSyC-gFA49vGbHyOAZ2fN29x31wIfpNhKlBo'; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text();
}

export default run;


// src/api/GeminiAPI.js

// import {
//     GoogleGenerativeAI,
// } from "@google/generative-ai";

// // **⚠️ Security Warning**
// // **Never** expose your API key in frontend code. 
// // Move the API key to environment variables and access it securely.
// // For example, using Vite, you can create a `.env` file with `VITE_GOOGLE_API_KEY=your_api_key_here`

// // const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Accessing API key from environment variables
// const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
// });

// const generationConfig = {
//     temperature: 0.7, // Reduced for more deterministic responses
//     topP: 0.9,
//     topK: 50,
//     maxOutputTokens: 2048, // Reduced to prevent excessively long responses
//     responseMimeType: "text/plain",
// };

// /**
//  * Generates a training roadmap using Google's Generative AI API based on the provided prompt.
//  * Implements retry logic to handle transient failures.
//  * @param {string} prompt - The prompt to send to the AI.
//  * @param {number} retries - Number of retry attempts.
//  * @returns {Promise<string>} - The generated roadmap as a string.
//  */
// async function run(prompt, retries = 3) {
//     for (let attempt = 1; attempt <= retries; attempt++) {
//         try {
//             const chatSession = model.startChat({
//                 generationConfig,
//                 history: [],
//             });

//             const result = await chatSession.sendMessage(prompt);
//             const responseText = result.response.text().trim();

//             // Optional: Log each successful attempt
//             console.log(`Attempt ${attempt}: Success`);

//             return responseText;
//         } catch (error) {
//             console.error(`Attempt ${attempt}: Error fetching roadmap from Gemini AI:`, error);

//             if (attempt < retries) {
//                 console.warn(`Retrying... (${attempt + 1}/${retries})`);
//                 await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
//             } else {
//                 throw new Error('Failed to fetch roadmap after multiple attempts.');
//             }
//         }
//     }
// }

// export default run;
