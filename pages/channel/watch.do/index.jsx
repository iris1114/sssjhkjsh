
import { connect } from "react-redux";

export const getServerSideProps = async (context) => {
    let destination = "";

    if(context.query.bsm_package_category){
        if(context.query.content_id){
            locadestinationtion = `/channel/VOD-CHANNEL?contentId=${context.query.content_id}`;
        }
        else{
            destination = "/channel/VOD-CHANNEL";
        }
    }
    else if(context.query.content_id){
        destination = `/channel/watch?contentId=${context.query.content_id}`;
    }
    else{
        destination = "/channel/watch";
    }

    return {
        redirect: {
            destination: destination,
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
