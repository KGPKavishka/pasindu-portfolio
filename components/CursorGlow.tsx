"use client";

import { useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
} from "framer-motion";

export default function CursorGlow() {
    const mouseX = useMotionValue(-200);
    const mouseY = useMotionValue(-200);

    const springX = useSpring(mouseX, {
        stiffness: 120,
        damping: 20,
    });

    const springY = useSpring(mouseY, {
        stiffness: 120,
        damping: 20,
    });

    useEffect(() => {
        const handleMouseMove = (
            event: MouseEvent
        ) => {
            mouseX.set(event.clientX);
            mouseY.set(event.clientY);
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );
        };
    }, []);

    return (
        <motion.div
            className="
        pointer-events-none
        fixed
        z-[9998]
        hidden
        lg:block
      "
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.div
                className="
          h-72
          w-72
          rounded-full
          bg-cyan-400/10
          blur-3xl
        "
            />
        </motion.div>
    );
}