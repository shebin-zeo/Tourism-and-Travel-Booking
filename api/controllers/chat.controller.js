import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const chatHandler = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    // Build the prompt for the travel assistant.
    const prompt = `Welcome to Wandersphere travel assistant. Provide professional advice regarding tours, destinations, itineraries, and pricing:\n\n${message}`;

    // Call the OpenRouter API using the Deepseek model.
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "",
        "X-Title": process.env.SITE_NAME || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      throw new Error(data.error || "Failed to get response from OpenRouter API.");
    }

    // Extract the reply (assuming the response structure is similar to OpenAI's).
    const reply = data.choices?.[0]?.message?.content?.trim() || "No reply received.";
    res.json({ reply });
  } catch (error) {
    console.error("Error in chatHandler:", error);
    res.status(500).json({
      reply: "Sorry, something went wrong with our travel assistant."
    });
  }
};
