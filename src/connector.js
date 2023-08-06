
 

const create = q => ({"role": "user", "content": q});

const defineSys = json => ({
  role: 'system', 
      content: `
    You are a property assistant. This is the property ${JSON.stringify(json)}
    ` 
})
   
const ask = (question, json, memory = []) => {

  const query = [
    { 
      role: 'system', 
      content: `
    You are a property assistant. This is the property ${JSON.stringify(json)}
    ` },
    ...memory,
    create(question)
  ]
   return query; 
}


/**
 * Generates text using OpenAI's GPT-3 API
 * @async
 * @function
 * @param {string[]} messages - Array of strings representing the conversation history
 * @param {number} temperature - A number between 0 and 1 representing the creativity of the generated text
 * @returns {Promise<Object>} - A Promise that resolves with an object representing the generated text
 */
const generateText = async (messages, max_tokens = 128) => {
  const model = "gpt-3.5-turbo-0301";
  const requestOptions = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      temperature: 0.9,
      model,
      max_tokens
    }),
  };

  /**
   * Sends a POST request to OpenAI's API and returns a Promise that resolves with the response JSON
   * @async
   * @function
   * @param {string} url - The URL to send the request to
   * @param {Object} options - The options to include in the request
   * @returns {Promise<Object>} - A Promise that resolves with the response JSON
   */
  const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions );
  const json = await response.json();
  return json;
};


export {
  ask,
  generateText,
  create,
  defineSys
}
 