import React, { useState } from 'react';
import { checkout } from '../../lib/PayhereTest';
import md5 from 'crypto-js/md5';
import { useSelector } from 'react-redux';
import { Button, Label, TextInput } from 'flowbite-react';

const secret_key = import.meta.env.VITE_PAYHERE_SECRET;
const merchant_id = '1228064';
const hash = md5(
  merchant_id +
  '11223' +
  '100.00' +
  'LKR' +
  md5(secret_key).toString().toUpperCase()
).toString().toUpperCase();

console.log('Generated Hash:', hash);

const Checkout = () => {
  const user = useSelector((state) => state.user.currentUser);

  // Form state management
  const [formData, setFormData] = useState({
    first_name: 'John',
    last_name: 'Doe',
    phone: '+94771234567',
    email: 'john@johndoe.com',
    address: 'No. 50, Highlevel Road',
    city: 'Panadura',
    country: 'Sri Lanka',
    itemTitle: 'Demo Item',
    amount: 100
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function handleCheckout() {
    console.log('func called');

    try {
      const checkoutData = {
        returnUrl: 'http://localhost:5173/dashboard',
        cancelUrl: 'http://localhost:5173/pricing',
        notifyUrl: 'http://localhost:5173/about',
        order_id: '11223',
        items: formData.itemTitle,
        currency: 'LKR',
        plan: 1,
      };

      const checkoutObj = {
        ...formData,
        ...checkoutData,
      };
      console.log('checkoutObj:', checkoutObj);

      checkout(checkoutObj, user);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleCheckout();
        }}
      >
        <h2 className="text-xl font-semibold mb-6 text-center">Checkout Form</h2>
        <div className="mb-4">
          <Label htmlFor="first_name" value="First Name" />
          <TextInput
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="John"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="last_name" value="Last Name" />
          <TextInput
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Doe"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="phone" value="Phone" />
          <TextInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+94771234567"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="email" value="Email" />
          <TextInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@johndoe.com"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="address" value="Address" />
          <TextInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="No. 50, Highlevel Road"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="city" value="City" />
          <TextInput
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Panadura"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="country" value="Country" />
          <TextInput
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Sri Lanka"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="itemTitle" value="Product Name" />
          <TextInput
            type="text"
            name="itemTitle"
            value={formData.itemTitle}
            onChange={handleChange}
            placeholder="Demo Item"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="amount" value="Price" />
          <TextInput
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="100"
            className="w-full"
          />
        </div>
        <div className="flex justify-between mt-6">
          <Button type="submit" className="bg-mid-blue" pill>
            Pay with Payhere
          </Button>
          <Button type="button" className="bg-mid-blue" pill>
            Subscribe
          </Button>
        </div>
        
      </form>
    </div>
  );
};

export default Checkout;
