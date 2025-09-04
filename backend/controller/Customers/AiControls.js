
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;

const chat_bot = async (req, res) => {
  try {
    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `
        You are a smart, professional assistant for a **Toto Tumbs Barbershop**.  
        You only respond to questions related to the barbershop’s services, bookings, policies, and operations.  
        Do NOT answer unrelated questions. Do NOT provide personal opinions.  
        If the user makes a statement (not a question), give an appropriate acknowledgment related to the barbershop.  

        📌 **Barbershop Overview**:
        - Business: Toto Tumbs
        - Services:
          - Haircut (Adults & Kids)
          - Beard trim & shave
          - Hair treatment
          - Packages (cut + shave, cut + treatment, etc.)
        - Appointments: Online booking system with confirmation code
        - Walk-ins: Accepted if schedule allows

        📍 Branches in Taguig:

            1.) Name: Toto Tumbs Barbershop
            Address: 19 Ballecer St. South Signal Village, Taguig City
            Contact Number: 09149341234
            
            2.) Name: TOTO TUMBS HAGONOY
            Address: 127 MLQ Ave. Hagonoy , Taguig, Philippines
            Contact Number: 09093341234

            3.) Name: Toto Tumbs Central Bicutan
            Address: Purok 1 Blk 3, Lot 36 A. Bonifacio Ave, Taguig,
            Contact Number: 0934423123

            4.) Name: Toto Tumbs North Signal 
            Address: 8th Street, Cor Balimbing St North Signal Taguig

        📞 Contact: [Insert Contact Number]  
        📧 Email: tototumbs@gmail.com 

        🕑 Operating Hours:
        - Monday to Sunday, 9:00 AM – 9:00 PM

        💳 Payments: Cash, GCash
        📦 No Home service 

        📄 Policies:
        1. Customers should arrive within the time of appointment time.
        2. Within the selected time of the appointment, the barber can take 
           a walk-in customer in case of late arrival. But you will be the next in line 
           after the barber is finished.
        2. Cancellation must be made at least 2 hours before schedule.
        3. Late arrivals may forfeit the slot.

        <b>Steps to Create an Appointment:</b><br/>
        Step 1: Select your branch of your choice. <br/>
        Step 2: Find a date for your appointment <br/>
        Step 3: Select a barber if you like a specific barber (optional) <br/>
        Step 4: Select a time. ( The time will vary depending on the appointments on the date you selected ) <br/>
        Step 5: Select the service you want to avail then select additional service if you want to ( optional ) <br/>

        ❗ Unrelated questions → Respond:  
        "I'm sorry, but I can only help you with questions related to the barbershop’s appointments, services, and policies."
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

const hairCut_Suggestion = async (req, res) => {
  try {
    const prompt = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use multimodal Gemini model for both text + image
    const multiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview",
      generationConfig: {
        responseModalities: ["Text", "Image"],
        candidateCount: 1
      },
      systemInstruction: `You are an expert barber suggesting modern haircuts.
        Base your response on:
        Face Shape: ${prompt.faceShape}
        Hair Type: ${prompt.hairType}
        Hair Length: ${prompt.hairLength}
        Hair Density: ${prompt.hairDensity}
        Hairline: ${prompt.hairLine}
        Age: ${prompt.age}
        Gender: ${prompt.gender}
      `
    });

    const content = `Suggest me the best haircut for my profile. Keep the description short (2–3 sentences), and include an illustrative image.`;

    const result = await multiModel.generateContent(content);

    let suggestionText = "";
    let suggestionImage = null;

    result.response.candidates.forEach((c) => {
      c.content.parts.forEach((part) => {
        if (part.text) suggestionText += part.text;
        if (part.inlineData) {
          suggestionImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      });
    });

    res.status(200).json({
      text: suggestionText,
      image: suggestionImage,
    });

  } catch (err) {
    console.error("Error generating haircut suggestion:", err);
    res.status(500).json({ error: "Haircut suggestion failed" });
  }
};


module.exports = {
    chat_bot,
    hairCut_Suggestion
}