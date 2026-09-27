import fetch from "node-fetch";

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Please provide a message."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a professional travel assistant for WanderSphere. Help users with destinations, travel packages, hotels, itineraries, bookings, transportation, and travel advice. Be friendly, concise, and helpful."
            },
            {
              role: "user",
              content: message 
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Handle OpenRouter errors
    if (!response.ok) {
      console.error("OpenRouter Status:", response.status);
      console.error("OpenRouter Error:", data);

      return res.status(response.status).json({
        reply:
          data?.error?.message ||
          "OpenRouter request failed."
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No reply received.";

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("Chat Error:", error);

    return res.status(500).json({
      reply: "Something went wrong while connecting to the AI service."
    });
  }
};

