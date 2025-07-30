const Sales = require('../../models/SalesRecord');
 
/**
 * @desc Get paginated list of products
 * @route GET /api/products?page=1
 */

const get_sales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const totalCount = await Sales.countDocuments();
        const sales = await Sales.find()
            .populate('products.product')  
            .populate('soldBy')       
            .populate('branch')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const pageCount = Math.ceil(totalCount / limit);

        return res.status(200).json({ sales, pageCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    get_sales,
};
