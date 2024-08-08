// ==UserScript==
// @name         DuoAG Basic
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create a GUI for handling tokens and executing code, free for all, any copy accepted
// @author       Interstellar
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a style for the GUI
    const style = document.createElement('style');
    style.innerHTML = `
        #customGUI {
            border: 1px solid #e8e4e4;
            padding: 20px;
            width: 600px;
            height: 400px;
            overflow-y: auto;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            z-index: 10000;
            border-radius: 10px;
        }
        #displayNumber {
            width: 100%;
            height: 50px;
            font-size: 20px;
            text-align: center;
            margin-bottom: 10px;
            border: 1px solid #e8e4e4;
            border-radius: 10px;
            padding: 10px;
            overflow: hidden;
            word-wrap: break-word;
        }
        .inputRow {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .numberInput {
            flex-grow: 1;
            border: 1px solid #e8e4e4;
            border-radius: 5px;
            padding: 5px;
            margin-right: 5px;
        }
        .addButton {
            border: 1px solid #e8e4e4;
            border-radius: 5px;
            background-color: #0000FF;
            color: white;
            padding: 5px 10px;
            cursor: pointer;
        }
        .numberButton {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #e8e4e4;
            border-radius: 5px;
            background-color: #f0f0f0;
            cursor: pointer;
            text-align: center;
            overflow: hidden;
            word-wrap: break-word;
        }
        .numberLabel {
            margin-right: 5px;
            font-weight: bold;
        }
        .numberButtonContainer {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .removeButton {
            margin-left: 5px;
            border: none;
            background: none;
            color: red;
            font-weight: bold;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Create the GUI container
    const guiContainer = document.createElement('div');
    guiContainer.id = 'customGUI';

    // Display area for the number extracted from M1
    const displayNumber = document.createElement('div');
    displayNumber.id = 'displayNumber';
    displayNumber.textContent = getNumberFromM1();

    // Input row with input field and add button
    const inputRow = document.createElement('div');
    inputRow.className = 'inputRow';
    const numberInput = document.createElement('input');
    numberInput.className = 'numberInput';
    numberInput.type = 'text';
    const addButton = document.createElement('div');
    addButton.className = 'addButton';
    addButton.textContent = 'Add';

    inputRow.appendChild(numberInput);
    inputRow.appendChild(addButton);

    guiContainer.appendChild(displayNumber);
    guiContainer.appendChild(inputRow);

    // Number buttons with labels
    const numberButtons = [];
    for (let i = 0; i < 3; i++) {
        const numberButtonContainer = document.createElement('div');
        numberButtonContainer.className = 'numberButtonContainer';
        const numberLabel = document.createElement('span');
        numberLabel.className = 'numberLabel';
        numberLabel.textContent = (i + 1).toString();
        const numberButton = document.createElement('div');
        numberButton.className = 'numberButton';
        numberButtons.push(numberButton);
        const removeButton = document.createElement('button');
        removeButton.className = 'removeButton';
        removeButton.textContent = 'X';
        removeButton.onclick = () => {
            numberButton.textContent = '';
            currentIndex = numberButtons.indexOf(numberButton);
        };

        numberButtonContainer.appendChild(numberLabel);
        numberButtonContainer.appendChild(numberButton);
        numberButtonContainer.appendChild(removeButton);
        guiContainer.appendChild(numberButtonContainer);
    }

    // Add the GUI to the document body
    document.body.appendChild(guiContainer);

    // Event listeners
    let currentIndex = 0;

    addButton.addEventListener('click', () => {
        if (currentIndex < 3) {
            numberButtons[currentIndex].textContent = numberInput.value;
            currentIndex++;
            numberInput.value = '';
        } else {
            alert('All slots are filled!');
        }
    });

    numberButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            if (value) {
                const code = `document.cookie='jwt_token=${value}'`;
                eval(code); // Executing the code
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        });
    });

    // Function to get the number from M1
    function getNumberFromM1() {
        const token = document.cookie
            .split(';')
            .find(cookie => cookie.includes('jwt_token'))
            ?.split('=')[1];
        return token || '';
    }
})();
