// // src/api/OpenAIApi.js

// import { Configuration, OpenAIApi } from 'openai';

// // Initialize OpenAI configuration
// const configuration = new Configuration({
// //   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
// // 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
// apiKey:'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'
// });

// // Create an instance of OpenAIApi
// const openai = new OpenAIApi(configuration);

// /**
//  * Generates a training roadmap using OpenAI's API based on the provided prompt.
//  * @param {string} prompt - The prompt to send to OpenAI's API.
//  * @returns {Promise<string>} - The generated roadmap as a string.
//  */
// const run = async (prompt) => {
//   try {
//     const response = await openai.createCompletion({
//       model: 'text-davinci-003', // You can choose a different model if preferred
//       prompt: prompt,
//       max_tokens: 500, // Adjust based on desired length
//       temperature: 0.7, // Adjust creativity
//       n: 1,
//       stop: null,
//     });

//     const generatedText = response.data.choices[0].text.trim();
//     return generatedText;
//   } catch (error) {
//     console.error('Error fetching roadmap from OpenAI:', error);
//     throw error;
//   }
// };

// export default run;
// src/api/OpenAPI.js

import axios from 'axios';

/**
 * Generates a training roadmap using OpenAI's API based on the provided prompt.
 * @param {string} prompt - The prompt to send to OpenAI's API.
 * @returns {Promise<string>} - The generated roadmap as a string.
 */
const run = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003', // Ensure the model name is correct and available
        prompt: prompt,
        max_tokens: 500, // Adjust based on desired length
        temperature: 0.7, // Adjust creativity
        n: 1,
        stop: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer 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`, 
        // Replace with your actual OpenAI API key
        'Authorization': `Bearer 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`,

        },
      }
    );

    const generatedText = response.data.choices[0].text.trim();
    return generatedText;
  } catch (error) {
    console.error('Error fetching roadmap from OpenAI:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default run;
