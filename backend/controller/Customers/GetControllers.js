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
    const category = req.params.category?.toLowerCase();

    const Model = modelMap[category];
    if (!Model) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let items;

    if (category === 'appointments') {
      items = await Model.find()
        .populate('service')
        .populate('branch');
    } else {
      items = await Model.find();
    }

    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Service or network error' });
  }
};


module.exports = {
  get_service
}
