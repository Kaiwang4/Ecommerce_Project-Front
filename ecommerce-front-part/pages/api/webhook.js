import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK)
import { buffer } from "micro";

const endpointSecret = "whsec_fad75832aaf7b88f07373946bbd9f8d95b48705004214792d27b64b4fb44a97a";

export default async function (req, res) {
    await mongooseConnect()
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            const orderId = data.metadata.orderId
            const paid = data.payment_status === 'paid'
            if (orderId && paid) {
                await Order.findByIdAndUpdate(orderId, {
                    paid: true
                })
            }
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('wtfjzx')
}

export const config = {
    api: {bodyParser: false}
}

// relent-lead-redeem-top
// acct_1NvZ25HN6JqXbl00