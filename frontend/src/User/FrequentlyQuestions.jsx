import React from 'react';
import {faqs} from '../../data/Questions';
import {motion} from 'motion/react';
import { SlideTxt } from '../../components/animations/TextAnimation';

export default function Faq() {  
  return (
    <div id='Faq' className="min-h-screen w-full overflow-x-hidden text-white">
      <SlideTxt
        text="Frequently Asked Questions"
        enable={true}
        speed={5}
        className="text-4xl font-bold my-10 text-center tracking-tighter"
      />

      <div className="w-full max-w-7xl mx-auto space-y-8 px-4 pb-20">
        {faqs.map((faq, index) => (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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