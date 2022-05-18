
import { connect } from "react-redux";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const color = useMemo(() => {
        if(props.color){
            return props.color;
        }

        return "#5e0b75";
    }, [props.color]);

    const marginTop = useMemo(() => {
        if(props.marginTop){
            return props.marginTop;
        }

        return "20px";
    }, [props.marginTop]);

    const paddingLeft = useMemo(() => {
        if(props.paddingLeft){
            return props.paddingLeft;
        }

        return "0.5%";
    }, [props.paddingLeft]);

    const paddingRight = useMemo(() => {
        if(props.paddingRight){
            return props.paddingRight;
        }

        return "0.5%";
    }, [props.paddingRight]);

    const height = useMemo(() => {
        if(props.height){
            return props.height;
        }

        return "30px";
    }, [props.height]);

    return (
        <>
            <div className="breadcrumb_section">
                {
                    props.breadCrumb.map((item, index) => {
                        if(index < props.breadCrumb.length - 1){
                            return (
                                <React.Fragment key={index}>
                                    <Link href={item.href} as={item.as}>
                                        <a className="link" title={item.name}>{item.name}</a>
                                    </Link>

                                    <span className="arrow">{">"}</span>
                                </React.Fragment>
                            );
                        }
                        else{
                            return (
                                <span className="link" key={index}>{item.name}</span>
                            );
                        }
                    })
                }
            </div>

            <style jsx>
                {`
                    .breadcrumb_section{
                        overflow: hidden;
                        padding-left: ${paddingLeft};
                        padding-right: ${paddingRight};
                        color: ${color};
                        margin-top: ${marginTop};
                        height: ${height};

                        .link{
                            display: block;
                            float: left;
                            font-size: 15px;
                            line-height: ${height};

                            &:last-child{
                                float: none;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .arrow{
                            display: block;
                            float: left;
                            font-size: 15px;
                            line-height: ${height};
                            padding-left: 5px;
                            padding-right: 5px;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    breadCrumb: PropTypes.array.isRequired,
    color: PropTypes.string,
    marginTop: PropTypes.string,
    paddingLeft: PropTypes.string,
    paddingRight: PropTypes.string,
    height: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);