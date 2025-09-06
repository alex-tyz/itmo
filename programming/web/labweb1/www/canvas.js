const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawAxis() {
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawGrid() {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function drawShapes(r) {
    const scaleFactor = 160 / r;


    ctx.beginPath();
    ctx.fillStyle = '#FFD700';
    ctx.arc(centerX, centerY, scaleFactor * r / 2, 0.5 * Math.PI, Math.PI, false);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.fillStyle = '#FFD700';
    ctx.rect(centerX, centerY - scaleFactor * r, scaleFactor * r / 2, scaleFactor * r);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.fillStyle = '#FFD700';
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + scaleFactor * r / 2, centerY);
    ctx.lineTo(centerX, centerY + scaleFactor * r);
    ctx.fill();
    ctx.closePath();
}

function drawCoords(r) {
    const scaleFactor = 160 / r;
    ctx.fillStyle = 'black';
    ctx.font = '1.25em Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    const labels = ['R/2', 'R', '-R/2', '-R'];
    const positions = [centerX + scaleFactor * r / 2, centerX + scaleFactor * r, centerX - scaleFactor * r / 2, centerX - scaleFactor * r];


    for (let i = 0; i < 4; i++) {
        ctx.fillText(labels[i], positions[i], centerY + 30);
        ctx.beginPath();
        ctx.moveTo(positions[i], centerY - 5);
        ctx.lineTo(positions[i], centerY + 5);
        ctx.stroke();
        ctx.closePath();
    }


    const yLabels = ['R/2', 'R', '-R/2', '-R'];
    const yPositions = [centerY - scaleFactor * r / 2, centerY - scaleFactor * r, centerY + scaleFactor * r / 2, centerY + scaleFactor * r];

    for (let i = 0; i < 4; i++) {
        ctx.fillText(yLabels[i], centerX + 30, yPositions[i]);
        ctx.beginPath();
        ctx.moveTo(centerX - 5, yPositions[i]);
        ctx.lineTo(centerX + 5, yPositions[i]);
        ctx.stroke();
        ctx.closePath();
    }
}




function drawAll(r) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawShapes(r * 40);
    drawAxis();
    drawCoords(r);
}

drawAll(2);
