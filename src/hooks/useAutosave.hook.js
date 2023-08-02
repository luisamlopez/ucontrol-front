import { useEffect, useRef } from 'react';


function useAutosave(callback, delay = 1000, deps = []) {
    const savedCallback = useRef();
    useEffect(() => {
        savedCallback.current = callback;
    }
        , [callback]);
    useEffect(() => {
        function runCallback() {
            savedCallback.current();
        };

        if (typeof delay === 'number') {
            const id = setInterval(runCallback, delay);
            return () => clearInterval(id);
        }
    }, [delay, ...deps]);

};

export default useAutosave;