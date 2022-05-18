
import { connect } from "react-redux";

export const getServerSideProps = async (context) => {
    return {
        redirect: {
            destination: `/${context.query.contentType}/${context.query.content_id}`,
            permanent: true,
        }
    };
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <></>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
