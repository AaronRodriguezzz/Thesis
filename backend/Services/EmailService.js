const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use SMTP config
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


const send_appointment_details = async (email, uniqueCode, scheduledDateStr, scheduledTimeStr) => {
  try {
    console.log(email, uniqueCode, scheduledDateStr, scheduledTimeStr);
    await transporter.sendMail({
      from: "Toto Tumbs <no-reply@tototumbs.com>",
      to: email,
      subject: "📅 Appointment Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px; color: #333;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
            
            <!-- Header -->
            <h1 style="font-size: 22px; color: #111; margin-bottom: 12px; text-align: center;">
              📅 Appointment Confirmed
            </h1>
            <p style="font-size: 15px; color: #555; text-align: center; margin-bottom: 25px;">
              Thank you for booking with <strong>Toto Tumbs</strong>. Here are your appointment details:
            </p>

            <!-- Appointment Details -->
            <div style="background: #f5f5f5; padding: 18px; border-radius: 10px; margin-bottom: 25px;">
              <p style="margin: 8px 0; font-size: 15px; color: #333;">
                <strong>🆔 Unique Code:</strong> ${uniqueCode}
              </p>
              <p style="margin: 8px 0; font-size: 15px; color: #333;">
                <strong>📅 Date:</strong> ${scheduledDateStr}
              </p>
              <p style="margin: 8px 0; font-size: 15px; color: #333;">
                <strong>⏰ Time:</strong> ${scheduledTimeStr}
              </p>
            </div>

            <!-- Reminder -->
            <p style="font-size: 14px; color: #666; text-align: center;">
              ⏳ Please arrive <strong>10 minutes early</strong>.  
              We look forward to serving you!
            </p>

            <!-- Footer -->
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 25px;">
              &copy; ${new Date().getFullYear()} Toto Tumbs. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.log("Error sending appointment details:", err);
  }
};


const send_announcement = async (email, subject, description, expirationDateStr) => {
  try {
    await transporter.sendMail({
      from: "Toto Tumbs Announcements <no-reply@tototumbs.com>",
      to: email,
      subject: `📢 Announcement: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px; color: #333;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
            
            <!-- Header -->
            <h1 style="font-size: 22px; color: #111; margin-bottom: 12px; text-align: center;">
              📢 ${subject}
            </h1>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />

            <!-- Message -->
            <p style="font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 20px; text-align: center;">
              ${description}
            </p>

            <!-- Expiration Badge -->
            <div style="text-align: center; margin: 25px 0;">
              <span style="display: inline-block; background: #1f2937; color: #fff; padding: 10px 18px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                Valid Until: ${expirationDateStr}
              </span>
            </div>

            <!-- Footer -->
            <p style="font-size: 13px; color: #888; text-align: center; margin-top: 25px;">
              If you have any questions, please contact our support team.  
              <br />
              &copy; ${new Date().getFullYear()} Toto Tumbs
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.log("Error sending announcement:", err);
  }
};



module.exports = {
   send_appointment_details,
   send_announcement
}