const Subscribers = require('../../models/Subscriber');
const Announcement = require('../../models/Announcement');
const { send_announcement } = require('../../Services/EmailService');

const sendAnnouncement = async (req, res) => {   
    const { subject, message, expiration } = req.body;

    if (!subject || !message || !expiration) {
        return res.status(400).json({ message: 'Invalid Payload' });
    }

    try {
        await Announcement.updateMany(
            { status: 'Active' },        
            { $set: { status: 'Inactive' } }
        );        

        const newAnnouncement = new Announcement({
            subject,
            message,
            expiration: new Date(expiration), 
        });
        await newAnnouncement.save();

        // Get all subscribers
        const subscribers = await Subscribers.find();

        // Send to all subscribers
        await Promise.all(
            subscribers.map(s => 
                send_announcement(s.email, subject, message, expiration)
            )
        );

        return res.status(200).json({ posted: true, message: 'Announcement Created' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Server Error' });
    }
};

const getActiveAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findOne({ status: 'Active' });

    if (!announcement) {
      return res.status(404).json({ message: 'No active announcement found' });
    }

    const expirationDate = new Date(announcement.expiration);

    if (expirationDate < new Date()) {
      announcement.status = 'Inactive';
      await announcement.save();
      return res.status(200).json({ message: 'Announcement expired and set to inactive' });
    }

    return res.status(200).json(announcement);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Server Error' });
  }
};



module.exports = {
    sendAnnouncement,
    getActiveAnnouncement
}