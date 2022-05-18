
import { connect } from "react-redux";
import { useEffect, useMemo } from "react";
import Head from "next/head";
import msgpack from "msgpack-lite";

import SearchProgram from "../../components/vod/searchProgram/index.jsx";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";

export const getServerSideProps = async (context) => {
    const contentType = context.query.contentType;

    const queries = {
        categoryId: null,
        releaseYear: null,
        countryId: null,
        genreId: null,
        groupId: null
    };

    if(context.query.categoryId){
        queries.categoryId = context.query.categoryId;
    }

    if(context.query.releaseYear){
        queries.releaseYear = context.query.releaseYear;
    }

    if(context.query.countryId){
        queries.countryId = context.query.countryId;
    }

    if(context.query.genreId){
        queries.genreId = context.query.genreId;
    }

    if(context.query.groupId){
        queries.groupId = context.query.groupId;
    }

    const obj = {
        check: false
    };

    for(const key in queries){
        const value = queries[key];

        if(value && value != "null" && value != "undefined"){
            obj.check = true;
        }
    }

    if(!obj.check){
        return {
            notFound: true
        };
    }

    if(queries.groupId == "root"){
        return {
            redirect: {
                destination: `/${contentType}/filter`,
                permanent: true,
            }
        };
    }

    const req = Object.assign({}, queries);

    req.contentType = contentType;

    const searchProgram = await api.ccc.searchProgram.getFetch(req);

    if(!searchProgram.result){
        return {
            redirect: {
                destination: `/${contentType}`,
                permanent: true,
            }
        };
    }
    
    return {
        props: {
            request: queries,
            searchProgram: Array.from(msgpack.encode(searchProgram.result))
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
    const searchProgram = useMemo(() => {
        return msgpack.decode(props.searchProgram);
    }, [props.searchProgram]);

    const queryString = useMemo(() => {
        let queries = new Array();

        for(let key in props.request){
            if(props.request[key]){
                let query = `${key}=${props.request[key]}`;

                queries.push(query);
            }
        }

        queries = queries.join("&");

        return queries;
    }, [props.request]);

    const contentType = useMemo(() => {
        return searchProgram.data[0].content_type;
    }, [searchProgram]);

    useEffect(() => {
        props.dispatchHeaderFocus({
            main: `/${contentType}`,
            sub: `/${contentType}/searchProgram?${queryString}`
        });
    }, [queryString, contentType]);

    return (
        <>
            <Head>
                <title key="title">{seo.vod.searchProgram.getTitle(searchProgram.data[0])}</title>
                <meta name="description" content={seo.vod.searchProgram.getDescription(searchProgram.data[0], props.request)} key="description" />
                <meta property="og:url" content={seo.vod.searchProgram.getUrl(searchProgram.data[0], props.request)} key="og:url" />
                <meta property="og:title" content={seo.vod.searchProgram.getTitle(searchProgram.data[0])} key="og:title" />
                <meta property="og:description" content={seo.vod.searchProgram.getDescription(searchProgram.data[0], props.request)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.vod.searchProgram.getAlternate(searchProgram.data[0], props.request)} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.searchProgram.getBreadcrumbList(searchProgram.data[0], props.request)} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.searchProgram.getArticle(searchProgram.data[0], props.request)} key="Article"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.searchProgram.getItemList(searchProgram.data[0])} key="ItemList"></script>

                {
                    seo.vod.searchProgram.getImage(searchProgram.data[0]).map((item, index) => {
                        return (
                            <meta property="og:image" content={item} key={`og:image-${index}`} />
                        );
                    })
                }
            </Head>
            
            <SearchProgram searchProgram={searchProgram} request={props.request}/>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);