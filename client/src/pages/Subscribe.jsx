import React from 'react';
import { checkout } from '../../lib/PayhereTest';
import md5 from 'crypto-js/md5';
import { useSelector } from 'react-redux';

const secret_key = import.meta.env.VITE_PAYHERE_SECRET;
const merchant_id = '1228064'
const hash = md5( 
  merchant_id +
  '11223' +
  '100.00' +
  'LKR' +
  md5(secret_key).toString().toUpperCase()
).toString().toUpperCase();



console.log('Generated Hash:', hash);


const customerAttributes = {
  first_name: 'John',
  last_name: 'Doe',
  phone: '+94771234567',
  email: 'john@johndoe.com',
  address: 'No. 50, Highlevel Road',
  city: 'Panadura',
  country: 'Sri Lanka',
};

const checkoutAttributes = {
  sandbox: true,
  merchant_id: merchant_id,
  returnUrl: 'http://localhost:3000/return',
  cancelUrl: 'http://localhost:3000/cancel',
  notifyUrl: 'http://localhost:8080/notify',
  order_id: '11223',
  itemTitle: ['Demo Item'],
  currency: 'LKR',
  amount: 100,
  hash: hash,
};

const Checkout = () => {

  const user = useSelector((state) => state.user.currentUser);

  async function handleCheckout() {
    console.log("func called");

    try {
      const checkoutData = {
        returnUrl: 'http://localhost:5173/dashboard',
        cancelUrl: 'http://localhost:5173/pricing',
        notifyUrl: 'http://localhost:5173/about',
        order_id: '11223',
        items: 'Demo Item',
        currency: 'LKR',
        plan: 1,
      };

      const checkoutObj = {
        ...customerAttributes,
        ...checkoutData
      }
      console.log('checkoutObj:', checkoutObj);
      

      checkout(checkoutObj, user);
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>First name</td>
            <td>{ customerAttributes.first_name }</td>
          </tr>
          <tr>
            <td>Last name</td>
            <td>{ customerAttributes.last_name }</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{ customerAttributes.phone }</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{ customerAttributes.email }</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{ customerAttributes.address }</td>
          </tr>
          <tr>
            <td>City</td>
            <td>{ customerAttributes.city }</td>
          </tr>
          <tr>
            <td>Country</td>
            <td>{ customerAttributes.country }</td>
          </tr>
          <tr>
            <td>Product name</td>
            <td>{ checkoutAttributes.itemTitle }</td>
          </tr>
          <tr>
            <td>Price</td>
            <td>{ checkoutAttributes.amount }</td>
          </tr>
        </tbody>
      </table>
        <button onClick={handleCheckout} style={{ cursor: "pointer" }}>Pay with Payhere</button>
    </div>
  );
};

export default Checkout;
