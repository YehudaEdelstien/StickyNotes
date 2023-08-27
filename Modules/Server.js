import { database, Reply } from "./DB.js";

export function getRequest(request) {
    request = JSON.parse(request);
    switch (request.method) {
        case "GET":
            return handleGetRequest(request.url);
        case "POST":
            return handlePostRequest(request.url, request.data);
        case "PUT":
            return handlePutRequest(request.url, request.data);
        case "DELETE":
            return handleDeleteRequest(request.url, request.data)
        default:
            console.error(`${request.method} is an invalid request method`)
            return null;
    }
}

function handleGetRequest(url) {
    if (url === "all") {
        return database.getFullDB();
    } else {
        return database.getDBUser(url);
    }
}
//  add
function handlePostRequest(url, data) {
    if (url === "user") {
        return database.addUser(data);
    } else {
        return database.addDBItem(url, data);
    }
}
//  replace
function handlePutRequest(url, data) {
    if (url === "user") {
        return new Reply();
    } else {
        return database.setDBItem(url, data);
    }
}

function handleDeleteRequest(url, data) {
    if (url === "all") {
        return clearDB();
    } else if (url === "user") {
        return database.removeUser(data);
    } else {
        return database.deleteDBItem(url, data);
    }
}

// /*
// request
// {
//     "method": "GET, POST, PUT, DELETE";
//     "URL" : "all, user, username";
//     "body" : {message};
// }

// reply
// {
//     "status": "200 ok, 404 not found";
//     "body": {message};
// }
// */

// function testFunction() {
//     const myRequest = new Request(
//         "POST",
//         "user",
//          new User("my name", 098765)
        
//     )

//     console.log(getRequest(JSON.stringify(myRequest)));
//     console.log(Object.entries(localStorage))
// }
// testFunction()

// function testFunction2() {
//     const myRequest = new Request(
//         "POST",
//         "my name",
//          new Task("foo", "green", "first one")
        
//     )

//     console.log(1, getRequest(JSON.stringify(myRequest)));
// }
// testFunction2()

// function testFunction3() {
//     const myRequest = new Request(
//         "PUT",
//         "my name",
//          new Task("foo", "blou", "first one")
        
//     )

//     console.log(2, getRequest(JSON.stringify(myRequest)));
// }
// testFunction3()
// function testFunction4() {
//     const myRequest = new Request(
//         "POST",
//         "my name",
//          new Task("foo", "blou", "second one")
        
//     )

//     console.log(3,  getRequest(JSON.stringify(myRequest)));
// }
// testFunction4()

// function testFunction5() {
//     const myRequest = new Request(
//         "DELETE",
//         "my name",
//          new Task("foo", "blou", "first one")
        
//     )

//     console.log(4,  getRequest(JSON.stringify(myRequest)));
// }
// testFunction5()

// function testFunction6() {
//     const myRequest = new Request(
//         "DELETE",
//         "user",
//          new User("my name", 098765)
        
//     )

//     console.log(5, getRequest(JSON.stringify(myRequest)));

// }
// testFunction6()


