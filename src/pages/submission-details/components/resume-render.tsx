import { memo, useState, useEffect } from "react";
import { Loader } from "lucide-react";

interface CandidateResumeProps {
  fileUrl?: string;
  className?: string;
  iframeClass?: string;
}

const ResumeRender = ({
  fileUrl,
  className = "flex flex-col w-full custom-scrollbar ",
  iframeClass = "flex-grow w-full h-full custom-scrollbar ",
}: CandidateResumeProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFileType = (url: string): string | null => {
    const matches = url.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i);
    return matches && matches[0] ? matches[0].substring(1).toLowerCase() : null;
  };

  useEffect(() => {
    if (!fileUrl) {
      setError("No resume available.");
      setLoading(false);
    }
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div
        className={`${className} flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-gray-200`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="dark:text-gray-90000 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
            Resume Not Available!
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No resume has been uploaded for this candidate
          </p>
        </div>
      </div>
    );
  }

  const fileType = getFileType(decodeURIComponent(fileUrl));

  // Encode the file URL to be used in the viewer URL
  const encodedFileUrl = encodeURIComponent(fileUrl);

  // Decide which viewer to use based on file type
  const isPDF = fileType === "pdf";
  const isDocOrDocx = fileType === "doc" || fileType === "docx";

  let viewerUrl = "";
  if (isPDF) {
    // For PDFs, we can directly embed them in an iframe
    viewerUrl = `${fileUrl}#toolbar=0`;
  } else if (isDocOrDocx) {
    // Use Microsoft Office Online Viewer
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedFileUrl}`;
  } else {
    setError("Unsupported file type.");
    setLoading(false);
  }

  const handleIframeLoad = (): void => {
    setLoading(false);
  };

  // Note: Due to browser security policies, onError may not fire for cross-origin iframes.
  const handleIframeError = (): void => {
    setLoading(false);
    setError("Failed to load the document.");
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "40rem",
        height: "100%",
        position: "relative",
      }}
    >
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
          style={{ zIndex: 10 }}
        >
          <Loader className="animate-spin duration-1000" />{" "}
          {/* Replace with your spinner component or CSS */}
        </div>
      )}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
          style={{ zIndex: 10 }}
        >
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {!error && (
        <iframe
          src={viewerUrl}
          className={iframeClass}
          style={{
            flexGrow: 1,
            height: "100%",
          }}
          frameBorder="0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default memo(ResumeRender);
