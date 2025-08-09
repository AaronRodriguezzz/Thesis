const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use SMTP config
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


const send_appointment_details = async (email, uniqueCode, scheduledDateStr, scheduledTimeStr) => {
    try{
        console.log(email, uniqueCode, scheduledDateStr, scheduledTimeStr)
        await transporter.sendMail({
            from: "Toto Tumbs Appointment Details",
            to: email,
            subject: "Appointment Details",
            html: 
                `
                    <div style="font-family: Arial, sans-serif; color: #fff; background-color: #000; padding: 20px;">
                        <h2 style="color: #fff;">Appointment Confirmation</h2>
                        <p style="color: #ccc;">Thank you for booking with us.</p>
                        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border: 1px solid #fff;">Unique Code</td>
                                <td style="padding: 10px; border: 1px solid #fff;">${uniqueCode}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #fff;">Scheduled Date</td>
                                <td style="padding: 10px; border: 1px solid #fff;">${scheduledDateStr}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #fff;">Scheduled Time</td>
                                <td style="padding: 10px; border: 1px solid #fff;">${scheduledTimeStr}</td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px; color: #999;">Please arrive 10 minutes early. We look forward to seeing you!</p>
                    </div>
                `
            ,
        });
    }catch(err){    
        console.log(err);
    }
    
}

module.exports = {
   send_appointment_details 
}