import md5 from 'crypto-js/md5';

const secret_key = import.meta.env.VITE_PAYHERE_SECRET;
const merchant_id = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
console.log("ID", merchant_id);


const Amount = Object.freeze({
    0: 500,
    1: 1000,
    2: 1500
});

const Type = Object.freeze({
    0: 'Weekly',
    1: 'Monthly',
    2: 'Annual'
});

// Export the checkout function
export const checkout = (form_data, user) => {
    console.log("checkout");
    
    if (!merchant_id || !secret_key) {
        onError('Missing merchant ID or secret key');
        return;
    }

    const hash = md5(
        merchant_id +
        form_data.order_id +
        parseFloat(Amount[form_data.plan]).toFixed(2) +
        'LKR' +
        md5(secret_key).toString().toUpperCase()
    ).toString().toUpperCase();
    console.log('form data', form_data);
    

    const requiredParams = {
        merchant_id: merchant_id,
        return_url: form_data.returnUrl,
        cancel_url: form_data.cancelUrl,
        notify_url: form_data.notifyUrl,
        first_name: form_data.first_name,
        last_name: form_data.last_name,
        email: user.email,  // user passed as a parameter
        phone: form_data.phone,
        address: form_data.address,
        city: form_data.city,
        country: 'Sri Lanka',
        order_id: form_data.order_id,
        items: Type[form_data.plan],
        currency: 'LKR',
        amount: Amount[form_data.plan],
        hash: hash,
    };



    console.log('req', requiredParams);
    


    const form = window.document.createElement('form');
form.setAttribute('action', "https://sandbox.payhere.lk/pay/checkout");
form.style.display = 'none';
form.setAttribute('method', 'post');

// Create hidden inputs for fields that should not be visible
const hiddenFields = ['merchant_id', 'return_url', 'cancel_url', 'notify_url', 'country', 'hash'];

for (const name of Object.keys(requiredParams)) {
    const value = requiredParams[name];
    const input = window.document.createElement('input');
    input.setAttribute('name', name);

    if (hiddenFields.includes(name)) {
        input.setAttribute('type', 'hidden');
    } else {
        input.setAttribute('type', 'text');
    }

    input.setAttribute('value', value);
    form.appendChild(input);
}

// Add the submit button
const subscribe = window.document.createElement('input');
subscribe.setAttribute('type', 'submit');
subscribe.setAttribute('value', 'Buy Now');
form.appendChild(subscribe);

console.log(form);


// Append the form to the document body and submit it
window.document.body.appendChild(form);
form.submit();

}

function onError(message) {
    console.error(message);
}


