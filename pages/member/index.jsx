
import { connect } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import pkg from "../../package.json";
import components from "../../assets/json/member/components.json";

import Member from "../../components/member/index.jsx";

export const getServerSideProps = async (context) => {
    let service = context.query.service;
    let component = components[service];

    if(!component){
        return {
            redirect: {
                destination: "/member?service=watchRecord",
                permanent: true,
            }
        };
    }

    return {
        props: {
            service: service
        }
    };
};

const mapStateToProps = (state) => {
    return {
        login: state.login
    };
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
        if(props.login == false){
            router.push("/");
        }
    }, [props.login]);

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
                <title key="title">{`${components[props.service]}｜${pkg.siteName}`}</title>
            </Head>

            {
                (() => {
                    if(props.login){
                        return (
                            <Member components={components} service={props.service} />
                        );
                    }
                })()
            }
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);