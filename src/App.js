import "./App.css";

import React from "react";
import Webcam from "react-webcam";

function App() {
  const WebcamStreamCapture = () => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const handleDataAvailable = React.useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );
    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [setCapturing, mediaRecorderRef, handleDataAvailable]);

    const handleStopCaptureClick = React.useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }, [mediaRecorderRef, setCapturing]);

    const handleDownload = React.useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
    }, [recordedChunks]);

    return (
      <>
        <Webcam audio={false} ref={webcamRef} />
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
        <button onClick={handleStartCaptureClick}>Start Capture</button>
        <button onClick={handleDownload}>Download</button>
      </>
    );
  };

  return <div className="App">{WebcamStreamCapture()}</div>;
}

export default App;
