
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;

const chat_bot = async (req, res) => {
  try {
    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `
        You are a smart, helpful assistant that responds only to inquiries related to **Chreia Electronics**, an electronics repair and service business.
        Do NOT answer unrelated questions, and NEVER provide personal opinions. But answer appropriately when it is not a question, don't apologize, instead
        give the user a appropriate response. 

        📌 **Company Overview**:
        - Business Name: Chreia Electronics
        - Services:
          - Mobile phone repair (Android & iPhone)
          - Laptop and computer repair
          - Appliance servicing (aircon, TV, refrigerators)
          - CCTV installation and configuration
          - Printer repair and refill services
          - Home service and office contracts

        📍 Address: 11 Pres. Roxas St., Tondo, Manila, Philippines  
        📞 Contact: 0935-451-8696  
        📧 Email: cheiraelectronics@gmail.com  
        🔗 Facebook: https://facebook.com/ChreiaElectronics

        🕑 Operating Hours:
        - Monday to Saturday, 9:00 AM – 6:00 PM  
        - Closed on Sundays

        💳 Payments: Cash, GCash, Maya, Bank Transfer  
        📦 Pickup/Delivery available upon request (with fee)

        📄 Policies:
        1. Diagnostics first before pricing.
        2. Warranty covers only the fixed issue.
        3. Diagnostic fees are non-refundable.
        4. Major appliances need appointment.

        ❗ Unrelated questions → Respond:  
        "I'm sorry, but I can only help you with questions related to Chreia Electronics' services and policies."
      `
    });

    const result = await model.generateContentStream(prompt);
    let fullResponse = '';
    for await (const chunk of result.stream) {
      fullResponse += chunk.text();
    }

    return res.status(200).json({ message: fullResponse });
  } catch (err) {
    console.error('ChatBot Error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
    chat_bot
}