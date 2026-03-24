import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array required hai' });
    }

    const systemMessage = {
      role: 'system',
      content: `Aap Smart-Retech ka helpful customer assistant hain.
Smart-Retech ek electronics e-commerce store hai jo laptops, headphones, aur accessories sell karta hai.
Aap ke kaam:
- Products recommend karna (laptops, headphones, accessories)
- Order tracking mein help karna
- Return/refund policy explain karna
- Technical specs compare karna
- Price ke baare mein guide karna

Rules:
- Hamesha Hindi-English mix (Hinglish) mein baat karo
- Short aur helpful responses do
- Agar koi cheez nahi pata toh honestly batao
- Free delivery ₹999 se upar orders pe milti hai
- Return policy 7 din ki hai`,
    };

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    return res.status(200).json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error('Groq error:', error);

    if (error.status === 401) {
      return res.status(500).json({ error: 'API key invalid hai' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Free limit khatam, thodi der baad try karo' });
    }

    return res.status(500).json({ error: 'Server error, dobara try karein' });
  }
};