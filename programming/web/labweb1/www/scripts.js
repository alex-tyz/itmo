const url = "http://localhost:8080/fcgi-bin/labweb1.jar";

function submitForm(event) {
    event.preventDefault();

    const x = document.getElementById("x1");
    const y = document.getElementById("y");


    const rElements = document.querySelectorAll('input[name="r"]:checked');
    const rValues = Array.from(rElements).map(cb => cb.value);

    if (!x || !x.value) {
        createError("x не определен", x);
    } else if (rValues.length === 0) {
        createError("r не выбран");
    } else {
        document.querySelectorAll(".error").forEach(el => el.remove());
        y.classList.remove("wrong");


        Promise.all([checkX(x), checkY(y), checkR(rValues)]).then(() => {
            sendData(x, y, rValues);
        }).catch((error) => {
            createError(error);
        });
    }
}



const limitDecimals = (value, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

const checkX = (value) => {
    return new Promise((resolve, reject) => {
        const xValue = limitDecimals(parseFloat(value.value), 10);
        if (xValue < -5 || xValue > 5) {
            createError("x вне допустимого диапазона (-5; 5)", value);
            reject("x вне допустимого диапазона (-5; 5)");
        } else {
            value.classList.remove("wrong");
            resolve();
        }
    });
}

const checkY = (value) => {
    return new Promise((resolve, reject) => {
        const yValue = limitDecimals(parseFloat(value.value), 10);
        if (yValue < -3 || yValue > 3) {
            createError("y вне допустимого диапазона (-3; 3)", value);
            reject("y вне допустимого диапазона (-3; 3)");
        } else {
            value.classList.remove("wrong");
            resolve();
        }
    });
}



const checkR = (values) => {
    return new Promise((resolve, reject) => {
        if (values.length === 0) {
            reject("r не выбран");
        } else {
            const invalidValues = values.filter(r => parseInt(r) < 1 || parseInt(r) > 5);
            if (invalidValues.length > 0) {
                reject("r вне допустимого диапазона (1; 5)");
            } else {
                resolve();
            }
        }
    });
}

const createError = (message, element = null) => {
    // Удаляем все предыдущие ошибки
    document.querySelectorAll(".error").forEach(el => el.remove());

    const error = document.createElement("p");
    error.className = "error";
    error.textContent = message;
    document.getElementById("coordInputs").prepend(error);

    if (element) {
        element.classList.add("wrong");
    }
}


function sendData(x, y, rValues) {
    rValues.forEach(rValue => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                x: parseFloat(x.value),
                y: parseFloat(y.value),
                r: parseInt(rValue)
            })
        }).then(response => {
            response.json()
                .then(data => {
                    console.log(`WE GOT ${data}`);
                    addToTable(x.value, y.value, rValue, data.status, data.time, new Date().toLocaleTimeString());
                    drawDot(x.value, y.value, rValue, data.status);
                }).catch(err => {
                console.log("Ошибка в обработке ответа:", err);
            });
        });
    });
}

function addToTable(x, y, r, status, time, date) {
    const tableBody = document.getElementById("table-body");
    const row = document.createElement("tr");
    row.className = "row";

    const createCell = (content) => {
        const cell = document.createElement("td");
        cell.className = "item";
        cell.textContent = content;
        return cell;
    };


    row.appendChild(createCell(x));
    row.appendChild(createCell(y));
    row.appendChild(createCell(r));
    row.appendChild(createCell(status));
    row.appendChild(createCell(time));
    row.appendChild(createCell(date));

    tableBody.prepend(row);
}

function drawDot(x, y, r, status) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const centerX = 200;
    const centerY = 200;
    const scale = 40;

    const calcCoord = (coord, radius, isX) => (centerX + (coord * scale * (isX ? 1 : -1)) / radius);

    ctx.beginPath();
    ctx.fillStyle = status ? '#A8E4A0' : '#EE204D';
    ctx.arc(calcCoord(x, r, true), calcCoord(y, r, false), 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    console.log(`Dot has been drawn for R=${r}`);
}
