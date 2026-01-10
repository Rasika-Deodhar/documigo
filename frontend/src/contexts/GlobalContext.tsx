import { createContext, useState, ReactNode, useContext } from 'react';

// 1. Define the shape of your "Global Store"
interface GlobalState {
  documentText: string;
  setDocumentText: (text: string) => void;
  docSummary: string;
  setDocSummary: (summary: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  // 2. Define multiple states
  const [documentText, setDocumentText] = useState("");
  const [docSummary, setDocSummary] = useState("");

  return (
    <GlobalContext.Provider value={{ documentText, setDocumentText, docSummary, setDocSummary }}>
      {children}
    </GlobalContext.Provider>
  );
}

// 4. Custom hook for easier usage
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};