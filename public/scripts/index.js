let uname = document.getElementById("uname");
let login_psw = document.getElementById("psw");
let login_btn = document.getElementById("btn1");
let email = document.getElementById("email");
let register_psw = document.getElementById("psw2");
let register_btn = document.getElementById("btn2");
let register_p = document.getElementById("err2");
let login_p = document.getElementById("err1")
function check(string, email){
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


register_btn.onclick = () => {
    if (check(email.value, true) && check(register_psw.value, false)) {
        const data = {
            u: email.value,
            p: register_psw.value,
            t: "register"
        };
        register_psw.value = "";
        const send_data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch("/cred", send_data)
        .then(res => res.json())
        .then(function(json){
            if (json.status){
                login_p.innerHTML = "Success! Account Created!";
                document.cookie = `user=${email.value}`;
                document.querySelector("input").value = "";
                window.location.href = "/main";
            } else {
                register_p.innerHTML = json.message;
            }
        })
    }
}

login_btn.onclick = () => {
    if (check(uname.value, false) && check(login_psw.value, false)) {
        const data = {
            u: uname.value,
            p: login_psw.value,
            t: "login"
        };
        login_psw.value = "";
        const send_data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch("/cred", send_data)
        .then(res => res.json())
        .then(function(json){
            if (json.status){
                login_p.innerHTML = "Success!";
                document.cookie = `user=${uname.value}`;
                document.querySelector("input").value = "";
                window.location.href = "/main";
            } else {
                login_p.innerHTML = json.message;
            }
        })
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (document.activeElement == uname || document.activeElement == login_psw) {
            login_btn.click()
        } else if (document.activeElement == email || document.activeElement == register_psw){
            register_btn.click()
        }
    }
})