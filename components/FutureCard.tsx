interface Props {
    icon: string;
    title: string;
    description: string;
    progress: number;
    color: string;
}

export default function FutureCard({
    icon,
    title,
    description,
    progress,
    color,
}: Props) {
    const colors = {
        purple: {
            border: "hover:border-purple-400",
            progress: "bg-purple-400",
            badge: "text-purple-400",
            iconBg: "bg-purple-500/10",
            glow: "hover:shadow-purple-500/20",
        },

        pink: {
            border: "hover:border-pink-400",
            progress: "bg-pink-400",
            badge: "text-pink-400",
            iconBg: "bg-pink-500/10",
            glow: "hover:shadow-pink-500/20",
        },

        blue: {
            border: "hover:border-blue-400",
            progress: "bg-blue-400",
            badge: "text-blue-400",
            iconBg: "bg-blue-500/10",
            glow: "hover:shadow-blue-500/20",
        },

        green: {
            border: "hover:border-green-400",
            progress: "bg-green-400",
            badge: "text-green-400",
            iconBg: "bg-green-500/10",
            glow: "hover:shadow-green-500/20",
        },

        cyan: {
            border: "hover:border-cyan-400",
            progress: "bg-cyan-400",
            badge: "text-cyan-400",
            iconBg: "bg-cyan-500/10",
            glow: "hover:shadow-cyan-500/20",
        },

        indigo: {
            border: "hover:border-indigo-400",
            progress: "bg-indigo-400",
            badge: "text-indigo-400",
            iconBg: "bg-indigo-500/10",
            glow: "hover:shadow-indigo-500/20",
        },

        orange: {
            border: "hover:border-orange-400",
            progress: "bg-orange-400",
            badge: "text-orange-400",
            iconBg: "bg-orange-500/10",
            glow: "hover:shadow-orange-500/20",
        },

        rose: {
            border: "hover:border-rose-400",
            progress: "bg-rose-400",
            badge: "text-rose-400",
            iconBg: "bg-rose-500/10",
            glow: "hover:shadow-rose-500/20",
        },
    };

    const theme =
        colors[color as keyof typeof colors] ??
        colors.cyan;

    return (
        <div
            className={`
        group
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        shadow-lg
        hover:shadow-2xl
        ${theme.border}
        ${theme.glow}
      `}
        >
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-5">
                <div
                    className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            text-3xl
            ${theme.iconBg}
          `}
                >
                    {icon}
                </div>

                <div>
                    <h3 className="text-xl font-semibold">
                        {title}
                    </h3>

                    <p
                        className={`text-sm ${theme.badge}`}
                    >
                        Current Learning
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-7">
                {description}
            </p>

            {/* Progress */}
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                        Current Progress
                    </span>

                    <span
                        className={`text-sm font-semibold ${theme.badge}`}
                    >
                        {progress}%
                    </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                        className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-700
                            ${theme.progress}
                            `}
                        style={{
                            width: `${progress}%`,
                            transition: "width 1.2s ease",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}