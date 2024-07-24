'use client'

import Container from "../../../components/Container";
import withAuth from "@/app/components/withAuth";
import ArticleEnd from "@/app/components/ArticleEnd";

const Home = () => {


    return (
        <Container>
           <ArticleEnd/>
        </Container>
    );
}

export default withAuth(Home);