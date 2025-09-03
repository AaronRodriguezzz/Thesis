const Product = require('../../models/Product');
const Sales = require('../../models/SalesRecord');

/**
 * @desc Get paginated list of products
 * @route GET /api/products?page=1
 */
const get_product = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const totalCount = await Product.countDocuments();
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const pageCount = Math.ceil(totalCount / limit);

        return res.status(200).json({ products, pageCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


/**
 * @desc Get paginated list of products
 * @route GET /api/products?page=1
 */
const get_branchProduct = async (req, res) => {
    const branch = req.params.branch;

    if(!branch){
        return res.status(400).json({message: 'Branch Name Empty'})
    }

    try {

        const products = await Product.find({
            branch: branch,
            stock: { $gt: 0 }
        });    

        return res.status(200).json({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


/**
 * @desc Add a new product
 * @route POST /api/new_product
 */
const new_product = async (req, res) => {
    const {
        name,
        price,
        stock,
        branch,
        description
    } = req.body;

    console.log(req.body);

    try {
        // Get the image path from req.file
        const imagePath = req.file
            ? `${req.file.destination}/${req.file.filename}`.replace(/\\/g, '/')
            : null;

        const requiredFields = ['name', 'price', 'stock', 'branch', 'description'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });

        if (!imagePath) {
            missingFields.push('imagePath');
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
        }

        const productExist = await Product.findOne({
            name: { $regex: `^${name}$`, $options: 'i' }
        });

        if (productExist) {
            return res.status(400).json({ message: 'Product already added' });
        }

        const newProduct = new Product({
            name,
            imagePath,
            stock: stock.split(',').map(s => s),
            price,
            branch: branch.split(',').map(b => b),
            description
        });

        const savedProduct = await newProduct.save();

        if (!savedProduct) {
            return res.status(500).json({ message: 'Failed to save the product.' });
        }

        return res.status(200).json({
            message: 'Product created successfully.',
            added: true,
            product: savedProduct
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }

};

/**
 * @desc Update an existing product
 * @route PUT /api/update_products
 */
const update_product = async (req, res) => {
    const { id } = req.body.newData;

    console.log(req.body);

    if(!id) {
        return res.status(400).json({ message: 'Product Id Missing'})
    }

    try {

        delete req.body.newData.id;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found or update failed.' });
        }

        console.log(updatedProduct);

        return res.status(200).json({ message: 'Product updated successfully.', updatedInfo: updatedProduct });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



/**
 * @desc Delete a product by ID
 * @route DELETE /api/delete_products/:id
 */
const delete_product = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Product ID is required for deletion.' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found or already deleted.' });
        }

        return res.status(200).json({ deleted: true, message: 'Product deleted successfully.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    get_product,
    get_branchProduct,
    new_product,
    update_product,
    delete_product
};
