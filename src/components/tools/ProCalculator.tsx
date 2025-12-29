import React, { useState, useEffect, useCallback } from 'react';
import './ToolSuite.css';

export const ProCalculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [tape, setTape] = useState('');
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [operator, setOperator] = useState<string | null>(null);
    const [value, setValue] = useState<number | null>(null);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };



    // Fix tape logic for simpler "Last Action" display
    const handleOp = (nextOp: string) => {
        const inputValue = parseFloat(display);

        if (value === null) {
            setValue(inputValue);
            setTape(`${inputValue} ${nextOp}`);
            setWaitingForOperand(true);
            setOperator(nextOp);
        } else if (operator) {
            // Calculate existing
            const result = calculate(value, inputValue, operator);
            setValue(result);
            setDisplay(String(result));
            setWaitingForOperand(true);

            if (nextOp === '=') {
                setOperator(null);
                setTape(`${value} ${operator} ${inputValue} =`);
                setValue(null); // Reset for new calc
            } else {
                setOperator(nextOp);
                setTape(`${result} ${nextOp}`);
            }
        }
    };

    const calculate = (prev: number, next: number, op: string) => {
        switch (op) {
            case '+': return prev + next;
            case '-': return prev - next;
            case '*': return prev * next;
            case '/': return prev / next;
            default: return next;
        }
    }

    const clear = () => {
        setDisplay('0');
        setValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        setTape('');
    };

    // Keyboard support
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const { key } = event;

        if (/\d/.test(key)) {
            inputDigit(key);
        } else if (key === '.') {
            if (!display.includes('.')) inputDigit('.');
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            if (operator) handleOp('=');
        } else if (key === 'Backspace') {
            setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
        } else if (key === '+') {
            handleOp('+');
        } else if (key === '-') {
            handleOp('-');
        } else if (key === '*') {
            handleOp('*');
        } else if (key === '/') {
            handleOp('/');
        } else if (key === 'Escape' || key === 'c') {
            clear();
        }
    }, [display, operator, value, waitingForOperand]);

    useEffect(() => {
        // Only attach if this component is focused or globally? 
        // User requested "Keyboard support". Floating windows usually need focus, or global if no other inputs.
        // For safety, we'll attach to document but maybe check if active. 
        // Since it's a floating tool, global hotkeys might conflict.
        // We will add a simple event listener.
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div style={{ padding: '4px' }}>
            <div className="calc-grid">
                <div className="calc-display">
                    <div className="calc-tape">{tape}</div>
                    <div className="calc-main">{display}</div>
                </div>

                <button className="calc-btn func" onClick={clear}>AC</button>
                <button className="calc-btn func" onClick={() => setDisplay(String(parseFloat(display) * -1))}>+/-</button>
                <button className="calc-btn func" onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</button>
                <button className="calc-btn op" onClick={() => handleOp('/')}>÷</button>

                <button className="calc-btn num" onClick={() => inputDigit('7')}>7</button>
                <button className="calc-btn num" onClick={() => inputDigit('8')}>8</button>
                <button className="calc-btn num" onClick={() => inputDigit('9')}>9</button>
                <button className="calc-btn op" onClick={() => handleOp('*')}>×</button>

                <button className="calc-btn num" onClick={() => inputDigit('4')}>4</button>
                <button className="calc-btn num" onClick={() => inputDigit('5')}>5</button>
                <button className="calc-btn num" onClick={() => inputDigit('6')}>6</button>
                <button className="calc-btn op" onClick={() => handleOp('-')}>−</button>

                <button className="calc-btn num" onClick={() => inputDigit('1')}>1</button>
                <button className="calc-btn num" onClick={() => inputDigit('2')}>2</button>
                <button className="calc-btn num" onClick={() => inputDigit('3')}>3</button>
                <button className="calc-btn op" onClick={() => handleOp('+')}>+</button>

                <button className="calc-btn num zero" onClick={() => inputDigit('0')}>0</button>
                <button className="calc-btn num" onClick={() => inputDigit('.')}>.</button>
                <button className="calc-btn op" onClick={() => handleOp('=')}>=</button>
            </div>
        </div>
    );
};
