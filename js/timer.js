'use strict'

var gMin = 0
var gSec = 0
var gMec = 0

function startClock() {

    var strHtml = ""
    var elClock = document.querySelector(".clock")
    mSec++

    if (gMec === 100) {
        gMec = 0
        gSec += 1
    }
    if (gSec === 60) {
        gSec = 0
        gMin += 1
    }

    strHtml += `${gMin}:${gSec}:0${gMec}`
    elClock.innerHTML = strHtml
}