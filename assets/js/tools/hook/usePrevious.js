
import { useRef, useEffect } from "react";

const app = (value) => {
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

export default app;
