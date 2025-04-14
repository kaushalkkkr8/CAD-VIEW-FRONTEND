// import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";

// const FileDropZone = () => {
//   const [fileState, setFileState] = useState([]);

//   const onDrop = useCallback((files) => {
//     setFileState(files);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleUpload = async () => {
//     if (fileState.length === 0) return;

//     const formData = new FormData();
//     fileState.forEach((file) => {
//       formData.append("file", file); // or "files[]" if your backend expects an array
//     });

//     try {
//       setUploadStatus("Uploading...");
//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUploadStatus("Upload successful!");
//       console.log("Server response:", response.data);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setUploadStatus("Upload failed");
//     }
//   };

  

//   return (
// <div className="maxWidth" style={{  margin: '0 auto' }}>
//       <h1 className="text-center">React drop zone</h1>
//       <div className="rootFile" {...getRootProps()}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p>Drop the files here ...</p>
//         ) : (
//           <p>Drag 'n' drop some files here, or click to select files</p>
//         )}
//       </div>

//       {fileState.length > 0 && (
//         <ul className="mt-3">
//           {fileState.map((file, index) => (
//             <li key={index}>{file.name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FileDropZone;


// FileDropZone.js
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { baseLink, filesApi } from "../assets/api";

const FileDropZone = ({ onUploadSuccess }) => {
  const [fileState, setFileState] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const onDrop = useCallback((files) => {
    setFileState(files);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (fileState.length === 0) return;

    const formData = new FormData();
    fileState.forEach((file) => {
      formData.append("file", file);
    });

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(`${baseLink}/${filesApi.uploadCadFile}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("Upload successful!");
      setFileState([]);
      onUploadSuccess?.(); 
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("Upload failed");
    }
  };

  return (
    <div className="maxWidth" style={{ margin: "0 auto" }}>
      <h2>Upload CAD Files</h2>
      <div className="rootFile" {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, textAlign: "center" }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      {fileState.length > 0 && (
        <>
          <ul className="mt-3">
            {fileState.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button className="btn btn-primary mt-2" onClick={handleUpload}>
            Upload Files
          </button>
        </>
      )}

      {uploadStatus && <p className="mt-3">{uploadStatus}</p>}
    </div>
  );
};

export default FileDropZone;

