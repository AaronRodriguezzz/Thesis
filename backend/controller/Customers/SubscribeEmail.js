// controllers/subscribeController.js
const Subscriber = require('../../models/Subscriber');

const subscribeUser = async (req, res) => {
  console.log(req.body);    
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: 'Email is already subscribed' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return res.status(200).json({ message: 'Subscription successful' });
  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  subscribeUser
}