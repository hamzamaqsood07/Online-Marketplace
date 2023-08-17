// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Ndyz2EerfClcJ7RYvkiBlQ6LoEp5kko8Vu1GTNqMLNsMrJXsjHSkHdNIASH3wmH4zlHid97I62UtcPDBVzCKwpL00UWJx9F3q');
const express = require('express');
const app = express();
const router = express.Router();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000/checkout';

router.post('/create-checkout-session', async (req, res) => {
    const products = req.body.products;
    const itemsObj = products.map((product)=>{
        return {
            quantity: product.quantity,
            price_data: {
                currency: 'pkr',
                unit_amount: product.price*100, //price is received in paisas
                product_data:{
                    name: product.title,
                    description: product.description
                }
            }
        }
    }) 
    const session = await stripe.checkout.sessions.create({
        line_items: itemsObj,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?paymentStatus=success`,
        cancel_url: `${YOUR_DOMAIN}?paymentStatus=canceled`,
    });

    res.send({url: session.url});
});

module.exports = router;