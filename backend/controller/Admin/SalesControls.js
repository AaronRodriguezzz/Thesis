const ProductSales = require('../../models/SalesRecord');
const ServicesSales = require('../../models/ServiceSales');
/**
 * @desc Get paginated list of products
 * @route GET /api/products?page=1
 */

const productSales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const limit = 10;
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
        
        let filtered = sales;

        if (search) {
            filtered = sales.filter(f => {
                const createdAtStr = f.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD

                return (
                    createdAtStr.includes(search) ||
                    f.soldBy?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                    f.branch?.name?.toLowerCase().includes(search.toLowerCase())
                );
            });
        }


        return res.status(200).json({ sales: filtered, pageCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const serviceSales = async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";


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

        let filtered = sales;

        if (search) {
            filtered = sales.filter(f => {
                const createdAtStr = f.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD

                return (
                    createdAtStr.includes(search) ||
                    f.recordedBy?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                    f.branch?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    f.paymentMethod?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    f.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    f.barber?.fullName?.toLowerCase().includes(search.toLowerCase())
                );
            });
        }

        return res.status(200).json({ sales: filtered, pageCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const productSale = async (req,res) => {
    const productId = req.params.productId;

    console.log(req.params.productId);
    try{
        const sales = await ProductSales.find({ "products.product": productId })
            .populate("products.product")
            .populate("branch");

        console.log(sales)

        return res.status(200).json(sales)
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


module.exports = {
    productSales,
    serviceSales,
    productSale
};
