import { useEffect, useState } from "react";

export function useScrolled(ref: React.RefObject<HTMLElement | null>, threshold = 0) {
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const container = ref?.current;
        if (!container) return;

        const onScroll = () => {
            setScrolled(container.scrollTop > threshold);
        }

        onScroll();
        // container.addEventListener("scroll", onScroll);

        // return () => container.removeEventListener("scroll", onScroll);

    }, [ref, threshold]);

    return scrolled;
}