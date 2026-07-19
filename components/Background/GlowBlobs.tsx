"use client";

export default function GlowBlobs() {
    return (
        <>
            {/* Blob 1 */}
            <div
                className="
                    absolute
                    top-5
                    left-[-8rem]
                    h-[28rem]
                    w-[28rem]
                    rounded-full
                    bg-cyan-400/10
                    blur-3xl
                    animate-float-blob
                "
            />

            {/* Blob 2 */}
            <div
                className="
                    absolute
                    top-1/4
                    right-[-10rem]
                    h-[32rem]
                    w-[32rem]
                    rounded-full
                    bg-violet-500/20
                    blur-3xl
                    animate-float-blob
                "
                style={{
                    animationDelay: "4s",
                }}
            />

            {/* Blob 3 */}
            <div
                className="
                    absolute
                    bottom-[-16rem]
                    left-1/5
                    h-[35rem]
                    w-[35rem]
                    rounded-full
                    bg-cyan-500/10
                    blur-3xl
                    animate-float-blob
                "
                style={{
                    animationDelay: "8s",
                }}
            />
        </>
    );
}