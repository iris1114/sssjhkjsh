
import { connect } from "react-redux";
import { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const filter = useMemo(() => {
        let data = props.filter.sort((a, b) => {
            return b.strength - a.strength;
        });

        return data;
    }, [props.filter]);

    const getFilterBtnHref = useCallback((filter, extention) => {
        if(filter.type == "filter"){
            let conditions = encodeURIComponent(filter.condition);
            let extentions = encodeURIComponent(extention.value);

            return `/${props.contentType}/filter?conditions=${conditions}&extentions=${extentions}`;
        }
        else if(filter.type == "sort"){
            let sort = encodeURIComponent(extention.value);

            return `/${props.contentType}/filter?sort=${sort}`;
        }
    }, [filter, props.contentType]);

    const getFilterBtnFocusClass = useCallback((filter, extention) => {
        if(!props.filterState){
            return "";
        }

        if(filter.type == "filter"){
            if(props.filterState.conditions && props.filterState.extentions){
                let condition = filter.condition;
                let conditionIndex = props.filterState.conditions.indexOf(condition);

                if(extention.value == props.filterState.extentions[conditionIndex]){
                    return "focus";
                }
            }
        }
        else if(filter.type == "sort"){
            if(extention.value == props.filterState.sort){
                return "focus";
            }
        }

        return "";
    }, [props.filterState]);

    const filterBtnClickHandler = useCallback((event, filter, extention) => {
        event.preventDefault();

        let condition = filter.condition;

        if(filter.type == "filter"){
            let conditionIndex = props.filterState.conditions.indexOf(condition);
            let filterState = _.cloneDeep(props.filterState);

            filterState.extentions[conditionIndex] = extention.value;
            
            props.setFilterState(filterState);
        }
        else if(filter.type == "sort"){
            let filterState = _.cloneDeep(props.filterState);

            filterState.sort = extention.value;

            props.setFilterState(filterState);
        }
    }, [props.filterState]);

    return (
        <>
            <div className="filter_section">
                <div className="filter_controls">
                    {
                        filter.map((item, index) => {
                            return (
                                <div className="filter_control_section" key={index}>
                                    <div className="filter_text">{item.name}</div>

                                    <div className="filter_content">
                                        <div className="segment"></div>

                                        {
                                            item.extention.map((_item, _index) => {
                                                return (
                                                    <a className={`filter_btn ${getFilterBtnFocusClass(item, _item)}`} onClick={(event) => filterBtnClickHandler(event, item, _item)} href={getFilterBtnHref(item, _item)} title={_item.caption} key={_index}>{_item.caption}</a>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .filter_section{
                        margin-top: 20px;
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                        

                        .filter_controls{
                            box-shadow: 0 2px 8px 0 rgba(0,0,0,.2);
                            background-color: #fff;
                            border-radius: 4px;
                            overflow: hidden;
                            padding-left: 5px;
                            padding-right: 5px;

                            .filter_control_section{
                                overflow: hidden;
                                position: relative;
                                margin-top: 10px;
                                margin-bottom: 10px;
    
                                .filter_text{
                                    line-height: 30px;
                                    font-size: 14px;
                                    color: #666;
                                    position: relative;
                                    min-width: 60px;
                                    padding-left: 5px;
                                    padding-right: 5px;
                                    float: left;
                                }
    
                                .filter_content{
                                    overflow: hidden;
                                    display: block;
                                    position: relative;
                                    padding-left: 5px;
                                    padding-right: 5px;
    
                                    .segment{
                                        position: absolute;
                                        width: 1px;
                                        background-color: #333;
                                        left: 0px;
                                        top: 5px;
                                        bottom: 5px;
                                    }
    
                                    .filter_btn{
                                        color: #333;
                                        line-height: 30px;
                                        font-size: 14px;
                                        padding-left: 10px;
                                        padding-right: 10px;
                                        display: inline-block;
                                        vertical-align: middle;
    
                                        &.focus{
                                            background-color: #f60;
                                            color: #fff;
                                            border-radius: 4px;
                                        }
                                    }
                                }                            
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    filterState: PropTypes.object,
    setFilterState: PropTypes.func.isRequired,
    filter: PropTypes.array.isRequired,
    contentType: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
