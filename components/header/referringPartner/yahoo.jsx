
import { connect } from "react-redux";
import { useEffect, useRef } from "react";

import meta from "../../../assets/meta/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const Yahoo = (props) => {
    const container = useRef(null);

    useEffect(() => {
        let html = document.querySelector("html");

        html.setAttribute("id", "Stencil");
    }, []);

    useEffect(() => {
        let links = container.current.querySelectorAll("a, form");
        
        for(let i = 0; i < links.length; i ++){
            let link = links[i];

            link.setAttribute("target", "_blank");
        }
    }, []);

    return (
        <>
            <section className="yahoo_container" ref={container} dangerouslySetInnerHTML={meta.header.yahooHtml}></section>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Yahoo);
