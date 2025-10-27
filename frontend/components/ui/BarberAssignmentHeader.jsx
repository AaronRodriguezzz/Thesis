const PageHeader = ({ today, time }) => (
    <div className="w-full flex justify-between items-center bg-black/40 text-white border border-white/10 p-4 my-2 shadow rounded">
        <div>
        <h1 className="text-[20px] lg:text-[30px] tracking-tighter my-2">
            TOTO TUMBS STUDIO
        </h1>
        <p className="text-[15px]">119 Ballecer South Signal Taguig City</p>
        </div>
        <h2 className="text-[18px] lg:text-[25px] font-extralight">
        {today.toISOString().split("T")[0]} {time}
        </h2>
    </div>
);

export default PageHeader