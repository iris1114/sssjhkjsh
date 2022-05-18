
import { connect } from "react-redux";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <img className="banner_section" src={require(`../../../assets/image/purchase/packageInfo/banner/${props.packageInfo.banner}`)} alt={props.packageInfo.title} />

            <style jsx>
                {`
                    .banner_section{
                        width: 100%;
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    packageInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
