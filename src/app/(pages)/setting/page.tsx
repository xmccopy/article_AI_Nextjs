'use client'

import Title from "@/app/components/Title";
import Container from "../../components/Container";
import KeyWordShow from "@/app/components/subkwset/keywordis";
import SubKwSetting from "@/app/components/subkwset/subkwset";
import Button from "@/app/components/Button";
import FinalSet from "@/app/components/subkwset/FinalSet"
import TitleContainer from "../../components/subkwset/TitleContainer";
import axios from 'axios';
import SubTitle from "@/app/components/SubTitle";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react";
import withAuth from "@/app/components/withAuth";
import ConfigManager from "@/app/components/ConfigManager";
import { FaStar } from "react-icons/fa6";
import SubKWGenerate from "@/app/components/modals/SubKWGenerate";

interface SubKeyword {
  text: string;
  selected: boolean;
}
interface Subtitle {
  tag: string;
  text: string;
  id: string; // Add an id field
}
interface Config {
  tag: string;
  text: string;
  subtitles: Subtitle[];
  id: string; // Add an id field
}

const Home = () => {

  const searchParams = useSearchParams();
  const [newKeyword, setNewKeyword] = useState('')
  const [keyword, setKeyowrd] = useState('');
  const [showSubKWGenerate, setShowSubKWGenerate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setBtnIsLoading] = useState(false);
  const [isSubKwGenerate, sestIsSubKwGenerate] = useState(false);
  const [isBtnTitleLoading, setBtnTitleIsLoading] = useState(false);
  const [isArticleEndLoading, setIsArticleEndLoading] = useState(false);

  const [titleGenerationLimit, setTitleGenerationLimit] = useState(3);
  const [titleFinalGenerationLimit, setTitleFinalGenerationLimit] = useState(3);

  const [subKeywords, setSubKeywords] = useState<SubKeyword[]>([]);
  const [articleId, setArticleId] = useState('');
  const [generateTitles, setGenerateTitles] = useState<string[]>([]);
  const [finalConfig, setFinalConfig] = useState<Config[]>([]);
  const [finalTitle, setFinalTitle] = useState('');

  const route = useRouter();

  const handleArticleEnd = async () => {
    setIsArticleEndLoading(true);
    if (!articleId) {
      console.error('Article ID is missing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL!}/article/content/${articleId}`,
        { config: finalConfig },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      route.push(`/setting/article-end?articleId=${articleId}`);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to update article content:", error.response?.data || error.message);
      } else {
        console.error("Failed to update article content:", error);
      }
    } finally {
      setIsArticleEndLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeyword(e.target.value);
  }

  const isTitleButtonDisabled = useCallback(() => {
    return titleFinalGenerationLimit <= 0 || finalTitle.trim() === '';
  }, [titleFinalGenerationLimit, finalTitle]);

  const updateSubKeywords = async () => {
    if (titleGenerationLimit <= 0) return;
    setBtnIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!articleId) {
        throw new Error('Article ID not found');
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL!}/article/title/${articleId}`,
        { subkeywords: subKeywords },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setArticleId(response.data?.id);
      setKeyowrd(response.data?.keyword);
      setSubKeywords(response.data?.subKeywords);


      if (response.data.titleslist) {
        setGenerateTitles(response.data.titleslist);
      }

      setTitleGenerationLimit(prev => Math.max(0, prev - 1));

      // You might want to show a success message here
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to update subkeywords:", error.response?.data || error.message);
      } else {
        console.error("Failed to update subkeywords:", error);
      }
      // Handle error (e.g., show error message to user)
    } finally {
      setBtnIsLoading(false);
    }
  };

  const updateTitles = async () => {
    if (titleFinalGenerationLimit <= 0) return;

    setBtnTitleIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (!articleId) {
        throw new Error('Article ID is missing');
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL!}/article/config/${articleId}`,
        { title: finalTitle },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Assuming the API returns generated titles
      if (response.data) {
        setFinalConfig(response.data.configuration);
      }

      setTitleFinalGenerationLimit(prev => Math.max(0, prev - 1));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to update title:", error.response?.data || error.message);
      } else {
        console.error("Failed to update title:", error);
      }
    } finally {
      setBtnTitleIsLoading(false);
    }
  };

  const isAnySubKeywordSelected = () => {
    return Array.isArray(subKeywords) && subKeywords.some(kw => kw.selected);
  }

  const isButtonDisabled = () => {
    return !isAnySubKeywordSelected() || titleGenerationLimit <= 0;
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() !== '') {
      setSubKeywords([...subKeywords, { text: newKeyword.trim(), selected: false }]);
      setNewKeyword('')
    }
  }

  const toggleSubKeyword = (index: number) => {
    setSubKeywords(subKeywords.map((kw, i) =>
      i === index ? { ...kw, selected: !kw.selected } : kw
    ))
  }

  const handleKeywordChange = async (newKeyword: string) => {
    setKeyowrd(newKeyword);
  };

  const fetchSubKeywords = useCallback(async (articleId: string) => {
    if (!articleId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL!}/article/${articleId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );


      console.log("setting-page:", response.data);

      setArticleId(response.data?.id);
      setKeyowrd(response.data?.keyword);
      setSubKeywords(response.data?.subKeywords);

      setGenerateTitles(response.data?.titleslist);
      if (response.data?.title === null) {
        setFinalTitle;
      } else {
        setFinalTitle(response.data?.title)
      }
      setFinalConfig(response.data?.configuration)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch subkeywords:", error.response?.data || error.message);
      } else {
        console.error("Failed to fetch subkeywords:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubKeywordGenerate = async () => {
    sestIsSubKwGenerate(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL!}/article`,
        { keyword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const newArticleId = response.data.id;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL!}/keyword/create-one`,
        { keyword, articleId: newArticleId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      route.push(`/setting?articleId=${newArticleId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to generate subkeywords:", error.response?.data || error.message);
      } else {
        console.error("Failed to generate subkeywords:", error);
      }
    } finally {
      sestIsSubKwGenerate(false);
    }
  };

  const handleSubKwBtn = () => {
    setShowSubKWGenerate(true);
  }

  const handleSubKwConfirm = () => {
    handleSubKeywordGenerate();
    setShowSubKWGenerate(false);
  }

  const handleSubKwCancel = () => {
    setShowSubKWGenerate(false);
  }

  useEffect(() => {
    fetchSubKeywords(articleId);
  }, [articleId, fetchSubKeywords]);


  useEffect(() => {
    const articleIdParam = searchParams.get('articleId');
    if (articleIdParam) setArticleId(articleIdParam);
    const keywordParam = searchParams.get('keyword');
    if (keywordParam) setKeyowrd(keywordParam);
  }, [searchParams]);

  return (
    <>
      <SubKWGenerate
        show={showSubKWGenerate}
        onConfirm={handleSubKwConfirm}
        onCancel={handleSubKwCancel}
      />
      <Container>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 sm:gap-20 flex-col sm:flex-row">
            <Title label="記事生成" />
          </div>
          <SubTitle order="1" label="サブキーワードを設定してください" sublabel="" />
          <div className="flex items-center justify-start gap-6">
            <KeyWordShow label={keyword} onKeywordChange={handleKeywordChange} />
            <Button
              className="custom-class transition-all mt-8"
              onClick={handleSubKwBtn}
              common
              label="サブキーワードを生成する"
              isLoading={isSubKwGenerate}
              icon={FaStar}
              disabled={!keyword.trim()}
            />
          </div>

          <form action="" className="mt-4" onSubmit={addKeyword}>
            <div className="text-[#252936]">
              <p className="text-[14px] mb-2 font-medium">サブキーワード</p>
              <div className="bg-[#F5F8F8] w-full p-6 rounded-lg">
                <div className="flex flex-wrap gap-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="blue" strokeWidth="4" />
                        <path className="opacity-75" fill="blue" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      サブキーワード 生成中...
                    </div>
                  ) : (
                    Array.isArray(subKeywords) && subKeywords.length > 0 ? (
                      subKeywords.map((subKeyword, index) => (
                        <SubKwSetting
                          key={index}
                          label={subKeyword.text}
                          selected={subKeyword.selected}
                          onChange={() => toggleSubKeyword(index)}
                        />
                      ))
                    ) : (
                      <div className="text-gray-500">サブキーワードがありません。</div>
                    )
                  )}
                </div>
                <div className="flex gap-4 mt-4">
                  <input
                    type="text"
                    className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                    value={newKeyword}
                    onChange={handleInputChange}
                  />
                  <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">追加する</button>
                </div>
              </div>
            </div>
            <div className="flex text-gray-900 sm:flex-row items-center sm:justify-start gap-4 flex-col justify-center my-4">
              <div title={
                !isAnySubKeywordSelected()
                  ? "サブキーワードを選択してください"
                  : titleGenerationLimit <= 0
                    ? "タイトル生成の上限に達しました"
                    : ""
              }>
                <Button
                  className="custom-class transition-all"
                  onClick={updateSubKeywords}
                  common
                  label="タイトルを生成する"
                  disabled={isButtonDisabled()}
                  isLoading={isBtnLoading}
                  titleLimit={titleGenerationLimit}
                />
              </div>
              <p className={`text-[14px] text-gray-900 ${titleGenerationLimit <= 1 ? 'text-red-500' : ''}`}>
                {isButtonDisabled()
                  ? titleGenerationLimit <= 0
                    ? "タイトル生成の上限に達しました。"
                    : "サブキーワードを選択してください。"
                  : `※残り${titleGenerationLimit}回生成できます。`
                }
              </p>
            </div>
          </form>

          <SubTitle order="2" label="タイトルを設定してください" sublabel="" />
          <div className="text-[#3C4257]">
            <TitleContainer
              generateTitles={generateTitles}
              setFinalTitle={setFinalTitle}
              finalTitle={finalTitle}
            />
            <div className="flex sm:flex-row items-center sm:justify-start gap-4 flex-col justify-center my-4">
              <Button
                className="custom-class transition-all"
                onClick={updateTitles}
                common
                label="タイトルを生成する"
                disabled={isTitleButtonDisabled()}
                isLoading={isBtnTitleLoading}
                titleLimit={titleFinalGenerationLimit}
              />
              <p className={`text-[14px] ${titleFinalGenerationLimit <= 1 ? 'text-red-500' : ''}`}>
                {isButtonDisabled()
                  ? finalTitle.trim() === ''
                    ? "タイトルを入力してください。"
                    : "タイトル生成の上限に達しました。"
                  : `※残り${titleFinalGenerationLimit}回生成できます。`
                }
              </p>
            </div>
          </div>

          <SubTitle order="3" label="記事構成を作成してください" sublabel="" />
          <div className="flex sm:flex-row flex-col">
            <FinalSet
              keyword={keyword}
              subkeyword={subKeywords}
              title={finalTitle}
            />
            <div className="w-full sm:pl-4 mt-4 sm:mt-0">
              <p className="text-[14px] mb-4">記事構成</p>
              <div className="overflow-x-scroll scrollbar-thin">
                <table className="divide-y-2 divide-gray-200 bg-white text-sm">
                  <thead className=" bg-gray-200 text-left">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2  font-bold text-gray-900 text-xs text-left">導入文</th>
                      <th className="whitespace-nowrap px-4 py-2  h-fit font-bold text-gray-900 text-xs text-left">リード文</th>
                      <th className="whitespace-nowrap px-4 py-2 w-full font-bold text-gray-900 text-xs text-left"></th>
                    </tr>
                  </thead>
                </table>
                <ConfigManager initialConfigs={finalConfig} updateFinalConfig={setFinalConfig} />
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row items-center sm:justify-start gap-4 flex-col justify-center my-4">
            <Button
              className="custom-class"
              onClick={handleArticleEnd}
              common
              label="記事を生成する"
              isLoading={isArticleEndLoading}
            />
          </div>
        </div>
      </Container>
    </>
  );
}

export default withAuth(Home);