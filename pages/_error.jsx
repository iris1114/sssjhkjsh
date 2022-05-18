
import Error from "../components/error/index.jsx";

const App = (props) => {
    return (
        <>
            <Error {...props} />
        </>
    );
};

App.getInitialProps = ({res, err}) => {
    const statusCode = 404;

    if(res){
        statusCode = res.statusCode;
    }
    else if(err){
        statusCode = err.statusCode;
    }

    return {
        statusCode: statusCode
    };
};

export default App;
