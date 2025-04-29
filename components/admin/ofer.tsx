"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [plan, setPlan] = useState("seller");
  const [hasAccount, setHasAccount] = useState(false);

  // Simulate checking if user has an account
  // In a real app, this would be replaced with actual authentication check
  useEffect(() => {
    // Example: Check localStorage, cookies, or make an API call to verify authentication
    const checkUserAccount = () => {
      // This is a placeholder - replace with actual auth check
      const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";
      setHasAccount(userLoggedIn);
    };

    checkUserAccount();
  }, []);

  const togglePlan = (selectedPlan: string) => {
    setPlan(selectedPlan);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-white">
      <div className="text-center mb-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-3 text-gray-900">Plans and Pricing</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Choose the plan that fits your needs. All plans include essential features to get you started, 
          with options to scale as you grow. No hidden fees and the flexibility to change anytime.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8 bg-gray-100 p-1 rounded-full">
        <button
          className={`px-6 py-2 rounded-full text-sm transition-all ${
            plan === "seller" ? "bg-emerald-500 text-white" : "bg-transparent"
          }`}
          onClick={() => togglePlan("seller")}
        >
          SELLER
        </button>
        <button
          className={`px-6 py-2 rounded-full text-sm transition-all ${
            plan === "buyer" ? "bg-emerald-500 text-white" : "bg-transparent"
          }`}
          onClick={() => togglePlan("buyer")}
        >
          Buyer
        </button>
      </div>

      <div className="flex gap-6 justify-center max-w-4xl w-full px-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-64">
          <div className="text-lg font-semibold text-gray-900 mb-1">Starter</div>
          <div className="text-xs text-gray-600 mb-1">Best for small projects</div>
          <div className="text-2xl font-bold text-gray-900 mb-6">Free</div>
          <ul className="mb-6 space-y-3">
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Unlimited personal files
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Email support
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> CSV data export
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Basic analytics dashboard
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> 1,000 API calls per month
            </li>
          </ul>
          
          {!hasAccount ? (
            <Link href="/create-acount">
              <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-md font-medium text-sm transition-all hover:bg-gray-800">
                Try for free
              </button>
            </Link>
          ) : null}
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-emerald-500 w-80 shadow-md shadow-emerald-100">
          <div className="text-lg font-semibold text-gray-900 mb-1">Professional</div>
          <div className="text-xs text-gray-600 mb-1">For freelancers and startups</div>
          <div className="text-2xl font-bold text-gray-900 mb-6">
            {plan === "buyer" ? "$20" : "$15"} <span className="text-sm">/per user</span>
          </div>
          <ul className="mb-6 space-y-3">
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> All starter features
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Up to 5 user accounts
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Team collaboration tools
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Custom dashboard
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Multiple data export formats
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Basic custom integrations
            </li>
          </ul>
          <Link href="/plan">
            <button className="w-full py-3 px-4 bg-emerald-500 text-white rounded-md font-medium text-sm transition-all hover:bg-emerald-600">
              Select plan
            </button>
          </Link>
          <div className="text-xs text-gray-500 text-center mt-2">or continue with sales</div>
        </div>
      </div>
    </div>
  );
}