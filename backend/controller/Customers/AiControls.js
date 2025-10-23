
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;

const chat_bot = async (req, res) => {
  try {
    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `
        You are a  smart, professional assistant for a **Toto Tumbs Barbershop. 
        And you will make sure that the your response is in html form. Make sure not to generate a response using a table**.  
        You only respond to questions related to the barbershop’s services, bookings, policies, and operations.  
        Do NOT answer unrelated questions. Do NOT provide personal opinions.  
        If the user makes a statement (not a question), give an appropriate acknowledgment related to the barbershop.  

        📌 **Barbershop Overview**:
        - Business: Toto Tumbs
        - Services:
          HIT & WHACK
            -Haircut, Quick Massage, Hot Towel
            ₱200.00 PHP

            -MADE MAN
            Haircut, Quick Massage, Hot Towel, Shampoo, Rinse
            ₱280.00 PHP

            -THE DON
            Haircut, Quick Massage, Hot Towel, Shampoo, Rinse, Complimentary Drinks (Juice, Beer, Whiskey)
            ₱380.00 PHP

            -FORGET ABOUT IT
            Skin Head, Quick Massage, Hot Towel
            ₱150.00 PHP

            -SPRING CLEANING
            Mustache & Beard Removal
            ₱200.00 PHP

            -HAIR WAKE OVER
            Hair treatment tat will remove dead hair cells and dandruff
            ₱350.00 PHP

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

        Steps to Create an Appointment:
        Step 1: Select your branch of your choice. 
        Step 2: Find a date for your appointment
        Step 3: Select a barber if you like a specific barber (optional)
        Step 4: Select a time. ( The time will vary depending on the appointments on the date you selected )
        Step 5: Select the service you want to avail then select additional service if you want to ( optional )

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
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use text-only Gemini model (no image generation needed)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an expert barber suggesting modern haircuts. 
      Only reply with JSON format like this:
      {
        "name": "Haircut Name",
        "description": "Short 1-2 sentence description",
        "publicId": "Public_Id_Here"
      }

      Choices:
        1.Barber’s Cut – Short on the sides, a little longer on top. Clean and simple.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        2.Semi-Kalbo – Very short all around, almost shaved. Easy to maintain.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        3.Skin Fade – Sides shaved very short and blended smoothly into longer top. Sharp look.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        4.Taper Fade – Sides gradually shorter, but not shaved. Neat and professional.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        5.Undercut – Short or shaved sides with longer hair on top you can style.        
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        6.Pompadour – Hair pushed up and back for a full, stylish look.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        7.Quiff – Hair brushed up at the front with some volume. Casual but neat.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        8.Two-Block Cut – Short sides and back with longer, fuller hair on top. Trendy and youthful.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        9.Flat Top – Hair on top cut flat and level. Clean and bold style.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        10.Comb Over – Hair neatly parted to the side. Common for formal looks.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        11.Long Top with Fade – Long hair on top with faded short sides. Modern style.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        12.Crew Cut – Short on the sides and slightly longer on top. Simple and sporty.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        13.Buzz Cut – Very short and even all over. Low-maintenance and cool.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        14.French Crop – Short sides with a bit of fringe in the front. Easy to style.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        15.Caesar Cut – Short cut with straight bangs in front. Works for thinning hair.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        16.Spiky Hair – Hair styled upward into spikes with gel or wax. Fun and energetic.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        17.High and Tight – Very short sides with a little more hair on top. Clean and sharp.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        18.Slick Back – Medium hair combed straight back with gel. Mature look.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        19.Mohawk (Modern) – Longer hair in the middle, short or faded sides. Bold style.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        20.Disconnected Undercut – Big contrast between shaved sides and long top. Trendy and eye-catching.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        21.Curly Top with Fade – Natural curls on top with faded sides. Stylish and easy to maintain.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        22.Textured Crop – Short sides with a bit of length on top styled messily. Casual and modern.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        23.Asian Fade – Short sides with a gradual fade and longer top. Popular in Asian communities.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        24.Slick Side Part – Hair neatly parted to the side and slicked down. Classic and polished.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        25.Messy Waves – Medium length hair styled into loose, natural waves. Relaxed and trendy.
        Public Id: Bald_Mohawk_Fade_Haircut_for_Men_1_ddmheg 

        Base your choice on:
        Face Shape: ${prompt.faceShape}
        Hair Type: ${prompt.hairType}
        Hair Length: ${prompt.hairLength}
        Hair Density: ${prompt.hairDensity}
        Hairline: ${prompt.hairLine}
        Age: ${prompt.age}
        Gender: ${prompt.gender}
      `
    });

    const content = `Suggest the best haircut for my profile. Return ONLY JSON with name, description, and publicId.`;

    const result = await model.generateContent(content);

    // Parse Gemini response (it should be JSON)
    let suggestion = {};
    const text = result.response.candidates[0].content.parts[0].text;
    console.log("Gemini Response Text:", text);
    try {
      suggestion = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("JSON parse error:", e);
      return res.status(500).json({ error: "Failed to parse haircut suggestion" });
    }

    res.status(200).json(suggestion);

  } catch (err) {
    console.error("Error generating haircut suggestion:", err);
    res.status(500).json({ error: "Haircut suggestion failed" });
  }
};



module.exports = {
    chat_bot,
    hairCut_Suggestion
}