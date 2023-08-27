import { app } from "./app.js";

let board, appElement, editNoteBtn, deleteNoteBtn;

let boardElements = [];
let currentElement = undefined;

class Note {
    constructor(xPos, yPos, text = '', id) {
        this.name = id || Date.now();
        this.xPos = xPos;
        this.yPos = yPos;
        this.text = text;
        this.initializeNoteElement();
    }

    initializeNoteElement() {
        const noteElement = document.createElement("div");
        this.element = noteElement;

        noteElement.classList.add("note");

        noteElement.style.left = this.xPos + "px";
        noteElement.style.top = this.yPos + "px";
        noteElement.innerHTML = this.text;

        board.appendChild(noteElement, this.xPos, this.yPos);
        boardElements.push(this);
    }
}

export function initializeBoard() {
    getElements();
    addEventListeners();

    boardElements = [];
    boardElements.push({ element: board, xPos: 0, yPos: 0 })
    initializeNotesFromDB();
    hideNoteActions();
    centerBoard();
}

function getElements() {
    board = document.getElementById("board");
    appElement = document.getElementById("app");
    editNoteBtn = document.getElementById("editNote");
    deleteNoteBtn = document.getElementById("deleteNote");
}

function addEventListeners() {
    document.getElementById("addNote").addEventListener('click', createNewNote);
    document.getElementById("centerBoard").addEventListener('click', centerBoard);
    document.getElementById("logOut").addEventListener('click', logOut);
    document.addEventListener('mousedown', click);
    document.addEventListener('mouseover', mouseOver)
    document.addEventListener('wheel', scrollBoard)
}

function initializeNotesFromDB() {
    const noteArray = app.getUserData().entries;
    for (const noteObj of noteArray) {
        new Note(noteObj.xPos, noteObj.yPos, noteObj.text, noteObj.name)
    }
}

function createNewNote(e) {
    const startingX = -board.offsetLeft;
    const startingY = -board.offsetTop;
    const startingText = "Note " + boardElements.length;
    const note = new Note(startingX, startingY, startingText);
    app.addNoteData(note);
    selectElement(e, note.element);
}

function selectElement(e, target = undefined) {
    if (target === undefined) {
        target = e.target.closest(".note") || board;
    }

    if (target.hasAttribute("contenteditable")) {
        return;
    }

    const targetObj = boardElements.find(n => n.element === target);

    if (target.classList.contains("note")) {
        board.appendChild(target);
        currentElement = target;
    } else if (currentElement) {
        currentElement = undefined;
    }

    const offset = {
        x: e.clientX - target.offsetLeft,
        y: e.clientY - target.offsetTop
    }

    document.addEventListener('mousemove', moveElement);
    document.addEventListener('mouseup', releaseElement);

    function moveElement(e) {
        const xPos = e.clientX - offset.x;
        const yPos = e.clientY - offset.y;

        target.style.left = xPos + "px";
        target.style.top = yPos + "px";

        targetObj.xPos = xPos;
        targetObj.yPos = yPos;
    }

    function releaseElement(e) {
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('mouseup', releaseElement);
        app.changeNoteData(targetObj);
    }
}

function editNote({ target }) {
    target = target.closest(".note")
    if (target == null) {
        return;
    }
    hideNoteActions()
    target.setAttribute('contenteditable', true);
    setTimeout(() => {
        target.focus();
        setEndOfContenteditable(target);
        target.addEventListener('focusout', deslectNote);
    }, 0)
}

function setEndOfContenteditable(elem) {
    let sel = window.getSelection();
    sel.selectAllChildren(elem);
    sel.collapseToEnd();
}

function deslectNote({ target }) {
    target.removeAttribute('contenteditable');
    target.removeEventListener('focusout', deslectNote);

    const targetObj = boardElements.find(n => n.element === target);
    targetObj.text = target.innerHTML
    app.changeNoteData(targetObj);
}

function deleteNote({ target }) {
    target = target.closest(".note");

    attachNoteActions(board);
    hideNoteActions();

    const targetObj = boardElements.find(n => n.element === target);
    app.deleteNote(targetObj)
    boardElements.splice(boardElements.indexOf(targetObj), 1);
    target.remove();
    console.log(boardElements)
}

function attachNoteActions(element) {
    element.append(editNoteBtn, deleteNoteBtn);
    editNoteBtn.style.display = "initial";
    deleteNoteBtn.style.display = "initial";
}

function hideNoteActions() {
    editNoteBtn.style.display = "none";
    deleteNoteBtn.style.display = "none";
}

function centerBoard() {
    const boardObj = boardElements[0];

    boardObj.xPos += (window.innerWidth / 2) - (board.offsetWidth / 2);
    boardObj.yPos += (window.innerHeight / 2) - (board.offsetHeight / 2);

    repositionBoard(boardObj.xPos, boardObj.yPos)
}

function scrollBoard({deltaY}) {
    const boardObj = boardElements[0];

    boardObj.yPos -= deltaY;

    repositionBoard(boardObj.xPos, boardObj.yPos)
}

function repositionBoard(x, y) {
    board.style.left = x + "px";
    board.style.top = y + "px";
}

function logOut(e) {
    sessionStorage.removeItem("currentUser");
    app.changePage(e);
}

function click(e) {

    if (app.getCurrentUser() == null) {
        return;
    }

    switch (e.target) {
        case editNoteBtn:
            editNote(e);
            break;
        case deleteNoteBtn:
            deleteNote(e);
            break;
        default:
            selectElement(e)
            break;
    }
}

function mouseOver({ target }) {
    target = target.closest(".note")
    if (target == null || target.hasAttribute("contenteditable")) {
        hideNoteActions();
        return;
    }
    attachNoteActions(target);
}