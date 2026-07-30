const crypto = require("crypto");
const razorpay = require("../../config/razorpay");
const Order = require("../../models/Order");
const Payment = require("../../models/Payment");
const sendResponse = require("../../Utils/sendResponse");


// =======================
// Create Razorpay Order
// =======================

const createPayment = async (req, res) => {

    try{

        const {orderId}=req.body;

        const order=await Order.findById(orderId);

        if(!order){

            return sendResponse(res,404,false,"Order not found");
        }

        const options={
            amount:order.totalAmount*100,
            currency:"INR",
            receipt:order._id.toString(),
        };

        const razorpayOrder=await razorpay.orders.create(options);

        await Payment.create({

            user:req.user._id,
            order:order._id,
            amount:order.totalAmount,
            paymentMethod:"ONLINE",
            transactionId:razorpayOrder.id,
            status:"Pending"

        });

        return sendResponse(res,200,true,"Razorpay order created",{

            key:process.env.RAZORPAY_KEY_ID,
            razorpayOrder

        });

    }

    catch(error){

        return sendResponse(res,500,false,error.message);

    }

};


// =======================
// Verify Payment
// =======================

const verifyPayment=async(req,res)=>{

    try{

        const{

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature

        }=req.body;

        const body=razorpay_order_id+"|"+razorpay_payment_id;

        const expectedSignature=crypto
        .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature!==razorpay_signature){

            return sendResponse(res,400,false,"Payment verification failed");

        }

        const payment=await Payment.findOne({

            transactionId:razorpay_order_id

        });

        if(!payment){

            return sendResponse(res,404,false,"Payment not found");

        }

        payment.status="Success";

        await payment.save();

        await Order.findByIdAndUpdate(payment.order,{

            paymentStatus:"Paid",
            orderStatus:"Processing"

        });

        return sendResponse(res,200,true,"Payment successful");

    }

    catch(error){

        return sendResponse(res,500,false,error.message);

    }

};

module.exports={

    createPayment,
    verifyPayment

};