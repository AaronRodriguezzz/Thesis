import React from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { motion } from 'framer-motion';
import { useSectionViews } from '../../../hooks/HomeRef';
import { useIsMobile } from '../../../hooks/useIsInMobile';
import { SlideTxt } from '../../../components/animations/TextAnimation';

const ServiceSection = () => {
    const { data, loading, error } = useFetch('get_data/service', null, null, [])
    const { sectionRefs, inViews } = useSectionViews();
    const isMobile = useIsMobile(); 

    return (
        <div ref={sectionRefs.services} className="w-full flex flex-col px-4 md:px-10 gap-y-4 my-10">
            <SlideTxt
                text="SERVICES WE OFFER"
                enable={inViews.services ? true : false}
                speed={5}
                className="text-white text-center my-10 font-extralight tracking-widest text-2xl md:text-5xl" 
                id="Services"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {data &&
                    data.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, y: -20 }}
                            animate={isMobile || inViews.products ? { opacity: 1, x: 0 } : {  opacity: 1, x: 0 }}
                            transition={{ duration: .5, ease: "easeInOut", delay: index * .1 }}
                            className={`relative w-full h-[320px] bg-cover bg-center rounded-lg flex flex-col md:flex-row shadow-sm  justify-between items-start md:items-center p-4 gap-2 hover:scale-102 transition ease-in-out`}
                            style={{ backgroundImage: `url(./${index + 1}.JPG)`}}
                        >
                            <div className='w-full h-[320px] bg-black/50 rounded-lg absolute top-0 left-0 z-0'/>
                            <div className="flex-1 text-white z-10">  
                                <h1 className="font-extrabold text-xl lg:text-3xl">{service?.name}</h1>
                                <p className="tracking-tighter text-base w-[65%]">{service?.description}</p>
                            </div>

                        </motion.div>
                    ))
                }
            </div>
            
        </div>
    )
}

export default ServiceSection