const url = "/WEB2.0/api";


var globalX = JSON.parse(localStorage.getItem("clicked"));;
var dotx = JSON.parse(localStorage.getItem("dotX"));
var doty = JSON.parse(localStorage.getItem("dotY"));
var dotcolor = JSON.parse(localStorage.getItem("dotColor"));


if(dotx == null){
    localStorage.setItem("dotX",JSON.stringify([]));
    dotx = JSON.parse(localStorage.getItem("dotX"));
    
}
if(doty == null){
    localStorage.setItem("dotY",JSON.stringify([]));
    doty = JSON.parse(localStorage.getItem("dotY"));
}
if(dotcolor == null){
    localStorage.setItem("dotColor",JSON.stringify([]));
    dotcolor = JSON.parse(localStorage.getItem("dotColor"));
}
if (globalX == null){
    localStorage.setItem("clicked",JSON.stringify([]));
    globalX = JSON.parse(localStorage.getItem("clicked"));
}


function submitForm(event) {
    event.preventDefault();
    document.querySelectorAll(".error").forEach(el => el.remove());
    const y = document.getElementById("y");
    let rselect = document.getElementById('rselect');
    const r = rselect.options[rselect.selectedIndex];
    for (var i = 0; i < globalX.length; i++){
    let x  = globalX[i];
    if (!r) {
        createError("r не выбран");
    } else {
        y.classList.remove("wrong");
        Promise.all([
            checkY(y),
            checkR(r)
        ]).then(() => {
            sendData(x, y.value, r.value);
        }).catch((error) => {
            createError(error);
        });
        }
    }
}

const checkY = (value) => {
    return new Promise((resolve, reject) => {
        if ((-5) > value.value || value.value > 5) {
            value.classList.add("wrong");
            reject("y вне допустимого диапазона (-5...5)");
        } else {
            resolve();
        }
    });
};


const checkR = (arr) => {
    return new Promise((resolve, reject) => {
        if (!arr) {
            reject("r не выбран");
        } else {
            resolve();
        }
    });
};

const createError = (message) => {
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = message;
    document.getElementById("coordInputs").prepend(error);
};

function sendData(x, y, r) {
    const bodyData = new URLSearchParams({
        x: parseFloat(x),
        y: parseFloat(y),
        r: parseFloat(r)
    });

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyData.toString()
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    createError("Неверные параметры");
                } else if (response.status === 405) {
                    createError("Запрещенный метод");
                }
            } else {
                return response.json();
            }
        })
        .then(data => {
            addToTable(data.x.toFixed(2), data.y.toFixed(2), data.r, data.status, new Date().toLocaleTimeString(), data.timeOfCalculating);
            let scale = data.r/5;
            console.log(data.x,data.y);
            let X = ((data.x/scale)*(canvas.width/12) + canvas.width/2);
            let Y = (-1)*((data.y/scale)*(canvas.height/12) - canvas.height/2);
            let color = '';
            if (data.status){
                color = "#34eb55"
            }
            else{
                color = "#eb3a34"
            }
            drawPoint(X,Y,color);
            console.log(dotx);
            dotx.push(X);
            doty.push(Y);
            dotcolor.push(color);
            localStorage.setItem("dotX",JSON.stringify(dotx));
            localStorage.setItem("dotY",JSON.stringify(doty));
            localStorage.setItem("dotColor",JSON.stringify(dotcolor));

        })
        .catch(error => {
            console.log(error);
        });
}

function addToTable(x, y, r, status, time, data) {
    const tableBody = document.getElementById("table-body");
    const row = document.createElement("tr");
    row.className = "row";
    const xtd = document.createElement("td");
    xtd.className = "item";
    xtd.textContent = x;
    row.appendChild(xtd);
    const ytd = document.createElement("td");
    ytd.className = "item";
    ytd.textContent = y;
    row.appendChild(ytd);
    const rtd = document.createElement("td");
    rtd.className = "item";
    rtd.textContent = r;
    row.appendChild(rtd);
    const stattd = document.createElement("td");
    stattd.className = "item";
    stattd.textContent = status;
    row.appendChild(stattd);
    const timetd = document.createElement("td");
    timetd.className = "item";
    timetd.textContent = time;
    row.appendChild(timetd);
    const datatd = document.createElement("td");
    datatd.className = "item";
    datatd.textContent = data;
    row.appendChild(datatd);
    tableBody.prepend(row);
}



canvas.addEventListener("click", (event) => {
    let rselect = document.getElementById('rselect');
    const r = rselect.options[rselect.selectedIndex];
    let scale = r.value/5;
    const x = (((event.offsetX - canvas.width / 2) / (canvas.width / 12))*scale).toFixed(2);
    const y = (((canvas.height / 2 - event.offsetY) / (canvas.height / 12))*scale).toFixed(2);
    if (!r) {
        createError("R не выбран");
        return;
    }
    
    sendData(x, y, r.value); // Отправляем данные на сервер
});


var xbuttons = document.getElementsByClassName("xbtn");

var changeX = function(event) {
    if (globalX.includes(event.target.value)){
        event.target.style.background = "#747474";
        globalX.splice(globalX.indexOf(event.target.value),1);

    } 
    else{
        event.target.style.background = "#302f30";
        globalX.push(event.target.value);
    }
    localStorage.setItem("clicked",JSON.stringify(globalX));
    console.log(globalX);
};

for (var i = 0; i < xbuttons.length; i++) {
    xbuttons[i].addEventListener('click', changeX, false);
    if (globalX.includes(xbuttons[i].value)){
        xbuttons[i].style.background = "#302f30";
    }
}
