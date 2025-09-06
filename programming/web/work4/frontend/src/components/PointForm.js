import React, { useState } from 'react';
import './PointForm.css'; // Предполагается, что стили для кнопок и других элементов находятся здесь

const xValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const rValues = [1, 2, 3, 4, 5];


function PointForm({ onSubmit, onRChange }) {
    const [x, setX] = useState(null);
    const [y, setY] = useState('');
    const [r, setR] = useState(null);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errors = {};
        if (x === null) errors.x = 'Выберите значение X';
        const yNumber = parseFloat(y);
        if (isNaN(yNumber) || yNumber <= -5 || yNumber >= 3) {
            errors.y = 'Y должен быть числом от -5 до 3';
        }
        if (r === null) errors.r = 'Выберите значение R';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ x: parseFloat(x), y: parseFloat(y), r: parseFloat(r) });
        }
    };

    const handleRChange = value => {
        setR(value);
        onRChange(value);
    };

    return (
        <form onSubmit={handleSubmit} className="point-form">
            <div className="form-group">
                <label>Координата X:</label>
                <div className="button-group">
                    {xValues.map(value => (
                        <button
                            type="button"
                            key={value}
                            className={`btn ${x === value ? 'btn-active' : ''}`}
                            onClick={() => setX(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                {errors.x && <span className="error">{errors.x}</span>}
            </div>

            <div className="form-group">
                <label>Координата Y (-5 ... 3):</label>
                <input
                    type="number"
                    value={y}
                    onChange={e => setY(e.target.value)}
                    min="-5"
                    max="3"
                    step="1"
                    placeholder="Введите Y"
                />
                {errors.y && <span className="error">{errors.y}</span>}
            </div>

            <div className="form-group">
                <label>Радиус R:</label>
                <div className="button-group">
                    {rValues.map(value => (
                        <button
                            type="button"
                            key={value}
                            className={`btn ${r === value ? 'btn-active' : ''}`}
                            onClick={() => handleRChange(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                {errors.r && <span className="error">{errors.r}</span>}
            </div>

            <button type="submit" className="submit-btn">Проверить</button>
        </form>
    );
}

export default PointForm;
