
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
    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const bannerClickHandler = useCallback(() => {
        //todo
    }, [props.promoBanner, props.programInfo]);

    useEffect(() => {
        //todo
    }, [props.promoBanner]);

    return (
        <>
            <a className="promo_banner" onClick={bannerClickHandler} href={props.promoBanner.click_through} title="LiTV 好康推薦" target="_blank">
                <img className="img" src={`${cdnstatic}/${props.promoBanner.data}`} alt={props.promoBanner.title} />
            </a>

            <style jsx>
                {`
                    .promo_banner{
                        display: block;
                        padding-left: 10px;
                        padding-right: 10px;

                        .img{
                            display: block;
                            width: 100%;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    promoBanner: PropTypes.object.isRequired,
    programInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
