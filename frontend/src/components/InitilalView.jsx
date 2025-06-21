import LoadingButton from "./LoadingButton";
import ErrorHandle from "./ErrorHandle";
import Logo from "./Logo";
import Title from "./Title";

const InitialView = ({
  emailText,
  setEmailText,
  onParse,
  isLoading,
  error,
}) => {
  return (
    <div className="bg-[#0a192f] min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8">
      <Logo />
      <Title />
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <textarea
            className="w-full h-72 p-4 mb-10 bg-[#172a45] border border-transparent rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow resize-none"
            placeholder="Enter your Email here..."
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <ErrorHandle error={error} />
        <LoadingButton
          onClick={onParse}
          isLoading={isLoading}
          loadingText="Parsing Email..."
        >
          Parse Email
        </LoadingButton>
      </div>
    </div>
  );
};

export default InitialView;
