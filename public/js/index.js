const modal = document.getElementById("detailModal");
const modalClose = document.getElementById("modalClose");
const openBtns = document.querySelectorAll(".open-details");
const cards = document.querySelectorAll(".card");

openBtns.forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const card = e.target.closest(".card");
    const name = card.querySelector(".label .name").textContent;
    const price = card.querySelector(".price").textContent + " " + card.querySelector(".currency").textContent;
    const change = card.querySelector(".tag").textContent;
    modal.querySelector("#modalTitle").textContent = name;
    modal.querySelector("#modalPrice").textContent = price;
    modal.querySelector("#modalChange").textContent = change;
    modal.classList.remove("hidden");
    document.body.classList.add("dimmed");
  });
});

modalClose.addEventListener("click",()=>{
  modal.classList.add("hidden");
  document.body.classList.remove("dimmed");
});
