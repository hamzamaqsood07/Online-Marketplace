// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Ndyz2EerfClcJ7RYvkiBlQ6LoEp5kko8Vu1GTNqMLNsMrJXsjHSkHdNIASH3wmH4zlHid97I62UtcPDBVzCKwpL00UWJx9F3q');
const express = require('express');
const app = express();
const router = express.Router();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5000';

router.post('/create-checkout-session', async (req, res) => {
    const price = req.body.totalPrice;
    const session = await stripe.checkout.sessions.create({
        line_items: [
        {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: `{{pr_1234}}`,
        quantity: 1,
        },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
});

module.exports = router;