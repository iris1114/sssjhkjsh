
import { connect } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";

import Complete from "../../components/purchase/complete/index.jsx";

import pkg from "../../package.json";

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
                <title key="title">購買完成｜{pkg.siteName}</title>
            </Head>

            <Complete />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);