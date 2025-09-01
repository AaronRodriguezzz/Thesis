const ProductSales = require('../../models/SalesRecord');
const ServicesSales = require('../../models/ServiceSales');
/**
 * @desc Get paginated list of products
 * @route GET /api/products?page=1
 */

const productSales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const totalCount = await ProductSales.countDocuments();
        const sales = await ProductSales.find()
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

const serviceSales = async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const totalCount = await ServicesSales.countDocuments();
        const sales = await ServicesSales.find()
            .populate('service')       
            .populate('barber')
            .populate('branch')
            .populate('recordedBy')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const pageCount = Math.ceil(totalCount / limit);

        return res.status(200).json({ sales, pageCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


module.exports = {
    productSales,
    serviceSales
};
