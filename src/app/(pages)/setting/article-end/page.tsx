'use client'

import Title from "@/app/components/Title";
import Container from "../../../components/Container";
import Step from "@/app/components/Step";
import BgImage from "@/app/components/BgImage";
import Button from "@/app/components/Button";
import withAuth from "@/app/components/withAuth";
import { useSearchParams } from "next/navigation";
import ArticleEnd from "@/app/components/ArticleEnd";

const Home = () => {


    return (
        <Container>
            <div className="flex gap-5 sm:gap-20 flex-col sm:flex-row">
                <Title label="記事生成" />
                <Step end />
            </div>
            <div className="flex sm:flex-row flex-col gap-4 mt-4">
                <ArticleEnd />
            </div>
        </Container>
    );
}

export default withAuth(Home);