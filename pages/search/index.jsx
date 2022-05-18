
import { connect } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";

import Search from "../../components/search/index.jsx";

export const getServerSideProps = async (context) => {
    const query = context.query.query;

    if(!query){
        return {
            redirect: {
                destination: "/",
                permanent: true,
            }
        };
    }

    const decodeQuery = decodeURIComponent(query);
    const data = await api.ccc.searchByPattern.getFetch(decodeQuery);
    const result = data.result.data;

    if(result == null){
        return {
            props: {
                query: decodeQuery,
                searchByPattern: null
            }
        };
    }

    return {
        props: {
            query: decodeQuery,
            searchByPattern: result[0].programs
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
    useEffect(() => {
        props.dispatchHeaderFocus({
            main: "",
            sub: ""
        });
    }, []);

    return (
        <>
            <Head>
                <title key="title">{seo.search.getTitle(props.query)}</title>
                <meta property="og:url" content={seo.search.getUrl(props.query)} key="og:url" />
                <meta property="og:title" content={seo.search.getTitle(props.query)} key="og:title" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.search.getAlternate(props.query)} key="alternate"></link>

                {
                    (() => {
                        if(props.searchByPattern){
                            return (
                                <script type="application/ld+json" dangerouslySetInnerHTML={seo.search.getItemList(props.searchByPattern)} key="ItemList"></script>
                            );
                        }
                        else{
                            return (
                                <meta name="robots" content="noindex" />
                            );
                        }
                    })()
                }
            </Head>

            <Search query={props.query} searchByPattern={props.searchByPattern} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);