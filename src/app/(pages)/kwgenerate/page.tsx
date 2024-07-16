'use client'

import SubTitle from "@/app/components/SubTitle";
import Container from "../../components/Container";
import KwTable from "../../components/KwTable";
import Title from "../../components/Title";
import CustomTextarea from "@/app/components/CustomTextarea";
import { useState } from "react";
import withAuth from "@/app/components/withAuth";

interface Keyword {
  text: string;
  keywordIdeaMetrics: {
    avgMonthlySearches: string;
  };
  saved: number;
}

const Home = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);

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
