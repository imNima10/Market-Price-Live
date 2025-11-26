document.getElementById("loginForm").addEventListener("submit", function (e) {
    const email = document.getElementById("emailInput").value.trim();

    if (email === "") {
        alert("ایمیل را وارد کنید");
        return;
    }
});
