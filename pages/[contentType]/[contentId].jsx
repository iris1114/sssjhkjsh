
import { connect } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import _ from "lodash";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";
import watch from "../../assets/js/watch/index.js";
import tools from "../../assets/js/tools/index.js";
import beacon from "../../assets/js/beacon/index.js";
import gtag from "../../assets/js/gtag/index.js";

import Vod from "../../components/vod/watch/index.jsx";

export const getServerSideProps = async (context) => {
    const res = {
        programInfo: null,
        episodes: null,
        seoDictionary: null,
        entry: null,
        relatedProgram: null,
        playList: null,
        focusTree: null
    };
    
    const contentType = context.query.contentType;
    const contentId = context.query.contentId;
    const programInfo = api.ccc.programInfo.getFetch(contentId);
    const seoDictionary = api.fino.seoDictionary.getFetch();
    const data = await Promise.all([programInfo, seoDictionary]);

    if(!data[0].result){
        return {
            notFound: true
        };
    }

    res.programInfo = data[0].result.data;
    res.seoDictionary = data[1];

    const relatedProgram = api.ccc.relatedProgram.getFetch(res.programInfo.content_id);

    if(!res.programInfo.content_id){
        return {
            notFound: true
        };
    }
    else if(res.programInfo.content_type != contentType){
        return {
            redirect: {
                destination: `/${res.programInfo.content_type}/${contentId}`,
                permanent: true,
            }
        };
    }
    else if(res.programInfo.is_series){
        const seriesTree = api.ccc.seriesTree.getFetch(res.programInfo.series_id);
        const focusTree =   api.ccc.focusTree.getFetch(res.programInfo.series_id);
        const apiResult = await Promise.all([relatedProgram, seriesTree, focusTree]);

        res.relatedProgram = apiResult[0].result;
        res.episodes = apiResult[1].result.data;
        res.focusTree = apiResult[2].result.data;

        const entry = watch.vod.getEntry(res.programInfo, res.episodes);

        res.entry = {};

        if(entry.series && entry.season){
            if(watch.vod.entryPoint(res.programInfo)){
                res.entry.series = await api.ccc.programInfo.getFetch(entry.series);
                res.entry.series = res.entry.series.result.data;
                res.entry.season = res.programInfo;
            }
            else{
                const seriesProgramInfo = api.ccc.programInfo.getFetch(entry.series);
                const seasonProgramInfo = api.ccc.programInfo.getFetch(entry.season);
                const entries = await Promise.all([seriesProgramInfo, seasonProgramInfo]);

                res.entry.series = entries[0];
                res.entry.season = entries[1];
                res.entry.series = res.entry.series.result.data;
                res.entry.season = res.entry.season.result.data;
            }
        }
        else if(entry.series){
            if(watch.vod.entryPoint(res.programInfo)){
                res.entry.series = res.programInfo;
            }
            else{
                res.entry.series = await api.ccc.programInfo.getFetch(entry.series);
                res.entry.series = res.entry.series.result.data;
            }
        }
    }
    else if(res.programInfo.rule_id){
        const playList = api.ccc.playList.getFetch(res.programInfo.rule_id);
        const relatedPlayList = await Promise.all([relatedProgram, playList]);

        res.relatedProgram = relatedPlayList[0].result;
        res.playList = relatedPlayList[1].result.data.play_list;

        const contentIds = watch.vod.playListShuffle(contentId, res.playList);
        const bulkSimpleProgram = await api.ccc.bulkSimpleProgram.getFetch(contentIds);

        res.episodes = bulkSimpleProgram.result.data;
    }
    else{
        res.relatedProgram = await relatedProgram;
        res.relatedProgram = res.relatedProgram.result;
    }

    for(let key in res){
        let value = res[key];

        if(typeof value == "undefined"){
            res[key] = null;
        }
    }
    
    return {
        props: {
            programInfo: res.programInfo,
            seoDictionary: res.seoDictionary,
            episodes: res.episodes,
            entry: res.entry,
            relatedProgram: res.relatedProgram,
            focusTree: res.focusTree
        }
    };
};

const mapStateToProps = (state) => {
    return {
        programInfoByDispatch: state.vod.watch.programInfo,
        login: state.login,
        playerProgramInfo: state.player.programInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchProgramInfo: (programInfo) => {
            dispatch({
                type: "vod/watch/programInfo",
                value: programInfo
            });
        },
        dispatchFooterTopShow: (bool) => {
            dispatch({
                type: "footer/top/show",
                value: bool
            });
        },
        dispatchHeaderFocus: (value) => {
            dispatch({
                type: "header/focus",
                value: value
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

    const [episodesInfo, setEpisodesInfo] = useState({
        programInfo: props.programInfo,
        episodes: props.episodes,
        focusTree: props.focusTree
    });

    const [rank, setRank] = useState(null);

    const preLogin = tools.hook.usePrevious(props.login);

    const startByEntryPoint = useCallback((_programInfo) => {
        let isEntryPoint = watch.vod.entryPoint(_programInfo);

        if(isEntryPoint){
            setEpisodesInfo({
                programInfo: _programInfo,
                episodes: props.episodes,
                focusTree: props.focusTree
            });

            if(props.login){
                startByAccountVar(_programInfo);
            }
            else{
                startBySeriesInformation(_programInfo);
            }
        }
        else{
            props.dispatchProgramInfo(_programInfo);
        }
    }, [props.login]);

    const startByAccountVar = useCallback((_programInfo) => {
        setTimeout(() => {
            props.dispatchLoading(true);
        }, 10);

        watch.vod.accountVar.init().then((accountVar) => {
            watch.vod.accountVar.get(accountVar, _programInfo).then((simpleProgram) => {
                if(simpleProgram){
                    api.ccc.programInfo.getFetch(simpleProgram.content_id).then((res) => {
                        props.dispatchLoading(false);

                        let result = res.result;
                        let __programInfo = result.data;

                        __programInfo.accountVar = simpleProgram;

                        props.dispatchProgramInfo(__programInfo);
                    });
                }
                else{
                    startBySeriesInformation(_programInfo);
                }
            });
        });
    }, []);

    const startBySeriesInformation = useCallback((_programInfo) => {
        setTimeout(() => {
            props.dispatchLoading(true);
        }, 10);

        api.ccc.seriesInfo.getFetch(_programInfo.content_id).then((res) => {
            let result = res.result;
            let __programInfo = result.data;
            
            if(__programInfo.content_id != __programInfo.recommend_id){
                api.ccc.programInfo.getFetch(__programInfo.recommend_id).then((res) => {
                    props.dispatchLoading(false);

                    let result = res.result;
                    let ___programInfo = result.data;

                    props.dispatchProgramInfo(___programInfo);
                });
            }
            else{
                props.dispatchLoading(false);
                props.dispatchProgramInfo(_programInfo);
            }
        });
    }, []);

    //入口點
    useEffect(() => {
        if(props.login == null){
            return;
        }

        if(tools.url.getReferringPartner()){
            api.ccc.programInfo.getFetch(props.programInfo.content_id).then((res) => {
                let result = res.result;
                let _programInfo = result.data;

                startByEntryPoint(_programInfo);
            });
        }
        else{
            let _programInfo = _.cloneDeep(props.programInfo);

            startByEntryPoint(_programInfo);
        }
    }, [props.programInfo]);

    //入口點
    useEffect(() => {
        if(preLogin == props.login){
            return;
        }
        
        if(preLogin == null && props.login != null){
            if(tools.url.getReferringPartner()){
                api.ccc.programInfo.getFetch(props.programInfo.content_id).then((res) => {
                    let result = res.result;
                    let _programInfo = result.data;
    
                    startByEntryPoint(_programInfo);
                });
            }
            else{
                let _programInfo = _.cloneDeep(props.programInfo);
    
                startByEntryPoint(_programInfo);
            }
        }
        else if(preLogin == true && props.login == false){
            location.href = "/";
        }
        else if(preLogin == false && props.login == true){
            router.replace(router.pathname, location.href);
        }
    }, [props.login]);
    
    useEffect(() => {
        if(!props.programInfoByDispatch){
            return;
        }

        let unmounted = false;
        let _programInfo = _.cloneDeep(props.programInfoByDispatch);
        let href = location.href;

        href = href.replace(location.pathname, `/${_programInfo.content_type}/${_programInfo.content_id}`);

        let timeByUrl = tools.url.getQuery(href, "time");

        if(timeByUrl){
            _programInfo.time = timeByUrl;
            href = tools.url.removeQuery(href, "time");
        }

        if(props.login){
            if(!_programInfo.accountVar){
                watch.vod.accountVar.init().then((accountVar) => {
                    watch.vod.accountVar.get(accountVar, _programInfo).then((simpleProgram) => {
                        if(unmounted){
                            return;
                        }
                        
                        if(simpleProgram){
                            _programInfo.accountVar = simpleProgram;

                            setEpisodesInfo({
                                programInfo: _programInfo,
                                episodes: props.episodes,
                                focusTree: props.focusTree
                            });
                        }
                        else{
                            setEpisodesInfo({
                                programInfo: _programInfo,
                                episodes: props.episodes,
                                focusTree: props.focusTree
                            });
                        }
                    });
                });
            }
            else{
                setEpisodesInfo({
                    programInfo: _programInfo,
                    episodes: props.episodes,
                    focusTree: props.focusTree
                });
            }
        }
        else{
            setEpisodesInfo({
                programInfo: _programInfo,
                episodes: props.episodes,
                focusTree: props.focusTree
            });
        }
        
        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, seo.vod.watch.getTitle(_programInfo, props.seoDictionary), href);

        beacon();
        gtag.pageview();

        return () => {
            unmounted = true;
        };
    }, [props.programInfoByDispatch]);

    useEffect(() => {
        props.dispatchHeaderFocus({
            main: `/${props.programInfo.content_type}`,
            sub: ""
        });
    }, [props.programInfo]);

    useEffect(() => {
        props.dispatchFooterTopShow(false);

        return () => {
            props.dispatchFooterTopShow(true);
            props.dispatchProgramInfo(null);
        };
    }, []);

    //rank
    useEffect(() => {
        let unmounted = false;

        api.ccc.searchProgram.getFetch({
            contentType: props.programInfo.content_type,
            limit: "10",
            board: "top"
        }).then((res) => {
            if(unmounted){
                return;
            }

            let _rank = res.result.data[0];
            
            setRank(_rank);
        });

        return () => {
            unmounted = true;
        };
    }, [props.programInfo]);

    useEffect(() => {
        if(props.playerProgramInfo){
            props.dispatchProgramInfo(props.playerProgramInfo);
        }
    }, [props.playerProgramInfo]);

    return (
        <>
            <Head>
                <title key="title">{seo.vod.watch.getTitle(episodesInfo.programInfo, props.seoDictionary)}</title>
                <meta name="description" content={seo.vod.watch.getDescription(episodesInfo.programInfo)} key="description" />
                <meta name="keywords" content={seo.vod.watch.getKeywords(episodesInfo.programInfo)} key="keywords" />
                <meta property="og:url" content={seo.vod.watch.getUrl(episodesInfo.programInfo)} key="og:url" />
                <meta property="og:type" content="video.other" key="og:type" />
                <meta property="og:title" content={seo.vod.watch.getTitle(episodesInfo.programInfo, props.seoDictionary)} key="og:title" />
                <meta property="og:description" content={seo.vod.watch.getDescription(episodesInfo.programInfo)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.vod.watch.getAlternate(episodesInfo.programInfo)} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.watch.getBreadcrumbList(episodesInfo.programInfo, props.entry)} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.watch.getVideoObject(episodesInfo.programInfo, props.seoDictionary)} key="VideoObject"></script>

                {
                    (() => {
                        if(props.entry && props.episodes){
                            return (
                                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.watch.getTVSeries(props.entry, props.episodes)} key="TVSeries"></script>
                            );
                        }
                        else{
                            if(episodesInfo.programInfo.content_type != "ent"){
                                return (
                                    <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.watch.getMovie(episodesInfo.programInfo)} key="Movie"></script>
                                );
                            }
                            else{
                                return (
                                    <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.watch.getArticle(episodesInfo.programInfo, props.seoDictionary)} key="Article"></script>
                                );
                            }
                        }
                    })()
                }

                {
                    (() => {
                        if(props.relatedProgram && props.relatedProgram.data.length){
                            return (
                                <script type="application/ld+json" dangerouslySetInnerHTML={seo.vod.watch.getItemList(props.relatedProgram)} key="ItemList"></script>
                            );
                        }
                    })()
                }

                {
                    seo.vod.watch.getThumbnailUrl(episodesInfo.programInfo).map((item, index) => {
                        return (
                            <meta property="og:image" content={item} key={`og:image-${index}`} />
                        );
                    })
                }
            </Head>

            <Vod programInfo={episodesInfo.programInfo} episodesInfo={episodesInfo} relatedProgram={props.relatedProgram} seoDictionary={props.seoDictionary} rank={rank} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);