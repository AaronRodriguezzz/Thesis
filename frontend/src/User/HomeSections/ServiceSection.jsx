import React from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { motion } from 'framer-motion';
import { useSectionViews } from '../../../hooks/HomeRef';
import { SlideTxt } from '../../../components/animations/TextAnimation';

const ServiceSection = () => {
    const { data, loading, error } = useFetch('/get_data/service', null, null, [])
    const { sectionRefs, inViews } = useSectionViews();

    return (
        <div ref={sectionRefs.services} className="w-full bg-white flex flex-col px-4 md:px-10 gap-y-4 my-10">
            <SlideTxt
                text="SERVICES WE OFFER"
                enable={inViews.services ? true : false}
                speed={5}
                className="text-center my-10 font-extralight tracking-widest text-4xl md:text-5xl" 
                id="Services"
            />

            {data &&
                data.map((service, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -100 }}
                    animate={inViews.services ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .5, ease: "easeInOut", delay: index * .1 }}
                    className={`w-full shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                    <div className="flex-1">  
                        <h1 className="font-semibold text-xl">{service?.name}</h1>
                        <p className="tracking-tighter text-base">{service?.description}</p>
                    </div>
                    <p className="text-base font-medium">₱{service?.price}.00 PHP</p>
                    </motion.div>
                ))
            }
        </div>
    )
}

export default ServiceSection