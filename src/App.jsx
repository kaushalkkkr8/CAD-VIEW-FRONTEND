import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import './App.css'
import FileDropZone from './components/FIleDropZone'
import CadView from './components/CadView'

function App() {


  return (
    <>
        <FileDropZone />
        <CadView />
    </>
  )
}

export default App
