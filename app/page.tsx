"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Scale, Zap, Briefcase, FileText, PenTool, Building, ArrowRight, X, Search } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const router = useRouter();
  const [contractText, setContractText] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [jurisdictionDialogOpen, setJurisdictionDialogOpen] = useState(false);
  const [jurisdictionSearch, setJurisdictionSearch] = useState("");

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  const toggleJurisdiction = (state: string) => {
    setSelectedJurisdictions(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const selectAllJurisdictions = () => {
    setSelectedJurisdictions(usStates);
  };

  const clearAllJurisdictions = () => {
    setSelectedJurisdictions([]);
  };

  const filteredStates = usStates.filter((s) =>
    s.toLowerCase().includes(jurisdictionSearch.trim().toLowerCase())
  );

  const contractTypes = [
    {
      title: "Employment Offer",
      description: "Check for non-competes, IP ownership, and termination clauses before you sign.",
      type: "employment_offer",
      placeholder: "Paste an employment offer or contract here…",
      icon: Briefcase
    },
    {
      title: "Terms of Service",
      description: "Highlight hidden data privacy concerns and liability limitations in seconds.",
      type: "tos",
      placeholder: "Paste Terms of Service or Privacy Policy…",
      icon: FileText
    },
    {
      title: "Simplify NDAs",
      description: "Extract duration, exclusion criteria, and the definition of confidential info.",
      type: "nda",
      placeholder: "Paste NDA or confidentiality agreement…",
      icon: PenTool
    },
    {
      title: "Lease Agreement",
      description: "Find predatory language in commercial or residential lease agreements.",
      type: "lease",
      placeholder: "Paste commercial lease or agreement…",
      icon: Building
    }
  ];

  const selectedContract = contractTypes.find(c => c.type === selectedType);
  const placeholderText = selectedContract?.placeholder || "Paste contract text or ask a legal question...";

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Send PDF to server for processing
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to extract PDF text');
      }
      
      const data = await response.json();
      return data.text;
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      throw new Error(error.message || 'Failed to extract text from PDF. The file might be corrupted or protected.');
    }
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX file.');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      let text = '';
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        text = await extractTextFromDOCX(file);
      } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
        throw new Error('Please convert .doc files to .docx format. Legacy .doc format is not supported.');
      } else {
        // Default to reading as text
        text = await file.text();
      }
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the file. Please ensure the file contains readable text.');
      }
      
      setContractText(text);
    } catch (error: any) {
      console.error('Error reading file:', error);
      alert(error.message || 'Failed to read file. Please try again or use a different format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          handleFileUpload(file);
        }
        break;
      }
    }
  };

  return (
    <div className="min-h-svh w-full flex flex-col bg-gray-50 relative">
      <AppHeader />

      {/* Floating Lightning Button removed */}

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Title Section */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Analyze Contract
            </h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Upload or paste contract text for high-fidelity legal review, risk assessment,<br />
              and plain-english simplified summaries.
            </p>
          </div>

          {/* Contract Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {contractTypes.map((contract, index) => {
              const IconComponent = contract.icon;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedType(contract.type)}
                  className="text-left w-full"
                >
                  <Card className={`h-full border transition-all cursor-pointer ${
                    selectedType === contract.type 
                      ? 'border-blue-300 bg-blue-50/30 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="size-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {contract.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {contract.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>

          {/* Text Input Area */}
          <div className="mb-8">
            <Card 
              className={`border shadow-sm transition-all ${
                isDragging 
                  ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-400/20' 
                  : 'border-gray-200 bg-white'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-6 relative">
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 rounded-lg z-10 border-2 border-dashed border-blue-400">
                    <div className="text-center">
                      <Upload className="size-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Drop your contract here</p>
                    </div>
                  </div>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg z-10">
                    <div className="text-center">
                      <div className="size-8 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Processing file...</p>
                    </div>
                  </div>
                )}
                <Textarea
                  placeholder={placeholderText}
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  onPaste={handlePaste}
                  className="min-h-[160px] border-0 focus-visible:ring-0 resize-none text-sm placeholder:text-gray-400"
                />
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      className="gap-2 h-9 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isProcessing}
                    >
                      <Upload className="size-4" />
                      Attach Contract
                    </Button>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                    />
                    <Dialog open={jurisdictionDialogOpen} onOpenChange={setJurisdictionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="gap-2 h-9 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                          <Scale className="size-4" />
                          Jurisdictions
                          {selectedJurisdictions.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">  
                              {selectedJurisdictions.length}
                            </span>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[720px] sm:rounded-2xl bg-white p-0 overflow-hidden">
                        {/* Accessible title required by Radix Dialog */}
                        <DialogHeader>
                          <DialogTitle className="sr-only">Select Jurisdictions</DialogTitle>
                        </DialogHeader>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Select Jurisdictions</h3>
                              <p className="text-sm text-gray-500">Choose the applicable laws for your contract analysis.</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="relative w-64">
                              <Input
                                value={jurisdictionSearch}
                                onChange={(e) => setJurisdictionSearch(e.target.value)}
                                placeholder="Search states..."
                                className="pl-9 h-9 border-gray-200 focus-visible:ring-gray-300"
                              />
                              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            </div>
                            <div className="flex items-center text-sm">
                              <button onClick={selectAllJurisdictions} className="text-gray-700 hover:text-gray-900">Select All</button>
                              <span className="mx-3 h-4 w-px bg-gray-300" />
                              <button onClick={clearAllJurisdictions} className="text-gray-700 hover:text-gray-900">Clear All</button>
                            </div>
                          </div>
                          <div className="mt-4 max-h-[46vh] overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(jurisdictionSearch ? filteredStates : usStates).map((state) => (
                                <button
                                  key={state}
                                  onClick={() => toggleJurisdiction(state)}
                                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-gray-50 text-left"
                                >
                                  <span
                                    aria-hidden
                                    className={
                                      `inline-flex items-center justify-center size-4 rounded-full border ${
                                        selectedJurisdictions.includes(state)
                                          ? 'border-yellow-500 bg-yellow-400'
                                          : 'border-gray-300 bg-white'
                                      }`
                                    }
                                  />
                                  <span className="text-sm text-gray-800">{state}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t bg-gray-50 p-4">
                          <div className="text-sm text-gray-600">
                            {selectedJurisdictions.length} jurisdictions selected
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="h-9 px-3 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setJurisdictionDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="h-9 px-4 rounded-md bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                              onClick={() => setJurisdictionDialogOpen(false)}
                            >
                              Confirm Selection
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <div className="size-2 rounded-full bg-green-500" />
                      SECURE
                    </div>
                    <Button 
                      className="rounded-full h-9 px-5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!contractText.trim() || !selectedType}
                      title={!selectedType ? "Please select a contract type first" : !contractText.trim() ? "Please enter contract text" : ""}
                      onClick={() => {
                        if (contractText.trim() && selectedType) {
                          router.push(`/contract-analyzer?type=${selectedType}&text=${encodeURIComponent(contractText)}&auto=1`);
                        }
                      }}
                    >
                      Analyze
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Coco can make mistakes. Always consult with a legal professional. All data is encrypted and private according to our{" "}
                <Link href="#" className="text-blue-600 hover:underline">Security Preferences</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>




    </div>
  );
}
