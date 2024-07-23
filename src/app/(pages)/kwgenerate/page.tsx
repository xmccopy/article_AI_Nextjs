'use client'

import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubTitle from "@/app/components/SubTitle";
import Container from "@/app/components/Container";
import KwTable from "@/app/components/KwTable";
import Title from "@/app/components/Title";
import CustomTextarea from "@/app/components/CustomTextarea";
import withAuth from "@/app/components/withAuth";

interface Keyword {
  text: string;
  volume: string;
  saved: number;
}
const Home: React.FC = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log('----token----')

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('token', token)
    if (token) {
      // Save the token to local storage
      localStorage.setItem('token', token);

      // Redirect to the desired page
      router.push('/kwgenerate'); // Change to your desired page
    } else {
      // Check if token is already in local storage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        // If no token, redirect to login
        router.push('/login');
      }
    }
  }, [searchParams, router]);

  const handleKeywordsGenerated = (newKeywords: Keyword[]) => {
    setKeywords(newKeywords);
  }

  return (
    <Container>
      <div className="flex flex-col gap-5">
        <div>
          <Title label="キーワード生成" />
          <SubTitle order="1" label="キーワードを生成しましょう" sublabel="説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト" />
        </div>
        <CustomTextarea onKeywordsGenerated={handleKeywordsGenerated} />
        <SubTitle order="2" label="キーワードを選んでください" sublabel="説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト説明テキスト" />
        <KwTable keywords={keywords} />
      </div>
    </Container>
  );
}

export default withAuth(Home);
