let tag = document.getElementById("tag");
let tags = [];
let user;
let tag_div = document.getElementById("tags");
let tag_btn = document.getElementById("tag_btn");
let food = document.getElementById("food");
let hours = document.getElementById("hours");
let title = document.getElementById("title");
let body = document.getElementById("body");
let img = document.getElementById("img");
let image = new FormData();
let file;
function check(string){
    if (string.length > 0) {
        return true
    }
    return false
};




img.addEventListener("change", (e) => {
    file = e.target.files[0];
})

const addDream = () => {
    if (!check(title.value) && !check(body.value) && !check(hours.value) && !check(food.value)) {
        alert("One of the fields are empty.")
        return;
    }
    if (!file) {
        file = "none";
    }
    title.value = title.value.trim();
    const data = {
        title: title.value,
        body: body.value,
        hours: hours.value,
        food: food.value,
        tags: tags,
        likes: 0,
        user: user
    }
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch("/add", send_data)
    .then(res => res.json())
    let form = new FormData();
    form.append("f", file)
    console.log(file)
    const sd = {
        method: "POST",
        body: form
    };
    fetch("/img", sd)
    .then(res => res.json())
    .then(function(json) {
        if (json.status) {
            alert("Dream Logged. Sending you back to home page.");
            window.location.href = "/main";
        }
    })
}

let cookie = document.cookie;
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
            tags.splice(tags.indexOf(e.target.parentElement.innerText), 1)
        }
    }
}

const add_tag = () => {
    let message = tag.value;
    if (!check(message, false)) {
        return;
    }
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div style="color: black; margin-left: 1vw; min-height: 8.6vh;" class="alert alert-primary alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    if (tags.length == 5) {
        alert("5 tags is the maximum amount.");
        return;
    }
    tag_div.append(wrapper)
    tags.push(tag.value)
    tag.value = "";
    console.log(tags)
}


document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && document.activeElement == tag) {
        add_tag();
    }
})

tag_btn.onclick = () => {
    add_tag();
}


document.getElementById("logout").onclick = () => {
    alert('Signing you out.')
    document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });
    window.location.href = '/';
}
