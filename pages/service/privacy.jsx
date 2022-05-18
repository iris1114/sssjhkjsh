
import { connect } from "react-redux";
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
                <title key="title">{seo.service.privacy.getTitle()}</title>
                <meta property="og:url" content={seo.service.privacy.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.service.privacy.getTitle()} key="og:title" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.service.privacy.getAlternate()} key="alternate"></link>
            </Head>

            <h1>service privacy</h1>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);