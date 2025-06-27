export const loadRazorpayScript = (src) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        resolve(true);
    };
    script.onerror = () => {
        resolve(false);
    };
    document.body.appendChild(script);
});

export const displayRazorpay = async (
    responseFunction, bookingRes, handleFailure, goBack, mobileNumber, userId, agency, passengerType,
) => {
    const res = await loadRazorpayScript(
        'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
    }

    const order = bookingRes ? .responseData ? .Order || bookingRes ? .responseData ? .order ||
        bookingRes || {};

    const options = {
        key: order ? .providerConfig ? .key || order ? .merchantKey,
        amount: order ? .amount ? .toString(),
        currency: order ? .currency || 'INR',
        name: 'Chalo',
        order_id: order ? .orderId,
        handler: responseFunction,
        entity: order ? .entity || 'order',
        receipt: order ? .receiptId || order ? .bookingId,
        created_at: order ? .bookingInfo ? .bookingTime || order ? .timestamp,
        status: order ? .status || 'created',
        amount_paid: order ? .amount_paid || 0,
        amount_due: order ? .amountDue || order ? .amount ? .toString(),
        modal: {
            escape: false,
            ondismiss() {
                goBack();
            },
        },
        prefill: {
            contact: mobileNumber,
        },
        notes: {
            passId: order ? .receiptId || order ? .bookingId,
            agency,
            passengerType,
            userId,
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', (response) => {
        handleFailure(response.error.metadata.order_id, response.error.metadata.payment_id);
    });
    paymentObject.open();
};

/*

https://razorpay.com/docs/payments/payments/test-card-upi-details/
https://dev.to/soumyadey/integrate-razorpay-in-your-react-app-2nib

*/