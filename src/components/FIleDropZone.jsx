import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileDropZone = () => {
  const [fileState, setFileState] = useState([]);

  const onDrop = useCallback((files) => {
    setFileState(files);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
<div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-center">React drop zone</h1>
      <div className="rootFile" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      {fileState.length > 0 && (
        <ul className="mt-3">
          {fileState.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileDropZone;
