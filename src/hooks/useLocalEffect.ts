import { isLocal } from '@/utils';
import { useEffect, useRef } from 'react';

// running functions only on local environment, used to debug
export function useLocalEffect(callback: () => void, deps: any[] = []) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (isLocal()) {
            savedCallback.current();
        }
    }, deps);
}
