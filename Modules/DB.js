class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
        this.entries = [];
    }
}

export class Reply {
    constructor(status = "404 not found", data = "") {
        this.status = status; // 200 ok, 404 not found
        this.data = data;
    }
}

class Task {
    constructor(text, color, name) {
        this.text = text;
        this.color = color;
        this.name = name;
    }
}

export const database = {
    getFullDB() {
        return new Reply("200 OK", Object.entries(localStorage));
    },

    getDBUser(url) {
        let requestedUser = localStorage.getItem(url);
        if (requestedUser === null) {
            return new Reply()
        }
        else {
            requestedUser = JSON.parse(requestedUser);
            return new Reply("200 OK", requestedUser);
        }
    },

    addUser({ name, password }) {
        let user = new User(name, password);
        localStorage.setItem(name, JSON.stringify(user))
        return new Reply("200 OK");
    },


    addDBItem(url, data) {
        let user = localStorage.getItem(url);
        data = JSON.parse(data);
        user = JSON.parse(user);
        user.entries.push(data);

        user = JSON.stringify(user);
        localStorage.setItem(url, user)
        return new Reply("200 OK")
    },

    setDBItem(url, data) {
        let user = localStorage.getItem(url);
        user = JSON.parse(user);
        data = JSON.parse(data);
        for (let i = 0; i < user.entries.length; i++) {
            if (user.entries[i].name === data.name) {
                user.entries[i] = data;
                user = JSON.stringify(user);
                localStorage.setItem(url, user)
                return new Reply("200 OK")
            }
        }
        return new Reply();
    },

    deleteDBItem(url, data) {
        let user = localStorage.getItem(url);
        user = JSON.parse(user);
        for (let i = 0; i < user.entries.length; i++) {
            console.log(77);
            if (user.entries[i].name === data.name) {
                user.entries.splice([i], 1)
                user = JSON.stringify(user);
                localStorage.setItem(url, user)
                return new Reply("200 OK");
            }
        }
        return new Reply();
    },

    clearDB() {
        localStorage.clear();
        return new Reply("200 OK");
    },


    removeUser(data) {
        localStorage.removeItem(data.name)
        return new Reply("200 OK");
    }
}
