'use client'

import Container from "../../components/Container";
import Title from "../../components/Title";
import withAuth from "@/app/components/withAuth";
import ArticleSetting from "@/app/components/ArticleSetting";

interface Keyword {
    text: string;
    keywordIdeaMetrics: {
        avgMonthlySearches: string;
    };
    saved: number;
}

const Home = () => {

    return (
        <Container>
            <div className="flex flex-col gap-5">
                <Title label="記事一覧" />
                <ArticleSetting/>
            </div>
        </Container>
    );
}

export default withAuth(Home);
