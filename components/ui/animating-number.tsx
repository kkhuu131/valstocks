import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrevious } from "../../hooks/index";

function formatForDisplay(number: number = 0): string[] {
    return parseFloat(Math.max(number, 0).toFixed(2)).toString().split("").reverse();
}

function DecimalColumn() {
    return (
        <div>
            <span>.</span>
        </div>
    );
}

interface NumberColumnProps {
    digit: string;
    delta: string | null;
}

function NumberColumn({ digit, delta }: NumberColumnProps) {
    const [position, setPosition] = useState(0);
    const [animationClass, setAnimationClass] = useState<string | null>(null);
    const previousDigit = usePrevious(digit);
    const columnContainer = useRef<HTMLDivElement>(null);

    const setColumnToNumber = (number: string) => {
        if (columnContainer.current) {
            setPosition(columnContainer.current.clientHeight * parseInt(number, 10));
        }
    };

    useEffect(() => {
        if (previousDigit !== digit) {
            setAnimationClass(null);
            setTimeout(() => setAnimationClass(delta), 10);

            setTimeout(() => {
                if (columnContainer.current) {
                    columnContainer.current.style.color =
                        delta === "increase" ? "#5ac639" : delta === "decrease" ? "#eb5c28" : "white";
                }
            }, 250);
            setTimeout(() => {
                if (columnContainer.current) {
                    columnContainer.current.style.color = "white";
                }
            }, 500);
        }
    }, [digit, delta, previousDigit]);


    

    useEffect(() => setColumnToNumber(digit), [digit]);

    return (
        <div className="ticker-column-container" ref={columnContainer}>
            <motion.div
                animate={{ y: position }}
                className={`ticker-column ${animationClass}`}
                onAnimationComplete={() => setAnimationClass("")}
            >
                {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((num) => (
                    <div key={num} className="ticker-digit">
                        <span>{num}</span>
                    </div>
                ))}
            </motion.div>
            <span className="number-placeholder">0</span>
        </div>
    );
}

interface AnimatingNumberProps {
    value: number;
}

export default function AnimatingNumber({ value }: AnimatingNumberProps) {
    const numArray = formatForDisplay(value);
    const previousNumber = usePrevious(value) || 0;

    let delta: string | null = null;
    if (value > previousNumber) delta = "increase";
    if (value < previousNumber) delta = "decrease";

    return (
        <motion.div layout className="ticker-view decrease">
            {numArray.map((number, index) =>
                number === "." ? (
                    <DecimalColumn key={index} />
                ) : (
                    <NumberColumn key={index} digit={number} delta={delta} />
                )
            )}
        </motion.div>
    );
}
