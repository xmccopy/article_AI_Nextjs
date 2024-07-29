'use client'

import ApiSetting from "@/app/components/ApiSetting";
import Container from "../../components/Container";
import Title from "../../components/Title";
import withAuth from "@/app/components/withAuth";


const Home = () => {

    return (
        <Container>
            <div className="flex flex-col gap-5 pt-16">
                <Title label="API連携" />
            </div>
            <ApiSetting/>
        </Container>
    );
}

export default withAuth(Home);
