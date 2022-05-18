
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Head from "next/head";

import VodHome from "../../components/vod/index.jsx";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";

import contentTypeMap from "../../assets/json/content/contentTypeMap.json";

export const getServerSideProps = async (context) => {
    const contentType = context.query.contentType;

    if(!contentTypeMap[contentType]){
        return {
            notFound: true
        };
    }

    if(contentType == "ent"){
        return {
            redirect: {
                destination: "/ent/searchProgram?categoryId=113",
                permanent: true,
            }
        };
    }

    const res = {
        mainContent: null,
        filter: null,
        banner: null
    };

    const mainContent = api.ccc.mainContent.getFetch(contentType);
    const filter = api.fino.filter.getFetch();
    const banner = api.fino.banner.getFetch();
    const data = await Promise.all([mainContent, filter, banner]);

    res.mainContent = data[0].result.data;
    res.filter = data[1][contentType];
    res.banner = data[2][contentType];

    for(let key in res){
        let value = res[key];

        if(typeof value == "undefined"){
            res[key] = null;
        }
    }

    return {
        props: {
            mainContent: res.mainContent,
            filter: res.filter,
            banner: res.banner
        }
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
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const contentType = useMemo(() => {
        return router.query.contentType;
    }, [router]);

    useEffect(() => {
        props.dispatchHeaderFocus({
            main: `/${contentType}`,
            sub: ""
        });
    }, [contentType]);

    return (
        <>

            <Head>
                <title key="title">{seo.vod.home.getTitle(contentType)}</title>
                <meta name="description" content={seo.vod.home.getDescription(contentType)} key="description" />
                <meta property="og:url" content={seo.vod.home.getUrl(contentType)} key="og:url" />
                <meta property="og:title" content={seo.vod.home.getTitle(contentType)} key="og:title" />
                <meta property="og:description" content={seo.vod.home.getDescription(contentType)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.vod.home.getAlternate(contentType)} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.home.getBreadcrumbList(contentType)} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.home.getArticle(contentType, props.banner)} key="Article"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.home.getItemList(props.mainContent)} key="ItemList"></script>

                {
                    (() => {
                        if(props.banner){
                            return (
                                <>
                                    {
                                        seo.vod.home.getImage(props.banner).map((item, index) => {
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

            <VodHome mainContent={props.mainContent} banner={props.banner} contentType={contentType} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);