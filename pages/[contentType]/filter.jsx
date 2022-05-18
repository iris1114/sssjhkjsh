
import { connect } from "react-redux";
import { useEffect, useMemo } from "react";
import Head from "next/head";
import msgpack from "msgpack-lite";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";

import contentTypeMap from "../../assets/json/content/contentTypeMap.json";

import Filter from "../../components/vod/filter/index.jsx";

export const getServerSideProps = async (context) => {
    try{
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
    
        const searchProgram = api.ccc.searchProgram.getFetch({
            contentType: contentType,
            groupId: "root"
        });
    
        const filter = api.fino.filter.getFetch();
        const data = await Promise.all([searchProgram, filter]);
        
        return {
            props: {
                contentType: contentType,
                searchProgram: Array.from(msgpack.encode(data[0].result)),
                filter: data[1]
            }
        };
    }
    catch(ex){
        console.log(context.req.url, ex.stack);

        return {
            notFound: true
        }
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
    const searchProgram = useMemo(() => {
        return msgpack.decode(props.searchProgram);
    }, [props.searchProgram]);

    useEffect(() => {
        let contentType = searchProgram.data[0].content_type;

        props.dispatchHeaderFocus({
            main: `/${contentType}`,
            sub: `/${contentType}/filter`
        });
    }, [searchProgram]);

    return (
        <>
            <Head>
                <title key="title">{seo.vod.filter.getTitle(props.contentType, props.filter)}</title>
                <meta name="description" content={seo.vod.filter.getDescription(props.contentType)} key="description" />
                <meta property="og:url" content={seo.vod.filter.getUrl(props.contentType)} key="og:url" />
                <meta property="og:title" content={seo.vod.filter.getTitle(props.contentType, props.filter)} key="og:title" />
                <meta property="og:description" content={seo.vod.filter.getDescription(props.contentType)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.vod.filter.getAlternate(props.contentType)} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.filter.getBreadcrumbList(props.contentType, props.filter)} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.filter.getArticle(props.contentType, props.filter, searchProgram.data[0])} key="Article"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.filter.getItemList(searchProgram.data[0])} key="ItemList"></script>

                {
                    seo.vod.filter.getImage(searchProgram.data[0]).map((item, index) => {
                        return (
                            <meta property="og:image" content={item} key={`og:image-${index}`} />
                        );
                    })
                }
            </Head>

            <Filter filter={props.filter} searchProgram={searchProgram} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);