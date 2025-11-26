document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("otpForm");
    const otpFields = Array.from(document.querySelectorAll(".otp"));
    const otpHidden = document.getElementById("otp");

    const isRTL = getComputedStyle(document.body).direction === "rtl";
    const fields = isRTL ? otpFields.reverse() : otpFields;

    fields.forEach((field, index) => {
        field.addEventListener("input", () => {
            field.value = field.value.replace(/[^0-9]/g, "");
            if (field.value.length === 1 && index < fields.length - 1) {
                fields[index + 1].focus();
            }
        });

        field.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && field.value === "" && index > 0) {
                fields[index - 1].focus();
            }
        });

        field.addEventListener("paste", (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData("text");
            const digits = paste.replace(/\D/g, "").split("");
            digits.forEach((d, i) => {
                if (index + i < fields.length) {
                    fields[index + i].value = d;
                }
            });
            const nextIndex = index + digits.length < fields.length ? index + digits.length : fields.length - 1;
            fields[nextIndex].focus();
        });
    });

    form.addEventListener("submit", (e) => {
        const otpValue = fields.map(f => f.value).join("");
        otpHidden.value = otpValue;
    });
});
