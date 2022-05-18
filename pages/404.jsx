
import { useMemo } from "react";

import Error from "../components/error/index.jsx";

const App = () => {
    const props = useMemo(() => {
        return {
            statusCode: 404
        };
    }, []);

    return (
        <>
            <Error {...props} />
        </>
    );
};

export default App;
