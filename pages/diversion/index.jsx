
import { connect } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import pageTypes from "../../assets/json/content/pageTypes.json";

import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";

import Diversion from "../../components/diversion/index.jsx";

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
        },
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const [diversionMeta, setDiversionMeta] = useState(null);

    const redirectToDefault = useCallback(() => {
        let contentId = tools.url.getQuery(location.href, "contentId");
        let contentType = tools.url.getQuery(location.href, "contentType");
        let time = tools.url.getQuery(location.href, "time");

        if(contentId && contentType){
            let pageType = pageTypes[contentType];

            if(pageType == "vod"){
                let url = `/${contentType}/${contentId}`;

                if(time){
                    url += `?time=${time}`;
                }

                router.push(url);
            }
            else if(pageType == "channel"){
                let url = `/channel/watch?contentId=${contentId}`;

                router.push(url);
            }
            else{
                redirectToHome();
            }
        }
        else{
            redirectToHome();
        }
    }, []);

    const redirectToHome = useCallback(() => {
        router.push("/");
    }, []);

    useEffect(() => {
        try{
            let referringPartner = tools.url.getReferringPartner();

            if(referringPartner){
                props.dispatchLoading(true);

                api.fino.diversion.getFetch(referringPartner).then((res) => {
                    props.dispatchLoading(false);

                    if(res.display){
                        setDiversionMeta(res)
                    }
                    else{
                        redirectToDefault();
                    }
                });
            }
            else{
                redirectToDefault();
            }
        }
        catch(ex){
            redirectToHome();
        }
    }, []);

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
                {
                    (() => {
                        if(diversionMeta){
                            return (
                                <title key="title">{diversionMeta.meta.title}</title>
                            );
                        }
                    })()
                }
            </Head>

            {
                (() => {
                    if(diversionMeta){
                        return (
                            <Diversion diversionMeta={diversionMeta} />
                        );
                    }
                })()
            }
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
