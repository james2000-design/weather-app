import Images from "../assets/images/images.png";
const Footer = () => {
  return (
    <div className="relative flex flex-col  mt-[10rem] mb-5 items-center justify-center">
      <div className=" ">
        <img src={Images} />
      </div>
      <p className="copyright-text">&#169; Copyright 2024 EurOrbit</p>
    </div>
  );
};

export default Footer;
