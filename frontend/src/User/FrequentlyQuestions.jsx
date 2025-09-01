import React from 'react';
import {faqs} from '../../data/Questions';
import {motion} from 'motion/react';
import { SlideTxt } from '../../components/animations/TextAnimation';
import { useUserProtection } from "../../hooks/userProtectionHooks";

export default function Faq() {
  useUserProtection();
  
  return (
    <div id='Faq' className="min-h-screen w-screen overflow-x-hidden bg-gray-100 bg-[url('/login.png')] bg-cover bg-center">


      <SlideTxt
        text="Frequently Asked Questions"
        enable={true}
        speed={5}
        className="text-4xl font-bold my-10 text-center tracking-tighter"
      />

      <div className="max-w-3xl mx-auto space-y-8 px-4 pb-20">
        {faqs.map((faq, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: index * .3 }}
            key={index}
          >
            <h2 className="text-xl font-semibold">{faq.question}</h2>
            <p className="mt-2 text-base">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}