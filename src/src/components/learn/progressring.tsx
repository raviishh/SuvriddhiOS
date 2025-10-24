interface ProgressRingProps {
    size?: number;
    stroke?: number;
    progress: number;
}

export default function ProgressRing({ size = 28, stroke = 5, progress = 0 }: ProgressRingProps) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="inline-block">
            <defs>
                <linearGradient id="grad" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="rgb(142,124,195)" />
                </linearGradient>
            </defs>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={stroke}
                stroke="var(--color-muted)"
                fill="none"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={stroke}
                strokeLinecap="round"
                stroke="url(#grad)"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                fill="none"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* Text percentage in the center of the ring

            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-xs fill-current text-foreground" style={{fontSize: 10}}>
                {Math.round(progress)}%
            </text>
             */}
        </svg>
    );
}