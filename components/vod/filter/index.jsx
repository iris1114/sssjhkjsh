
import { connect } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import contentTypeMap from "../../../assets/json/content/contentTypeMap.json";

import BreadCrumb from "../../breadCrumb/index.jsx";
import Filter from "./filter.jsx";
import Programs from "./programs/index.jsx";

import tools from "../../../assets/js/tools/index.js";
import beacon from "../../../assets/js/beacon/index.js";
import gtag from "../../../assets/js/gtag/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const router = useRouter();

    const [filterState, setFilterState] = useState();

    const contentType = useMemo(() => {
        return props.searchProgram.data[0].content_type;
    }, [props.searchProgram]);

    const filter = useMemo(() => {
        return props.filter[contentType];
    }, [contentType]);

    const breadCrumb = useMemo(() => {
        let _breadCrumb = new Array();

        _breadCrumb.push({
            name: "首頁",
            href: "/",
            as: "/"
        });

        if(contentTypeMap[contentType]){
            _breadCrumb.push({
                name: contentTypeMap[contentType],
                href: "/[contentType]",
                as: `/${contentType}`
            });
        }

        if(filter){
            _breadCrumb.push({
                name: "進階篩選",
                href: "/[contentType]/filter",
                as: `/${contentType}/filter`
            });
        }
        else{
            _breadCrumb.push({
                name: props.searchProgram.result_type_name,
                href: "/[contentType]/filter",
                as: `/${contentType}/filter`
            });
        }

        return _breadCrumb;
    }, [contentType]);

    useEffect(() => {
        let conditions = tools.url.getQuery(location.href, "conditions");
        let extentions = tools.url.getQuery(location.href, "extentions");
        let sort = tools.url.getQuery(location.href, "sort");
        
        let _conditions = new Array();
        let _extentions = new Array();
        let _sort = null;

        if(conditions && extentions){
            conditions = decodeURIComponent(conditions);
            conditions = conditions.split(",");

            extentions = decodeURIComponent(extentions);
            extentions = extentions.split(",");
        }
        else{
            conditions = new Array();
            conditions = new Array();
        }

        if(sort){
            sort = decodeURIComponent(sort);
        }

        for(let i = 0; i < filter.length; i ++){
            let item = filter[i];

            if(item.type == "filter"){
                let conditionIndex = conditions.indexOf(item.condition);
                let condition = null;
                let extention = null;

                if(conditionIndex != -1){
                    condition = conditions[conditionIndex];
                    extention = extentions[conditionIndex];      
                }
                else{
                    condition = item.condition;
                    extention = item.extention[0].value;
                }

                _conditions.push(condition);
                _extentions.push(extention);
            }
            else if(item.type == "sort"){
                if(sort){
                    _sort = sort;
                }
                else{
                    _sort = item.extention[0].value;
                }
            }
        }

        setFilterState({
            conditions: _conditions,
            extentions: _extentions,
            sort: _sort
        });
    }, [router]);

    useEffect(() => {
        if(!filterState){
            return;
        }

        let href = location.href;

        if(filterState.conditions && filterState.conditions.length > 0){
            let conditions = filterState.conditions.join(",");
            
            conditions = encodeURIComponent(conditions);

            href = tools.url.replaceQuery(href, "conditions", conditions);
        }

        if(filterState.extentions && filterState.extentions.length > 0){
            let extentions = filterState.extentions.join(",");
            
            extentions = encodeURIComponent(extentions);

            href = tools.url.replaceQuery(href, "extentions", extentions);
        }

        if(filterState.sort){
            let sort = encodeURIComponent(filterState.sort);

            href = tools.url.replaceQuery(href, "sort", sort);
        }

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, document.title, href);

        beacon();
        gtag.pageview();
    }, [filterState]);

    return (
        <>
            <div className="filter_content">
                <BreadCrumb breadCrumb={breadCrumb} color="#5e0b75" />

                {
                    (() => {
                        if(filter){
                            return <Filter filter={filter} filterState={filterState} setFilterState={setFilterState} contentType={contentType} />;
                        }
                    })()
                }

                <Programs filter={filter} searchProgram={props.searchProgram} filterState={filterState} />
            </div>

            <style jsx>
                {`
                    .filter_content{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    filter: PropTypes.object.isRequired,
    searchProgram: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
