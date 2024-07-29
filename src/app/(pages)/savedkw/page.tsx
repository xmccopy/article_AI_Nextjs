'use client'

import DownloadBtn from "@/app/components/DownloadBtn";
import Button from "../../components/Button";
import Container from "../../components/Container";
import SavedKw from "../../components/SavedKw";
import Title from "../../components/Title";
import UploadBtn from "../../components/UploadBtn";
import withAuth from "../../components/withAuth";
import { useCallback, useState } from "react";
import axios from "axios";
import AddKeyword from "@/app/components/modals/AddKeyword";

interface Keyword {
  id: string;
  keyword: string;
  volume: string;
  status: string;
  selected: boolean;
}

const Home = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedKeywordsCount, setSelectedKeywordsCount] = useState(0);

  // Determine if there are any selected keywords
  const hasSelectedKeywords = keywords.some(keyword => keyword.selected);

  const handleDownload = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const selectedKeywords = keywords.filter(keyword => keyword.selected);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL!}/download/csv`,
        { keywords: selectedKeywords },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'keywords.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Failed to download CSV:", error);
      // Handle error (e.g., show an error message to the user)
    }
  }, [keywords]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL!}/download/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      console.log('File uploaded successfully:', response.data);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, []);

  const handleKeywordSelection = useCallback((keywordId: string) => {
    setKeywords(prevKeywords => {
      const updatedKeywords = prevKeywords.map(keyword =>
        keyword.id === keywordId ? { ...keyword, selected: !keyword.selected } : keyword
      );
      setSelectedKeywordsCount(updatedKeywords.filter(keyword => keyword.selected).length); // Update selected keywords count
      return updatedKeywords;
    });
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleButtonClick = () => {
    setShowCreditModal(true);
  }

  const handleGenerateCancel = () => {
    setShowCreditModal(false);
  }

  const handleAddKeyword = (newKeyword: string) => {
    setKeywords(prevKeywords => [
      ...prevKeywords,
      { id: Date.now().toString(), keyword: newKeyword, volume: "", status: "", selected: false }
    ]);
    setShowCreditModal(false);
  }

  return (
    <>
      <Container>
        <AddKeyword
          show={showCreditModal}
          onConfirm={handleAddKeyword}
          onCancel={handleGenerateCancel}
        />
        <div className="flex flex-col gap-5 relative top-4">
          <div className="flex lg:flex-row flex-col sm:justify-between sm:items-start gap-2">
            <Title label="保存キーワード" />
            <div className="flex sm:flex-row flex-col sm:justify-center sm:gap-6 gap-2">
              <div className="flex sm:gap-6 sm:justify-center justify-between sm:flex-row flex-col gap-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                    <svg className="flex-shrink-0 size-4 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                  <input
                    className="py-2 ps-10 pe-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-600 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-100"
                    type="text"
                    placeholder="Input keyword."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <DownloadBtn onClick={handleDownload} disabled={!hasSelectedKeywords} />
                <UploadBtn onFileSelect={handleFileUpload} />
              </div>
              <div className="flex justify-end sm:justify-center">
                <Button
                  className="custom-class"
                  disabled={false}
                  isLoading={false}
                  onClick={handleButtonClick}
                  common
                  label="キーワード保存"
                />
              </div>
            </div>
          </div>
          <SavedKw setKeywordsDL={setKeywords} initialKeywords={keywords} searchTerm={searchTerm} handleKeywordSelection={handleKeywordSelection}/>
        </div>
      </Container>
    </>
  );
}

export default withAuth(Home);
