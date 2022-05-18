
import { connect } from "react-redux";

export const getServerSideProps = async (context) => {
    if(context.query.category_id){
        return {
            redirect: {
                destination: `/${context.query.contentType}/searchProgram?categoryId=${context.query.category_id}`,
                permanent: true,
            }
        };
    }
    else{
        return {
            redirect: {
                destination: `/${context.query.contentType}`,
                permanent: true,
            }
        };
    }
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
