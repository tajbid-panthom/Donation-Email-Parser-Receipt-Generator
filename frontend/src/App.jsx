import { useState } from "react";
import ParsedView from "./components/ParsedView";
import InitialView from "./components/InitilalView";
import LoadingOverlay from "./components/LoadingOverlay";

const API_URL = "http://localhost:8000";

function App() {
  const [emailText, setEmailText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Parse email content and extract donation information
  const handleParseEmail = async () => {
    if (!emailText.trim()) {
      setError("Please paste the email content first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to parse email. Please check the format."
        );
      }

      const data = await response.json();
      console.log(data);
      setParsedData(data);
    } catch (err) {
      setError(err.message);
      console.error("Parsing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate and download PDF receipt
  const handleDownloadPdf = async () => {
    if (!parsedData) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/download-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error("Could not generate PDF.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `Receipt-${parsedData.receiptNumber}.pdf`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      console.error("PDF generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset application state to initial view
  const handleParseAgain = () => {
    setParsedData(null);
    setEmailText("");
    setError("");
  };

  return (
    <div className="app-container">
      {!parsedData ? (
        <InitialView
          emailText={emailText}
          setEmailText={setEmailText}
          onParse={handleParseEmail}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <ParsedView
          emailText={emailText}
          parsedData={parsedData}
          onParseAgain={handleParseAgain}
          onDownloadPdf={handleDownloadPdf}
          onParse={handleParseEmail}
          isLoading={isLoading}
          error={error}
          setEmailText={setEmailText}
        />
      )}

      {/* Loading overlay for major operations */}
      <LoadingOverlay
        isVisible={isLoading}
        text={parsedData ? "Generating PDF..." : "Parsing Email..."}
      />
    </div>
  );
}

export default App;
