const CornerSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        className="absolute -bottom-18 right-0 w-1/4 h-1/4"
    >
        <defs>
            <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#DEA03C", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#000000", stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path d="M200 0 L200 200 L0 200 Q200 200 200 0" fill="url(#cornerGradient)" />
    </svg>
);

export default CornerSVG;