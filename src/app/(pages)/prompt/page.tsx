'use client'

import Container from "../../components/Container";
import Title from "../../components/Title";
import withAuth from "@/app/components/withAuth";
import PromptSetting from "@/app/components/PromptSetting";

const Home = () => {

    return (
        <Container>
            <div className="flex flex-col gap-5 pt-16">
                <Title label="Prompt" />
            </div>
            <PromptSetting/>
        </Container>
    );
}

export default withAuth(Home);
