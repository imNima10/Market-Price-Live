document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailInput").value.trim();

    if (email === "") {
        alert("ایمیل را وارد کنید");
        return;
    }

    // فقط UI — بدون بک‌اند
    localStorage.setItem("pendingEmail", email);

    window.location.href = "otp.html";
});
