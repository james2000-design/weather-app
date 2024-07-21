import Image from "../assets/images/image.png";
const Hero = () => {
  return (
    <div className="w-[100%] mb-10">
      <div className="w-[100%] p-0">
        <img src={Image} alt="" className="w-[100%] p-0 object-contain " />
      </div>
      <div className="w-[100%] flex justify-center ">
        <div className="text-center">
          <h1 className=" text-yellow-400 text-[40px] ">EurOrbit</h1>
          <h2 className="flex justify-center text-[#c7c1c1] text-[25px] font-bold ">
            European and the world Cities Weather Forecast
          </h2>
          <p>
            <code className=" text-[#d9cece] ">
              Powered by
              <a
                href="http://www.7timer.info/doc.php?lang=en"
                target="_blank"
                title="Tap to visit 7Timer!">
                <span className=" bg-[#0085c7] ml-1 rounded-[10px] p-[5px] ">
                  7Timer!
                </span>
              </a>
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
