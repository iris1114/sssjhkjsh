
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Banner from "../banner/index.jsx";
import ChannelCategory from "./channelCategory.jsx";
import VodCategory from "./vodCategory/index.jsx";
import Multiscreen from "./multiscreen.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const App = (props) => {
    return (
        <>
            <div className="home_content">
                <h1 className="ssr_only">LiTV立視線上影視-免費線上看</h1>
                <Banner banner={props.banner} />
                <ChannelCategory homeChannel={props.homeChannel} />
                <VodCategory mainContent={props.mainContent} />
                <Multiscreen />
            </div>

            <style jsx>
                {`
                    .home_content{
                        overflow: hidden;
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    banner: PropTypes.array,
    homeChannel: PropTypes.object.isRequired,
    mainContent: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
