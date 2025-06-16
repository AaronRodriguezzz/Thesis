const Product = require('../../models/Product');

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
 * @desc Add a new product
 * @route POST /api/new_product
 */
const new_product = async (req, res) => {
    const {
        name,
        imagePath,
        price,
        stock,
        branch,
    } = req.body;

    try {
        const requiredFields = ['name', 'imagePath', 'price', 'stock', 'branch'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
        }

        const newProduct = new Product({
            name,
            imagePath,
            stock,
            price,
            branch,
        });

        const savedProduct = await newProduct.save();

        if (!savedProduct) {
            return res.status(500).json({ message: 'Failed to save the product.' });
        }

        return res.status(201).json({ message: 'Product created successfully.', product: savedProduct });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err});
    }
};

/**
 * @desc Update an existing product
 * @route PUT /api/update_products
 */
const update_product = async (req, res) => {
    const { id, newData } = req.body;

    if (!id || !newData || typeof d !== 'object') {
        return res.status(400).json({ message: 'Invalid or incomplete update data.' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found or update failed.' });
        }

        return res.status(200).json({ message: 'Product updated successfully.', product: updatedProduct });

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

        return res.status(200).json({ message: 'Product deleted successfully.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    get_product,
    new_product,
    update_product,
    delete_product
};
