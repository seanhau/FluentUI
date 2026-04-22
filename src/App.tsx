import { useState } from 'react'
import { FileExplorer } from './components/FileExplorer'
import { DocumentViewer, type Section } from './components/DocumentViewer'
import './App.css'

export interface DocumentData {
  id: string;
  title: string;
  sections: Section[];
}

function App() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);

  if (selectedDocument) {
    return <DocumentViewer documentData={selectedDocument} onClose={() => setSelectedDocument(null)} />;
  }

  return <FileExplorer onDocumentOpen={setSelectedDocument} />;
}

export default App
