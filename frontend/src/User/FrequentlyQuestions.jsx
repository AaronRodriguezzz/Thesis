import React from "react";
import Navigation from "../../components/NavBar";
import Footer from "../../components/Footer";
import {faqs} from '../../data/Questions';

export default function Faq() {

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-100 bg-[url('/login.png')] bg-cover bg-center">

      <h1 className="text-4xl font-bold my-10 text-center tracking-tighter">
        Frequently Asked Questions
      </h1>

      <div className="max-w-3xl mx-auto space-y-8 px-4 pb-20">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold">{faq.question}</h2>
            <p className="mt-2 text-base">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}