import React, { useRef, useEffect } from 'react';
import './graph.css';

function Graph({ r, points, onGraphClick }) {
    const canvasRef = useRef(null);

    const drawGraph = (ctx) => {
        const width = 300;
        const height = 300;
        const dpr = window.devicePixelRatio || 1;

        if (canvasRef.current) {
            canvasRef.current.width = width * dpr;
            canvasRef.current.height = height * dpr;
            canvasRef.current.style.width = `${width}px`;
            canvasRef.current.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, width, height);

        const minX = -5;
        const maxX = 5;
        const minY = -5;
        const maxY = 5;
        const scaleX = width / (maxX - minX);
        const scaleY = height / (maxY - minY);

        const xToCanvas = (x) => (x - minX) * scaleX;
        const yToCanvas = (y) => (maxY - y) * scaleY;

        // Draw shapes with Apple-style colors
        ctx.fillStyle = 'rgba(0, 113, 227, 0.1)';

        // Quarter circle
        ctx.beginPath();
        ctx.moveTo(xToCanvas(0), yToCanvas(0));
        ctx.arc(xToCanvas(0), yToCanvas(0), (r / 2) * scaleX, Math.PI, 0.5 * Math.PI, true);
        ctx.closePath();
        ctx.fill();

        // Triangle
        ctx.beginPath();
        ctx.moveTo(xToCanvas(0), yToCanvas(0));
        ctx.lineTo(xToCanvas(-r / 2), yToCanvas(0));
        ctx.lineTo(xToCanvas(0), yToCanvas(r / 2));
        ctx.closePath();
        ctx.fill();

        // Rectangle
        ctx.fillRect(
            xToCanvas(0),
            yToCanvas(0),
            r * scaleX,
            -r * scaleY
        );

        // Grid
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 0.5;

        for (let i = minX; i <= maxX; i++) {
            ctx.beginPath();
            ctx.moveTo(xToCanvas(i), 0);
            ctx.lineTo(xToCanvas(i), height);
            ctx.stroke();
        }

        for (let i = minY; i <= maxY; i++) {
            ctx.beginPath();
            ctx.moveTo(0, yToCanvas(i));
            ctx.lineTo(width, yToCanvas(i));
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xToCanvas(minX), yToCanvas(0));
        ctx.lineTo(xToCanvas(maxX), yToCanvas(0));
        ctx.moveTo(xToCanvas(0), yToCanvas(minY));
        ctx.lineTo(xToCanvas(0), yToCanvas(maxY));
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let i = minX; i <= maxX; i++) {
            if (i !== 0) {
                ctx.fillText(i.toString(), xToCanvas(i), yToCanvas(0) + 5);
            }
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = minY; i <= maxY; i++) {
            if (i !== 0) {
                ctx.fillText(i.toString(), xToCanvas(0) - 5, yToCanvas(i));
            }
        }

        // Draw points with animation
        points.forEach(point => {
            const x = xToCanvas(point.x);
            const y = yToCanvas(point.y);

            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 4;

            ctx.fillStyle = point.hit
                ? 'rgba(52, 199, 89, 0.8)' // Apple green
                : 'rgba(255, 59, 48, 0.8)'; // Apple red

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        drawGraph(ctx);
    }, [r, points]);

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const width = 300;
        const height = 300;
        const minX = -5;
        const maxX = 5;
        const minY = -5;
        const maxY = 5;

        const scaleX = width / (maxX - minX);
        const scaleY = height / (maxY - minY);

        const x = (e.clientX - rect.left) / scaleX + minX;
        const y = maxY - (e.clientY - rect.top) / scaleY;

        onGraphClick({ x, y });
    };

    return (
        <div className="graph-container">
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                className="graph-canvas"
                width={300}
                height={300}
            />
        </div>
    );
}

export default Graph;