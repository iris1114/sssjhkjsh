
import { connect } from "react-redux";

export const getServerSideProps = async (context) => {
    if(context.query.year){
        return {
            redirect: {
                destination: `/${context.query.contentType}/searchProgram?releaseYear=${context.query.year}`,
                permanent: true,
            }
        };
    }
    
    if(context.query.country){
        return {
            redirect: {
                destination: `/${context.query.contentType}/searchProgram?countryId=${context.query.country}`,
                permanent: true,
            }
        };
    }

    if(context.query.category){
        return {
            redirect: {
                destination: `/${context.query.contentType}/searchProgram?genreId=${context.query.category}`,
                permanent: true,
            }
        };
    }

    return {
        redirect: {
            destination: `/${context.query.contentType}`,
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
