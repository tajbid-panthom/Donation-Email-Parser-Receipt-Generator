const Button = ({ buttonFunction, buttonName }) => {
  return (
    <div>
      <button
        onClick={buttonFunction}
        className="bg-[#003366] hover:bg-[#004b8d] text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a192f] focus:ring-pink-500 cursor-pointer"
      >
        {buttonName}
      </button>
    </div>
  );
};

export default Button;
