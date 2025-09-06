import React from 'react';
import './Header.css';

export function Header() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <h1>Ильин Александр Александрович P3217 4473</h1>
                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </div>
        </header>
    );
}