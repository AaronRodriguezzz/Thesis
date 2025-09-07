const Product = require('../../models/Product');
const Sales = require('../../models/SalesRecord');


const checkOutProducts = async (req, res) => {
    const payload = req.body.newData;

    try{
        console.log(payload);

        if(!payload.product || payload.product.length === 0){
            return res.status(400).json({message: 'Empty Product Checkout'})
        }

        const product = await Promise.all(
            payload.product.map(product => 
                Product.findByIdAndUpdate(
                    product._id,
                    { stock: product?.stock[product.branch.findIndex(b => b === payload.branch)] - product.checkOutQuantity},
                    { new: true }
                ),
            )
        )

        
        if(!product){
            return res.status(400).json({message: 'Product Recording Failed'})
        }

        const sales = new Sales({ 
            products: payload.product.map(p => ({
                product: p._id,
                quantity: p.checkOutQuantity
            })),
            totalPrice: payload.totalPrice,
            soldBy: payload.soldBy,
            branch: payload.branch
        })

        if(!sales){
            return res.status(400).json({message: 'Sales Recording Failed'})
        }

        await sales.save();

        return res.status(200).json({ message: 'Check out Successful', updatedData: product})

    }catch(err){
        console.log(err);
        res.status(500).json({message: err})
    }
}

module.exports = { 
    checkOutProducts
}