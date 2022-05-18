
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
                <title key="title">{seo.service.contactus.getTitle()}</title>
                <meta property="og:url" content={seo.service.contactus.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.service.contactus.getTitle()} key="og:title" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.service.contactus.getAlternate()} key="alternate"></link>
            </Head>

            <h1>service contactus</h1>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);