import { useMemo } from 'react';

const Gauge = ({ value, radius, maximum }) => {
    const center = radius * 1.1; // Um das SVG innerhalb des Bildschirms zentriert zu halten
    const stripes = 10; // Anzahl der Striche auf dem Halbkreis
    const pointerLengthPercent = 0.9; // Länge des Zeigers als Prozentsatz des Radius

    const angle = useMemo(() => {
        if (!value || value <= 0) return 0;

        // Berechne den Logarithmus der Höhe
        const logValue = Math.log(value + 1) / Math.log(1.1) / (Math.log(maximum) / Math.log(1.1));
        const clamped = Math.max(0, Math.min(1, logValue));

        return clamped * 180 - 90; // Der Wert wird auf den Bereich [-90°, 90°] umgerechnet
    }, [value]);

    // Mindestgrößen für den Zeiger
    const minStrokeWidth = 3;  // Mindestdicke des Zeigers

    return (
        <svg width={radius * 2.2} height={radius*1.2}>
            {/* Skala (Halbkreis) */}
            <path
                d={`M${center - radius},${center} A${radius},${radius} 0 0,1 ${center + radius},${center}`}
                fill="none"
                stroke="#ccc"
                strokeWidth={radius*0.2}  // Verstärkte Änderung der Dicke des Halbkreises (mind. 6px)
            />
            {/* Striche gleichmäßig verteilen, 90° im Uhrzeigersinn drehen */}
            {[...Array(stripes)].map((_, i) => {
                const angleStep = (i / (stripes - 1)) * 180 - 90 - 90; // 90° im Uhrzeigersinn drehen
                const a = angleStep * (Math.PI / 180);  // Umrechnung in Bogenmaß

                // Berechne die Koordinaten für die Striche
                const lineLength = radius * 0.1;  // Kürzere Striche (max. 5% des radius, mindestens 4px)
                const x1 = center + Math.cos(a) * (radius - lineLength); // Startpunkt der Linie
                const y1 = center + Math.sin(a) * (radius - lineLength);
                const x2 = center + Math.cos(a) * radius; // Endpunkt der Linie
                const y2 = center + Math.sin(a) * radius;

                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#333"
                        strokeWidth={Math.max(1, radius / 100)}  // Dynamische Dicke der Striche basierend auf radius (min. 1px)
                    />
                );
            })}
            {/* Zeiger */}
            <line
                x1={center}
                y1={center}
                x2={center + Math.cos(((angle - 90) * Math.PI) / 180) * (radius * pointerLengthPercent)}
                y2={center + Math.sin(((angle - 90) * Math.PI) / 180) * (radius * pointerLengthPercent)}
                stroke="red"
                strokeWidth={Math.max(minStrokeWidth, radius / 25)}  // Dynamische Dicke des Zeigers basierend auf radius (mind. minStrokeWidth px)
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Gauge;
