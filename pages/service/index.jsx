
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

import seo from "../../assets/js/seo/index.js";

export const getServerSideProps = async (context) => {
    return {
        props: {}
    };
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchHeaderFocus: (value) => {
            dispatch({
                type: "header/focus",
                value: value
            });
        },
        dispatchFooterTopShow: (bool) => {
            dispatch({
                type: "footer/top/show",
                value: bool
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    useEffect(() => {
        props.dispatchHeaderFocus({
            main: "",
            sub: ""
        });
    }, []);

    useEffect(() => {
        props.dispatchFooterTopShow(false);

        return () => {
            props.dispatchFooterTopShow(true);
        };
    }, []);


    return (
        <>
            <Head>
                <title key="title">{seo.service.home.getTitle()}</title>
                <meta property="og:url" content={seo.service.home.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.service.home.getTitle()} key="og:title" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.service.home.getAlternate()} key="alternate"></link>
            </Head>
            
            <h1>service home</h1>
            <h1>{router.query.anchor}</h1>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);