'use strict'
var gallSec;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function timerOn() {
    var startTime = Date.now();
    gInterval = setInterval(renderTime, 1000, startTime);
}


function renderTime(startTime) {
    var time = Date.now() - startTime;
    document.querySelector('.timer span').innerText = (time / 1000).toFixed(0);
}