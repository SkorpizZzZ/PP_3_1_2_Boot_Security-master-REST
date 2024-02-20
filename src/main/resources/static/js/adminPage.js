const adminUrl = new URL("http://localhost:8080/api/v1/admin")
const currentUserUrl = new URL("http://localhost:8080/api/v1/admin/principal")
const windowInnerWidth = document.documentElement.clientWidth;
const scrollbarWidth = parseInt(window.innerWidth) - parseInt(document.documentElement.clientWidth);
const bodyElementHTML = document.querySelector("body");
const modalBackground = document.querySelector(".modalBackground");
const modalClose = document.querySelector(".modalClose");
const modalActive = document.querySelector(".modalActive");
let elemNavUsername = document.querySelector(".wrapper nav ul li:first-child")
let elemNavRole = elemNavUsername.nextElementSibling
let editModal = document.querySelector("#editForm")
let addForm = document.querySelector("#addForm")
let editSubmitHandler;
let deleteSubmitHandler;
const infoBtn = document.getElementById("infoBtn")
const addUserBtn = document.getElementById("addUserBtn")
const adminBtn = document.getElementById("adminBtn")
const userBtn = document.getElementById("userBtn")
const originalInfoBtnStyles = {
    backgroundColor: infoBtn.style.backgroundColor,
    border: infoBtn.style.border,
    color: infoBtn.style.color
};

const originalUserBtnStyles = {
    backgroundColor: userBtn.style.backgroundColor,
    border: userBtn.style.border,
    color: userBtn.style.color
};




async function currentUserInfo() {
    try {
        let response = await fetch(currentUserUrl)
        let user = await response.json()
        let elemTbody = document.querySelector("#currentUserTable tbody")
        elemTbody.innerHTML = ""
        let {id, username, firstName, lastName, email, roles} = user;
        let rolesRow = roles.map(role => role.name.replace('ROLE_', ''))

        elemNavUsername.innerHTML = username
        elemNavUsername.className = "on"
        elemNavRole.innerHTML = `with roles: ${rolesRow}`

        let row = {
            id,
            username,
            firstName,
            lastName,
            email,
            rolesRow
        }
        let tr = document.createElement("tr")
        let tdList = []
        for (let j = 0; j < 6; j++) {
            let td = document.createElement("td")
            tdList.push(td)
        }
        for (let j = 0; j < tdList.length; j++) {
            tdList[j].append(Object.values(row)[j])
        }
        tr.append(...tdList)
        elemTbody.append(tr)
    } catch (err) {
        alert(err)
    }
}

currentUserInfo()

// Заполнение таблицы
async function fillGraphs() {
    try {
        let response = await fetch(adminUrl)
        let table = await response.json()
        let elemTbody = document.querySelector("#table tbody")
        elemTbody.innerHTML = ""
        for (let i = 0; i < table.length; i++) {
            let {id, username, firstName, lastName, email, roles} = table[i];
            let rolesRow = roles.map(role => role.name.replace('ROLE_', ''))
            let row = {
                id,
                username,
                firstName,
                lastName,
                email,
                rolesRow
            }
            let tr = document.createElement("tr")
            let tdList = []
            for (let j = 0; j < 8; j++) {
                let td = document.createElement("td")
                tdList.push(td)
            }

            for (let j = 0; j < tdList.length - 2; j++) {
                tdList[j].append(Object.values(row)[j])
            }
            tdList[6].append(createButton("Edit", "editButton", row.id))
            tdList[7].append(createButton("Delete", "deleteButton", row.id))
            tr.append(...tdList)
            elemTbody.append(tr)
        }
    } catch (err) {
        alert(err)
    }
}

// Создание кнопки
function createButton(text, className, id) {
    let Button = document.createElement("button")
    Button.append(text)
    Button.classList.add(className)
    Button.dataset.action = (className === "editButton") ? "editUser" : "deleteUser";
    return Button
}

class Body {
    constructor(elem) {
        elem.onclick = this.onClick.bind(this)
    }

    editUser(id) {
        modalBackground.style.display = "block";
        if (windowInnerWidth >= 1366) {
            bodyMargin();
        }
        modalActive.style.left = "calc(50% - " + (175 - scrollbarWidth / 2) + "px)";
        editModalWindow(id)
    }

    deleteUser(id) {
        modalBackground.style.display = "block";
        if (windowInnerWidth >= 1366) {
            bodyMargin();
        }
        modalActive.style.left = "calc(50% - " + (175 - scrollbarWidth / 2) + "px)";
        deleteModalWindow(id)
    }

    onClick(event) {
        let id = event.target.closest("tr").firstChild.textContent
        let action = event.target.dataset.action
        if (action) {
            this[action](id)
        }
    }
}

//Заполнение формы EDIT в модальном окне
async function editModalWindow(id) {
    let userURL = new URL(`/api/v1/admin/${id}`, adminUrl)
    editSubmitHandler = editSubmit(userURL)
    console.log("вызов едит")
    document.querySelector(".modal-header h3").innerHTML = "Edit user"
    let submit = document.querySelector('#editForm input[type=\"submit\"]')
    submit.value = "Edit"
    submit.classList = "editButton"

    let inputs = editModal.querySelectorAll("input");
    for (let input of inputs) {
        input.disabled = false
    }

    inputs[0].disabled = true

    editModal.action = userURL
    let user = await findUserById(id)
    editModal.id.value = user.id
    editModal.username.value = user.username
    editModal.firstName.value = user.firstName
    editModal.lastName.value = user.lastName
    editModal.email.value = user.email
    editModal.password.value = user.password
    editModal.removeEventListener("submit", deleteSubmitHandler)
    editModal.addEventListener("submit", editSubmitHandler, {once: true});
}

//Заполнение формы DELETE в модальном окне
async function deleteModalWindow(id) {
    let userURL = new URL(`/api/v1/admin/${id}`, adminUrl)
    deleteSubmitHandler = deleteSubmit(userURL)
    console.log("вызов делит")
    document.querySelector(".modal-header h3").innerHTML = "Delete user"
    let submit = document.querySelector('#editForm input[type=\"submit\"]')
    submit.value = "Delete"
    submit.classList = "deleteButton"

    let inputs = editModal.querySelectorAll("input")
    for (let input of inputs) {
        input.disabled = true
    }

    inputs[inputs.length - 1].disabled = false


    editModal.action = userURL
    let user = await findUserById(id)
    editModal.id.value = user.id
    editModal.username.value = user.username
    editModal.firstName.value = user.firstName
    editModal.lastName.value = user.lastName
    editModal.email.value = user.email
    editModal.password.value = user.password
    editModal.removeEventListener("submit", editSubmitHandler)
    editModal.addEventListener("submit", deleteSubmitHandler, {once: true});
}


function addUser() {
    addForm.addEventListener("submit", ev => {
        ev.preventDefault();
        let selectedRoles = [];
        for (let i = 0; i < addForm.roles.options.length; i++) {
            if (addForm.roles.options[i].selected) selectedRoles.push({
                id: addForm.roles.options[i].value,
                name: "ROLE_" + addForm.roles.options[i].text
            });
        }
        fetch(adminUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // id: addForm.id.value,
                username: document.getElementById("usernameAdd").value,
                firstName: document.getElementById("firstNameAdd").value,
                lastName: document.getElementById("lastNameAdd").value,
                email: document.getElementById("emailAdd").value,
                password: document.getElementById("passwordAdd").value,
                roles: selectedRoles
            })
        }).then(() => {
            addForm.reset()
            fillGraphs();
            document.getElementById("addUser").style.display = "none"
            document.getElementById("info").style.display = "block"

        });
    });
}

addUser()

function editSubmit(userURL) {
    return function (ev) {
        ev.preventDefault();
        let selectedRoles = [];
        for (let i = 0; i < editModal.roles.options.length; i++) {
            if (editModal.roles.options[i].selected) selectedRoles.push({
                id: editModal.roles.options[i].value,
                name: "ROLE_" + editModal.roles.options[i].text
            });
        }
        fetch(userURL, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editModal.id.value,
                username: editModal.username.value,
                firstName: editModal.firstName.value,
                lastName: editModal.lastName.value,
                email: editModal.email.value,
                password: editModal.password.value,
                roles: selectedRoles
            })
        }).then(() => {
            modalBackground.style.display = "none";
            fillGraphs();
            currentUserInfo()
        });
    }
}

function deleteSubmit(userURL) {
    return function (ev) {
        ev.preventDefault();
        fetch(userURL, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            modalBackground.style.display = "none";
            fillGraphs();
        });
    }
}

//Поиск пользователя
async function findUserById(id) {
    try {
        let url = new URL(`/api/v1/admin/${id}`, adminUrl)
        let user = await fetch(url)
        return await user.json()
    } catch (e) {
        alert(e)
    }
}


function bodyMargin() {
    bodyElementHTML.style.marginRight = "-" + scrollbarWidth + "px";
}

modalClose.addEventListener("click", function () {
    modalBackground.style.display = "none";
    if (windowInnerWidth >= 1366) {
        bodyMargin();
    }
    editModal.removeEventListener("submit", editSubmitHandler);
    editModal.removeEventListener("submit", deleteSubmitHandler);
});

modalBackground.addEventListener("click", function (event) {
    if (event.target === modalBackground) {
        modalBackground.style.display = "none";
        if (windowInnerWidth >= 1366) {
            bodyMargin();
        }
        editModal.removeEventListener("submit", editSubmitHandler);
        editModal.removeEventListener("submit", deleteSubmitHandler);
    }
});

addUserBtn.addEventListener("click", function () {
    document.getElementById("info").style.display = "none"
    document.getElementById("addUser").style.display = "block"
    addUserBtn.style.backgroundColor = "white"
    addUserBtn.style.border = "solid"
    addUserBtn.style.borderWidth = "1px"
    addUserBtn.style.borderColor = "rgba(0, 0, 0, 0.175)"
    addUserBtn.style.color = "black"
    infoBtn.style.backgroundColor = "rgb(233, 236, 239)"
    infoBtn.style.border = "none"
    infoBtn.style.color = "#0d6efd"
});

infoBtn.addEventListener("click", function () {
    document.getElementById("addUser").style.display = "none"
    document.getElementById("info").style.display = "block"
    infoBtn.style.backgroundColor = originalInfoBtnStyles.backgroundColor
    infoBtn.style.border = originalInfoBtnStyles.border
    infoBtn.style.color = originalInfoBtnStyles.color
    addUserBtn.style.backgroundColor = "rgb(233, 236, 239)"
    addUserBtn.style.border = "none"
    addUserBtn.style.color = "#0d6efd"
});

adminBtn.addEventListener("click", function () {
    document.getElementById("currentUser").style.display = "none"
    document.getElementById("adminPanel").style.display = "block"
    // userBtn.style.border = originalUserBtnStyles.border
    userBtn.style.backgroundColor = originalUserBtnStyles.backgroundColor
    userBtn.style.color = originalUserBtnStyles.color
    adminBtn.style.backgroundColor = "#0d6efd"
    adminBtn.style.border = "solid"
    adminBtn.style.borderWidth = "1px"
    adminBtn.style.color = "white"

});

userBtn.addEventListener("click", function () {
    document.getElementById("adminPanel").style.display = "none"
    document.getElementById("currentUser").style.display = "block"
    adminBtn.style.border = "none"
    adminBtn.style.backgroundColor = "white"
    adminBtn.style.color = "#0d6efd"
    userBtn.style.backgroundColor = "#0d6efd"
    userBtn.style.border = "none"
    userBtn.style.color = "rgb(233, 236, 239)"
});


fillGraphs();
new Body(bodyElementHTML)









