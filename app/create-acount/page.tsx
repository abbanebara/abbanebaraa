"use client";
import ComboboxDemo from '@/components/Combobx';
import React, { useState, FormEvent } from 'react';

export default function CreateAccount() {
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    phoneCode: '+213',
    email: '',
    city: '',
    address: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  

  // Available interests
  const interests = [
    'heavy tools', 'Battery', 'marines scrap', 'Mix scrap', 'stainless steel',
    'Cars', 'Foam', 'Fire extinguishers', 'Office Furniture', 'air conditioners',
    'Tanks', 'Cables', 'white foam', 'Batteries', 'Electrical devices',
    'machines', 'cladding', 'rubber', 'steel', 'Glass',
    'Papers and Cartoon', 'Plastic', 'copper', 'timber', 'aluminium'
  ];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    setCurrentStep(2);
  };

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Create account
  const createAccount = () => {
    const userData = {
      ...formData,
      interests: selectedInterests
    };
    
    console.log('Form submitted with data:', userData);
    alert('Account created successfully!');
  };

  // Skip interests step
  const skipInterests = () => {
    console.log('Account created without interests');
    alert('Account created successfully!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create an account</h1>
          <p className="text-gray-600 text-sm">
            Already have an account? <a href="/login" className="text-green-600 no-underline">Log in</a>
          </p>
        </div>

        <div className="my-10">
          <div className="relative flex justify-between items-center mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-green-600 z-0 transition-all duration-300"
              style={{ width: currentStep === 1 ? '0%' : '100%' }}
            ></div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold relative z-10 ${
              currentStep >= 1 ? 'bg-teal-900' : 'bg-gray-500'
            }`}>
              1
            </div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold relative z-10 ${
              currentStep >= 2 ? 'bg-teal-900' : 'bg-gray-500'
            }`}>
              2
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-teal-900' : 'text-gray-500'}`}>
              Enter your email address
            </div>
            <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-teal-900' : 'text-gray-500'}`}>
              Provide your Interests info
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="fullname" className="block mb-2 text-sm text-gray-700">Full name</label>
              <input
                type="text"
                id="fullname"
                placeholder="Enter full name"
                required
                value={formData.fullname}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="phone" className="block mb-2 text-sm text-gray-700">Phone number</label>
              <div className="flex gap-2">
                <select
                  id="phoneCode"
                  value={formData.phoneCode}
                  onChange={handleInputChange}
                  className="w-24 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="+213">+213</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  placeholder="XXX XXX XX XX"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
              />
            </div>

          <ComboboxDemo/>

            <div className="mb-5">
              <label htmlFor="address" className="block mb-2 text-sm text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                placeholder="Enter address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Use 8 or more characters with a mix of letters, numbers & symbols"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-700">Confirm your password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2 mb-5">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">Show password</label>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <input
                type="checkbox"
                id="terms"
                required
                checked={formData.terms}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">Agree to Terms and conditions</label>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white text-base rounded-md hover:bg-green-700 transition duration-300"
            >
              Next
            </button>
          </form>
        ) : (
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                skipInterests();
              }}
              className="block text-right mb-5 text-green-600 text-sm no-underline"
            >
              Skip
            </a>
            
            <div className="flex flex-wrap gap-2 mb-5">
              {interests.map(interest => (
                <div
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`py-2 px-4 rounded-full text-sm cursor-pointer transition-all ${
                    selectedInterests.includes(interest)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 p-3 bg-white border border-gray-300 text-gray-700 text-base rounded-md hover:bg-gray-100 transition duration-300"
              >
                Back
              </button>
              <button
                onClick={createAccount}
                className="flex-1 p-3 bg-green-600 text-white text-base rounded-md hover:bg-green-700 transition duration-300"
              >
                Create account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}