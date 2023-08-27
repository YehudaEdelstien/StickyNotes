import { FXMLhttpRequest } from "./Modules/Network.js";
import { initializeBoard } from "./notes.js";

export const app = {
    main: undefined,
    currentUser: undefined,

    init() { // if there is a user logged in, immidietly load the boards
        app.main = document.getElementById("app");


        let pageToLoad = "login";

        if (app.getCurrentUser()) {
            pageToLoad = "main"
        }

        app.main.append(document.getElementById(pageToLoad).content.cloneNode(true));
        history.replaceState({}, '', `#${pageToLoad}`);

        if (pageToLoad === "main") {
            initializeBoard();
        }

        app.refreshLinks();

        window.addEventListener('popstate', app.popIn);
    },

    changePage(e) {
        e.preventDefault();
        const targetPage = e.target.getAttribute("page-target");
        app.main.innerHTML = '';
        app.main.append(document.getElementById(targetPage).content.cloneNode(true));
        history.pushState({}, targetPage, `#${targetPage}`);
        app.refreshLinks();
    },

    popIn(e) {
        let hash = location.hash.replace('#', '');
        if (hash === "main" && app.getCurrentUser() === null) {
            hash = "login"
            history.pushState({}, hash, `#${hash}`);
        }
        app.main.innerHTML = '';
        app.main.append(document.getElementById(hash).content.cloneNode(true));
        if (hash === "main") {
            initializeBoard();
        }
        app.refreshLinks();
    },

    formSubmit(e) {
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);

        const formType = e.target.getAttribute("id");
        if (formType === "login-form") {
            app.login(formProps, e);
        } else if (formType === "register-form") {
            app.register(formProps, e)
        }
    },

    login(formProps, submitEvent) { //change information so that it is recieved from db
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("GET", formProps.name)
        FXMLR.send()
        if (FXMLR.response == null) {
            return this.myAlert(submitEvent)
        }
        else if (FXMLR.response.password === formProps.password) {
            // to give the user to come in the app
            this.currentUser = formProps.name;
            app.changePage(submitEvent);
            sessionStorage.setItem("currentUser", formProps.name);
            initializeBoard();
            // let the local storage to remenber the name of the current User
        }
        else {
            return this.myAlert(submitEvent)
        }
    },

    register(formProps, submitEvent) {
        const users = this.getAllData();
        if (users.some(e => e[0] == formProps.name)) {
            app.myAlert(submitEvent);
            return;
        }

        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("POST", "user")
        FXMLR.send(formProps)
        sessionStorage.setItem("currentUser", formProps.name)
        this.currentUser = formProps.name;

        app.changePage(submitEvent);
        initializeBoard();
    },

    getCurrentUser() {
        return sessionStorage.getItem("currentUser")
    },

    deleteUser() {
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("DELETE", this.getCurrentUser());
        FXMLR.send()
    },

    addNoteData(data) {
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("POST", this.getCurrentUser());
        FXMLR.send(JSON.stringify(data))
    },

    changeNoteData(data) {
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("PUT", this.getCurrentUser());
        FXMLR.send(JSON.stringify(data))
    },

    deleteNote(note) {
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("DELETE", this.getCurrentUser());
        FXMLR.send(note)
    },

    getAllData() {
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("GET", "all");
        FXMLR.send()
        return FXMLR.response;
    },

    getUserData() {
        let FXMLR = new FXMLhttpRequest()
        FXMLR.open("GET", this.getCurrentUser());
        FXMLR.send()
        return FXMLR.response;
    },

    refreshLinks() {
        document.querySelectorAll("a").forEach((a) => {
            a.addEventListener('click', app.changePage);
        })
        document.querySelectorAll("form").forEach((form) => {
            form.addEventListener('submit', app.formSubmit);
        })

    },

    myAlert(e) {
        document.getElementById("error-messages").style.display = "block";
        e.preventDefault();
    },
}

window.addEventListener('DOMContentLoaded', app.init);