// import { mongooseConnect } from "@/lib/mongoose";
// import { Order } from "@/models/Order";
// const stripe = require('stripe')(process.env.STRIPE_SK)
// import { buffer } from "micro";

// const endpointSecret = "whsec_fad75832aaf7b88f07373946bbd9f8d95b48705004214792d27b64b4fb44a97a";

// export default async function (req, res) {
//     await mongooseConnect()
//     const sig = req.headers['stripe-signature'];

//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
//     } catch (err) {
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const data = event.data.object;
//             const orderId = data.metadata.orderId
//             const paid = data.payment_status === 'paid'
//             if (orderId && paid) {
//                 await Order.findByIdAndUpdate(orderId, {
//                     paid: true
//                 })
//             }
//             // Then define and call a function to handle the event payment_intent.succeeded
//             break;
//         // ... handle other event types
//         default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//     res.status(200).send('wtfjzx')
// }

// export const config = {
//     api: {bodyParser: false}
// }

// relent-lead-redeem-top
// acct_1NvZ25HN6JqXbl00

import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import { buffer } from "micro";

const endpointSecret = "whsec_fad75832aaf7b88f07373946bbd9f8d95b48705004214792d27b64b4fb44a97a";

export default async function (req, res) {
    try {
        await mongooseConnect();
    } catch (dbError) {
        console.error('Database connection error:', dbError.message);
        // Send a response to Stripe to retry the webhook later
        return res.status(500).send(`Database connection error: ${dbError.message}`);
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
        console.log('Stripe Webhook Received:', event);
    } catch (err) {
        console.error('Error constructing event:', err.message);
        // Invalid signature or payload - no retry needed
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const data = event.data.object;
                const orderId = data.metadata.orderId;
                const paid = data.payment_status === 'paid';
                console.log('Order ID:', orderId, 'Paid:', paid);

                if (orderId && paid) {
                    try {
                        const updateResult = await Order.findByIdAndUpdate(orderId, {
                            paid: true
                        }, { new: true });
                        console.log('Order Updated:', updateResult);
                    } catch (updateError) {
                        console.error('Error updating order:', updateError.message);
                        // Send a response to Stripe to retry the webhook later
                        return res.status(500).send(`Error updating order: ${updateError.message}`);
                    }
                } else {
                    console.warn('Order ID or payment status is missing or incorrect.');
                    // No retry needed - just log for manual investigation
                    return res.status(200).send('Order ID or payment status is missing or incorrect.');
                }
                break;
            default:
                console.warn(`Unhandled event type ${event.type}`);
                // No retry needed - just log for manual investigation
                return res.status(200).send(`Unhandled event type ${event.type}`);
        }

        // Acknowledge receipt of event
        res.status(200).send('Webhook received');
    } catch (handleError) {
        console.error('Error handling event:', handleError.message);
        // Send a response to Stripe to retry the webhook later
        return res.status(500).send(`Error handling event: ${handleError.message}`);
    }
}

export const config = {
    api: {bodyParser: false}
};

