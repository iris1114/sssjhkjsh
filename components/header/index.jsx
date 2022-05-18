/*
import { connect } from "react-redux";
import { useRef, useEffect, useMemo } from "react";
import _ from "lodash";
import PropTypes from "prop-types";

import ReferringPartner from "./referringPartner/index.jsx";
import Top from "./top.jsx";
import Center from "./center.jsx";
import Bottom from "./bottom.jsx";

import tools from "../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        focus: state.header.focus,
        headerHeight: state.header.height,
        scroll: state.scroll
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchHeaderHeight: (height) => {
            dispatch({
                type: "header/height",
                value: height
            });
        }
    };
};

const App = (props) => {
    const headerEl = useRef(null);
    const referringPartnerEl = useRef(null);
    const topEl = useRef(null);
    const centerEl = useRef(null);
    const bottomEl = useRef(null);
    const scrollEl = useRef(null);

    const headerSectionStyle = useMemo(() => {
        return {
            height: `${props.headerHeight}px`
        };
    }, [props.headerHeight]);

    const referringPartner = useMemo(() => {
        return tools.url.getReferringPartner();
    }, []);

    const scrollContainerStyle = useMemo(() => {
        let target = scrollEl.current;

        if(!target){
            return {};
        }

        let computedStyle = getComputedStyle(target);
        let top = computedStyle.top;
        let height = computedStyle.height;
        let distance = props.scroll.distance.y;

        top = parseInt(top);
        height = parseInt(height);

        top = top - distance;

        if(top < 0){
            if((top + height) < 0){
                top = height * (-1);
            }
        }
        else{
            top = 0;
        }

        return {
            top: `${top}px`
        };
    }, [props.scroll]);

    const headerContainerStyle = useMemo(() => {
        let target = headerEl.current;

        if(!target || !scrollContainerStyle.top){
            return {};
        }

        let height = props.headerHeight + parseInt(scrollContainerStyle.top);

        return {
            height: `${height}px`
        };
    }, [scrollContainerStyle, props.headerHeight]);

    const submenu = useMemo(() => {
        let main = props.focus.main;
        
        for(let i = 0; i < props.menu.length; i ++){
            let items = props.menu[i];
            
            for(let j = 0; j < items.length; j ++){
                let item = items[j];

                if(main == item.as && item.submenu && item.submenu.length){
                    return item.submenu;
                }
            }
        }

        return null;
    }, [props.focus, props.menu]);

    useEffect(() => {
        let dispatchHeight = () => {
            let height = 0;
                
            if(referringPartnerEl.current){
                let style = getComputedStyle(referringPartnerEl.current);
    
                height += parseInt(style.height);
            }
    
            if(topEl.current){
                let style = getComputedStyle(topEl.current);
                
                height += parseInt(style.height);
            }
    
            if(centerEl.current){
                let style = getComputedStyle(centerEl.current);
    
                height += parseInt(style.height);
            }
    
            if(bottomEl.current){
                let style = getComputedStyle(bottomEl.current);
    
                height += parseInt(style.height);
            }
            
            props.dispatchHeaderHeight(height);
        };
        
        dispatchHeight();

        let MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
        let mutationObserver = new MutationObserver(dispatchHeight);

        let options = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        };

        mutationObserver.observe(headerEl.current, options);

        return () => {
            mutationObserver.disconnect();
        };
    }, []);
    
    return (
        <>
            {
                (() => {
                    return (
                        <header className="header_section" style={headerSectionStyle}>
                            <div className="header_container" style={headerContainerStyle} ref={headerEl}>
                                {
                                    (() => {
                                        if(referringPartner){
                                            return (
                                                <ReferringPartner ref={referringPartnerEl} />
                                            );
                                        }
                                    })()
                                }
                                
                                <Top ref={topEl} />

                                <div className="scroll_container" style={scrollContainerStyle} ref={scrollEl}>
                                    <Center menu={props.menu} ref={centerEl} />

                                    {
                                        (() => {
                                            if(submenu){
                                                return (
                                                    <Bottom ref={bottomEl} submenu={submenu} />
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                        </header>
                    );
                })()
            }

            <style jsx>
                {`
                    .header_section{
                        .header_container{
                            position: fixed;
                            top: 0px;
                            left: 0px;
                            z-index: 100;
                            width: 100%;
                            background-color: #fff;

                            .scroll_container{
                                position: relative;
                                top: 0px;
                                z-index: -1;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    menu: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
*/

import { connect } from "react-redux";
import { useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import _ from "lodash";

import ReferringPartner from "./referringPartner/index.jsx";
import Top from "./top.jsx";
import Center from "./center.jsx";
import Bottom from "./bottom.jsx";

import tools from "../../assets/js/tools/index.js";

const App = connect((state) => {
    return {
        focus: state.header.focus,
        headerHeight: state.header.height,
        scroll: state.scroll
    };
}, (dispatch) => {
    return {
        dispatchHeaderHeight: (height) => {
            dispatch({
                type: "header/height",
                value: height
            });
        }
    };
})((props) => {
    const headerEl = useRef(null);
    const referringPartnerEl = useRef(null);
    const topEl = useRef(null);
    const centerEl = useRef(null);
    const bottomEl = useRef(null);
    const scrollEl = useRef(null);

    const headerSectionStyle = useMemo(() => {
        return {
            height: `${props.headerHeight}px`
        };
    }, [props.headerHeight]);

    const referringPartner = useMemo(() => {
        return tools.url.getReferringPartner();
    }, []);

    const scrollContainerStyle = useMemo(() => {
        let target = scrollEl.current;

        if(!target){
            return {};
        }

        let computedStyle = getComputedStyle(target);
        let top = computedStyle.top;
        let height = computedStyle.height;
        let distance = props.scroll.distance.y;

        top = parseInt(top);
        height = parseInt(height);

        top = top - distance;

        if(top < 0){
            if((top + height) < 0){
                top = height * (-1);
            }
        }
        else{
            top = 0;
        }

        return {
            top: `${top}px`
        };
    }, [props.scroll]);

    const headerContainerStyle = useMemo(() => {
        let target = headerEl.current;

        if(!target || !scrollContainerStyle.top){
            return {};
        }

        let height = props.headerHeight + parseInt(scrollContainerStyle.top);

        return {
            height: `${height}px`
        };
    }, [scrollContainerStyle, props.headerHeight]);

    const submenu = useMemo(() => {
        let main = props.focus.main;
        
        for(let i = 0; i < props.menu.length; i ++){
            let items = props.menu[i];
            
            for(let j = 0; j < items.length; j ++){
                let item = items[j];

                if(main == item.as && item.submenu && item.submenu.length){
                    return item.submenu;
                }
            }
        }

        return null;
    }, [props.focus, props.menu]);

    useEffect(() => {
        let dispatchHeight = () => {
            let height = 0;
                
            if(referringPartnerEl.current){
                let style = getComputedStyle(referringPartnerEl.current);
    
                height += parseInt(style.height);
            }
    
            if(topEl.current){
                let style = getComputedStyle(topEl.current);
                
                height += parseInt(style.height);
            }
    
            if(centerEl.current){
                let style = getComputedStyle(centerEl.current);
    
                height += parseInt(style.height);
            }
    
            if(bottomEl.current){
                let style = getComputedStyle(bottomEl.current);
    
                height += parseInt(style.height);
            }
            
            props.dispatchHeaderHeight(height);
        };
        
        dispatchHeight();

        let MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
        let mutationObserver = new MutationObserver(dispatchHeight);

        let options = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        };

        mutationObserver.observe(headerEl.current, options);

        return () => {
            mutationObserver.disconnect();
        };
    }, []);
    
    return (
        <>
            {
                (() => {
                    return (
                        <header className="header_section" style={headerSectionStyle}>
                            <div className="header_container" style={headerContainerStyle} ref={headerEl}>
                                {
                                    (() => {
                                        if(referringPartner){
                                            return (
                                                <ReferringPartner ref={referringPartnerEl} />
                                            );
                                        }
                                    })()
                                }
                                
                                <Top ref={topEl} />

                                <div className="scroll_container" style={scrollContainerStyle} ref={scrollEl}>
                                    <Center menu={props.menu} ref={centerEl} />

                                    {
                                        (() => {
                                            if(submenu){
                                                return (
                                                    <Bottom ref={bottomEl} submenu={submenu} />
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                        </header>
                    );
                })()
            }

            <style jsx>
                {`
                    .header_section{
                        .header_container{
                            position: fixed;
                            top: 0px;
                            left: 0px;
                            z-index: 100;
                            width: 100%;
                            background-color: #fff;

                            .scroll_container{
                                position: relative;
                                top: 0px;
                                z-index: -1;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
});

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {
            menu: state.menu,
            show: state.header.show
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {};
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            return (
                <>
                    {
                        (() => {
                            if(props.menu && props.show){
                                return (
                                    <App menu={props.menu} />
                                );
                            }
                        })()
                    }
                </>
            );
        }));
    });
}, {
    ssr: false
});
