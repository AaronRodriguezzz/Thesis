const Product = require('../../models/Product');
const Service = require('../../models/Services');
const Branches = require('../../models/Branch');
const Appointments = require('../../models/Appointment');

/**
 * Maps category strings to their corresponding Mongoose model.
 */
const modelMap = {
  product: Product,
  service: Service,
  branch: Branches,
  appointments: Appointments
};

/**
 * @desc Fetches all items for a specific category (product, service, branch)
 * @route GET /api/items/:category
 * @access Admin or Private
 */
const get_service = async (req, res) => {
  try {
    const category = req.params.category?.toLowerCase(); // Get category from URL param

    
    // Look up the correct model for the requested category
    const Model = modelMap[category];

    // If category is not valid, return an error
    if (!Model) {
      return res.status(400).json({ message: 'Invalid category' });
    }   

    // Fetch all documents from the selected model
    const items = await Model.find();

    // Return the fetched data
    return res.status(200).json(items);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Service or network error' });
  }
};

module.exports = {
  get_service
}
