import { useState } from "react";
import LoadingButton from "./LoadingButton";
import ErrorHandle from "./ErrorHandle";
import Logo from "./Logo";
import Title from "./Title";
import PdfPreview from "./PdfPreview";

const ParsedView = ({
  emailText,
  parsedData,
  onParseAgain,
  onDownloadPdf,
  error,
  isLoading,
  setEmailText,
  onParse, // new: call parsing again
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle PDF download with loading state
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPdf();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#0a192f] min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8">
      <Logo />

      <div className="w-full max-w-6xl flex flex-col items-center mt-20 lg:mt-8">
        <Title />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#172a45] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">
              Original Email
            </h3>
            <textarea
              className="w-full h-60 bg-[#0a192f] text-cyan-300 font-mono text-sm p-2 rounded resize-none focus:outline-none border border-gray-700"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              disabled={isLoading}
            />
            <div className="mt-4">
              <LoadingButton
                onClick={onParse}
                isLoading={isLoading}
                loadingText="Parsing..."
              >
                Parse Email
              </LoadingButton>
            </div>
          </div>

          <div className="bg-[#172a45] p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-300 mb-5 border-b border-gray-700 pb-2">
              Preview of parse Data
            </h3>
            <pre className="text-sm whitespace-pre-wrap font-mono text-cyan-300">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        </div>

        <ErrorHandle error={error} />

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <LoadingButton
            onClick={onParseAgain}
            disabled={isLoading || isDownloading}
          >
            Go Home
          </LoadingButton>
          <LoadingButton
            onClick={() => setShowPreview(!showPreview)}
            disabled={isLoading || isDownloading}
          >
            {showPreview ? "Hide PDF Preview" : "Show PDF Preview"}
          </LoadingButton>
          <LoadingButton
            onClick={handleDownload}
            isLoading={isDownloading}
            loadingText="Generating PDF..."
            disabled={isLoading}
          >
            Download PDF Receipt
          </LoadingButton>
        </div>

        {/* PDF Preview Section - Below all boxes */}
        {showPreview && (
          <div className="w-full mt-8">
            <h3 className="text-xl font-bold text-gray-300 mb-4 text-center">
              PDF Receipt Preview
            </h3>
            <PdfPreview parsedData={parsedData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParsedView;
