// ==UserScript==
// @name         Skoda Jira Zephyr Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Skoda Jira Zephyr Hotkeys
// @author       Maksym Kriventsev, Martin Suda, AKKA CZ
// @match        https://eportal.skoda.vwg/jira/secure/enav/*
// @match        https://portal.skoda-auto.com/jira/secure/enav/*
// @match        https://eportal.skoda.vwg/jira/projects/MODFOUR?selectedItem=com.thed.zephyr.je*
// @match        https://portal.skoda-auto.com/jira/projects/MODFOUR?selectedItem=com.thed.zephyr.je*
// @grant        none
// ==/UserScript==


(function () {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function setStatusForTestCase(statusValue) {
        let arrowDownEl = document.querySelector('.status-dropDown-Trigger');
        arrowDownEl.click();
        getElementByXpath(`//li[@data-index='${statusValue}']`).click();
    }

    function setStatusForAllSteps(statusValue) {
        setTimeout(() => document.querySelectorAll(`li[data-value='${statusValue}']`).forEach(item => { item.click() }), 500)
    }

    function calculateTimeWIP(s,f){
        console.log(f-s)
        console.log(f);

        let minutesWIP = Math.ceil((Math.abs(f-s) / 1000) / 60)

        console.log('minutes', minutesWIP);

        return `${minutesWIP}m`;
    }

    function resetTCTempVars(){
        isOnTop = true;
        timeWIPStart = null;
    }
    // let isDetail = false
    let isOnTop;
    let timeWIPStart;
    let timeWIP;

    resetTCTempVars()

    console.log('init timeWIPstart');
    console.log(timeWIPStart);


    });
    document.addEventListener('keyup', e => {
        //console.log(e);
        let nextExeEl = document.getElementById('next-execution');
        let prevExeEl = document.getElementById('previous-execution');
        let moreDescEl = document.querySelector('#see-more-desc');
        let moreCustomEl = document.querySelector('#show-content');
        let TCHeaderEl = document.querySelector('.cycle-details-wrapper-header');

        let testDetails = document.querySelector('#testDetailGridExecutionPage #unfreezedGrid');

        let inProgressButton = document.getElementById("workflowInprogress");
        let reOpenButton = document.getElementById('workflowReopen');
        let doneButton = document.getElementById("workflowDone");

        let estimatedTime = document.getElementById("estimatedTimeValue").innerHTML.split(" ");

        let path = event.path || (event.composedPath && event.composedPath());
        console.log(path.length);
        if (path.length <= 7) { //nice hardcode bro
            switch (e.key) {
                case 'ArrowRight':
                    resetTCTempVars();
                    nextExeEl.click();
                    break;
                case 'ArrowLeft':
                    resetTCTempVars();
                    prevExeEl.click();
                    break;
                case 'p': //set TC and TS PASS
                    setStatusForTestCase(0);
                    setStatusForAllSteps(1);
                    break;
                case 'i': //set TC WIP
                    setStatusForTestCase(2);
                    break;
                case 'b': //set TC and TS PASS
                    setStatusForTestCase(3);
                    break;
                case 'u': //set TC UNEXECUTED
                    setStatusForTestCase(5);
                    // setTimeout(() => { setStatusForAllSteps(-1) }, 500)
                    setStatusForAllSteps(-1);
                    break;
                case 'm': //click "more" for Description and Custom fields
                    moreCustomEl.click();
                    moreDescEl.click();
                    break;
                case 'd': //show TC's TS
                    if (isOnTop) {
                        testDetails.scrollIntoView();
                        isOnTop = false;
                    }
                    else {
                        TCHeaderEl.scrollIntoView();
                        isOnTop = true;
                    }
                    break;
                case 's': //start - press InProgress and Reopen
                    inProgressButton.click();
                    reOpenButton.click();
                    timeWIPStart = new Date(); // for now
                    console.log(timeWIPStart);
                    break;
                case 'f': //finish - press Done
                    doneButton.click()
                    setTimeout(500)

                    if (timeWIPStart == null){
                        document.getElementById("setToRadio").click();
                        document.getElementById("setToTime").value = `${estimatedTime[0]}m`;
                    }
                    else {
                        timeWIP = calculateTimeWIP(timeWIPStart, new Date());
                        document.getElementById('increaseByTime').value = timeWIP;
                    }
                    debugger
                    document.getElementById('logTimeSubmit').click();
                    break;
                default:
                    console.log(e.key + ' pressed');
                // code block
            }
        }
    })
})();
