import Images from "../assets/images/images.png";
const Footer = () => {
  return (
    <div className="relative flex flex-col  mt-[5rem] mb-12 items-center justify-center">
      <div className=" ">
        <img src={Images} />
      </div>
      <p className="copyright-text">© Copyright 2023 EurOrbit</p>
    </div>
  );
};

export default Footer;
