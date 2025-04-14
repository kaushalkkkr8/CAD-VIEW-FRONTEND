import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import './App.css'
import FileDropZone from './components/FIleDropZone'
import CadView from './components/CadView'

function App() {
  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <>
        <FileDropZone onUploadSuccess={() => setFileUploaded(true)}  />
        <CadView fileUploaded={fileUploaded} clearUploadFlag={() => setFileUploaded(false)}/>
    </>
  )
}

export default App
