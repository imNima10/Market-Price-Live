const fields = Array.from(document.querySelectorAll(".otp"));

fields.sort((a, b) => {
    return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
});

fields.forEach((f, i) => {
    f.addEventListener("input", () => {
        f.value = f.value.replace(/[^0-9]/g, "");

        if (f.value.length === 1 && i < fields.length - 1) {
            fields[i + 1].focus();
        }
    });

    f.addEventListener("keydown", e => {
        if (e.key === "Backspace" && f.value === "" && i > 0) {
            fields[i - 1].focus();
        }
    });
});
