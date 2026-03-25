const stars = document.querySelectorAll(".star");
const result = document.getElementById("result");

stars.forEach(star => {
    star.addEventListener("click", () => {
        result.textContent = "You rated this " + star.dataset.value + " stars";
    });
});
