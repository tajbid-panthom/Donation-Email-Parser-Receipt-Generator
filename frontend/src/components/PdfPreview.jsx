import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const API_URL = "https://donation-email-parser-receipt-generator.onrender.com";

const PdfPreview = ({ parsedData }) => {
  const [activeTab, setActiveTab] = useState("styled"); // 'styled' or 'pdf'
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");

  // Generate PDF blob URL for iframe preview
  const generatePdfUrl = async () => {
    setIsGeneratingPdf(true);
    setPdfError("");

    try {
      const response = await fetch(`${API_URL}/api/preview-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF preview");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      setPdfError("Failed to generate PDF preview. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle tab switching and trigger PDF generation when needed
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "pdf" && !pdfUrl && !isGeneratingPdf) {
      generatePdfUrl();
    }
  };

  if (!parsedData) return null;

  return (
    <div className="bg-white text-black rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => handleTabChange("styled")}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === "styled"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Styled Preview
        </button>
        <button
          onClick={() => handleTabChange("pdf")}
          disabled={isGeneratingPdf}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === "pdf"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          } ${isGeneratingPdf ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          PDF Preview
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "styled" ? (
          <div className="max-w-2xl mx-auto font-sans">
            {/* Header with Logo */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  <img src="../../public/logo.png" alt="" />
                </span>
              </div>
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Donation Receipt
                </h1>
                <p className="text-sm text-gray-600 mb-1">
                  Receipt Number: {parsedData.receiptNumber}
                </p>
                <p className="text-sm text-gray-600">Date: {parsedData.date}</p>
              </div>
              <div className="w-16"></div> {/* Spacer for balance */}
            </div>

            <hr className="border-gray-300 mb-6" />

            {/* Charity Information */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Charity Information
              </h2>
              <div className="space-y-1">
                <p className="text-sm">Name: {parsedData.charityName}</p>
                <p className="text-sm">Number: {parsedData.charityNumber}</p>
              </div>
            </div>

            {/* Donor Information */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Donor Information
              </h2>
              <div className="space-y-1">
                <p className="text-sm">Name: {parsedData.donorName}</p>
              </div>
            </div>

            {/* Donation Details */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Donation Details
              </h2>
              <hr className="border-gray-300 mb-2" />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Amount</p>
                  </div>
                </div>
                <hr className="border-gray-300" />

                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm">
                      Donation - Transaction ID: {parsedData.transactionId}
                    </p>
                  </div>
                  <div className="w-20 text-right">
                    <p className="text-sm font-semibold">
                      ${parsedData.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-300" />

                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-bold">Total Donated:</p>
                  </div>
                  <div className="w-20 text-right">
                    <p className="text-sm font-bold">
                      ${parsedData.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center mt-8">
              <p className="text-lg italic text-gray-700">
                Thank you for your generous donation!
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isGeneratingPdf ? (
              <div className="flex items-center justify-center h-96">
                <LoadingSpinner
                  size="xl"
                  color="blue"
                  text="Generating PDF preview..."
                />
              </div>
            ) : pdfError ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{pdfError}</p>
                  <button
                    onClick={generatePdfUrl}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="w-full h-96 border border-gray-300 rounded">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Click "PDF Preview" to generate the preview
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
