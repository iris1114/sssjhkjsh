
import { connect } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";
import Error from "./_error.jsx";

import api from "../assets/js/api/index.js";
import seo from "../assets/js/seo/index.js";

import Home from "../components/home/index.jsx";

export const getServerSideProps = async (context) => {
    try{
        const res = {
            mainContent: null,
            banner: null,
            homeChannel: null
        };

        const mainContent = api.ccc.mainContent.getFetch("home");
        const banner = api.fino.banner.getFetch();
        const homeChannel = api.fino.homeChannel.getFetch();
        const data = await Promise.all([mainContent, banner, homeChannel]);

        res.mainContent = data[0].result.data;
        res.banner = data[1]["home"];
        res.homeChannel = data[2];

        for(let key in res){
            let value = res[key];
    
            if(typeof value == "undefined"){
                res[key] = null;
            }
        }
        
        return {
            props: {
                mainContent: res.mainContent,
                banner: res.banner,
                homeChannel: res.homeChannel
            }
        };
    }
    catch(ex){
        console.log(context.req.url, ex.stack);

        return {
            props: {
                error: {
                    statusCode: 404,
                    exception: ex.stack
                }
            }
        };
    }
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
        }
    };
};

const App = (props) => {
    if(props.error){
        return <Error statusCode={props.error.statusCode} exception={props.error.exception} />
    }

    useEffect(() => {
        props.dispatchHeaderFocus({
            main: "/",
            sub: ""
        });
    }, []);

    return (
        <>
            <Head>
                <title key="title">{seo.home.getTitle()}</title>
                <meta name="description" content={seo.home.getDescription()} key="description" />
                <meta property="og:url" content={seo.home.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.home.getTitle()} key="og:title" />
                <meta property="og:description" content={seo.home.getDescription()} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.home.getAlternate()} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.home.getWebSite()} key="WebSite"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.home.getItemList(props.mainContent, props.homeChannel)} key="ItemList"></script>

                {
                    (() => {
                        if(props.banner){
                            return (
                                <>
                                    {
                                        seo.home.getImage(props.banner).map((item, index) => {
                                            return (
                                                <meta property="og:image" content={item} key={`og:image-${index}`} />
                                            );
                                        })
                                    }
                                </>
                            );
                        }
                    })()
                }
            </Head>

            <Home mainContent={props.mainContent} banner={props.banner} homeChannel={props.homeChannel} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);