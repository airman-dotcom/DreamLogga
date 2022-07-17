let user;
let cookie = document.cookie;
let arrs;
let all = []
let keywords = []
let obj;
let keywords_div = document.getElementById("keywords");
let search = document.getElementById("search");
let search_btn = document.getElementById("search_btn");
let dream_div = document.getElementById("dreams")

function insertDream(data) {
    if (data === {} || data == undefined){
        return;
    }
    let body = data.body;
    let food = data.food;
    let hours = data.hours;
    let tags = data.tags;
    let title = data.title;
    let user = data.user;
    let img = data.image;
    let element = document.createElement("div");
    element.innerHTML = `
    <div class="card mb-3" style="color: white; max-width: 540px; background-color: #0086f5; margin: auto;">
        <div class="row g-0">
            <div style="position: relative;" class="col-md-4">
                <img style="max-height: 100%; max-width: 100%; width: auto; height: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;" src="${img}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${body}</p>
                    <p class="card-text">Hours slept: ${hours}</p>
                    <p class="card-text">Food ate: ${food}</p>
                    <p class="card-text">tags: ${tags}</p>
                    <p class="card-text">Logged by: ${user}</p>
                </div>
            </div>
        </div>
    </div>`
    dream_div.append(element);
}

function check(string, email) {
    if (string.length > 0) {
        if (email) {
            if (!string.includes("@")) {
                return false
            }
        }
        return true
    }
    return false
};


if (cookie.includes("; ")) {
    arrs = cookie.split("; ")
    for (let x = 0; x < arrs.length; x++) {
        let a = arrs[x].split("=");
        all.push(a)
    }
    for (let x = 0; x < all.length; x++) {
        if (all[x][0] == "user") {
            user = all[x][1]
        }

    }
} else if (cookie.includes("=")) {
    arrs = cookie.split("=")
    user = arrs[1]
} else {
    alert("There seems to be a mistake.")
    alert("Sending you back to main site.");
    document.location.href = "/";
}

document.getElementById("name").innerHTML = document.getElementById("name").innerHTML.replace("Bootstrap", "")

document.getElementById("name").innerHTML += "Welcome " + user + "!";

document.body.onclick = (e) => {
    if (e.target.tagName == "A" && e.target.className.includes("nav-link")) {
        if (!e.target.className.includes("active")) {
            document.querySelector("a.active").classList.remove("active")
            e.target.classList.add("active");
        }
    } else {
        if (e.target.className == "btn-close") {
            keywords.splice(keywords.indexOf(e.target.parentElement.innerText), 1)
        }
    }
}

const get_posts = () => {
    let message = search.value;
    if (check(message, false)) {
        var wrapper = document.createElement('div')
        wrapper.innerHTML = '<div style="margin-left: 1vw; min-height: 8.6vh;" class="alert alert-primary alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        if (keywords.length == 5) {
            alert("You can only enter 5 key words.");
            return;
        }
        keywords_div.append(wrapper)
        keywords.push(search.value)
        search.value = "";
        console.log(keywords)
    }
    const data = {
        tags: keywords
    }
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    fetch("/get", send_data)
    .then(res => res.json())
    .then(function(json){
        if (json.status == false) {
            alert("A mistake has occured, reload the page.")
            return
        }
        let data = json.d;
        dream_div.innerHTML = "";
        data.forEach(element => {
            insertDream(element)
        })
    })
}

search_btn.onclick = () => {
    get_posts();
}

document.getElementById("logout").onclick = () => {
    alert('Signing you out.')
    document.cookie.split(';').forEach(function (c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });
    window.location.href = '/';
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && document.activeElement == search) {
        get_posts();
    }
})

document.body.onload = () => {
    get_posts();
}