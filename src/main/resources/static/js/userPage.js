const currentUserUrl = new URL("http://localhost:8080/api/v1/admin/principal")
let elemNavUsername = document.querySelector(".wrapper nav ul li:first-child")
let elemNavRole = elemNavUsername.nextElementSibling




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










