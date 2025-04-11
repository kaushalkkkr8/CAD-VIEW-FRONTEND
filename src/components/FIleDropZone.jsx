import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
const FileDropZone = () => {
  const [fileState, setFileState] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ondrop: useCallback((files) => {
      setFileState(files);
    }),
  });

  return (
    <>
      <h1>React drop zone</h1>
      <div className="rootFile" {...getRootProps()}>
        <input type="file" {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
    </>
  );
};
export default FileDropZone;
