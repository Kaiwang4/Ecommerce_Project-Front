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
//         console.log('Stripe Webhook Received:', event); // Log the received event
//     } catch (err) {
//         console.error('Error constructing event:', err.message); // Log errors
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const data = event.data.object;
//             const orderId = data.metadata.orderId
//             const paid = data.payment_status === 'paid'
//             console.log('Order ID:', orderId, 'Paid:', paid); // Log order ID and payment status
            
//             if (orderId && paid) {
//                 try {
//                     const updateResult = await Order.findByIdAndUpdate(orderId, {
//                         paid: true
//                     }, { new: true });
//                     console.log('Order Updated:', updateResult); // Log the result of the update operation
//                 } catch (updateError) {
//                     console.error('Error updating order:', updateError.message); // Log errors during update
//                 }
//             } else {
//                 console.warn('Order ID or payment status is missing or incorrect.'); // Log warning if data is missing or incorrect
//             }
//             break;
//         default:
//             console.warn(`Unhandled event type ${event.type}`); // Log unhandled event types
//     }

//     res.status(200).send('Webhook received');
// }

// export const config = {
//     api: {bodyParser: false}
// }
