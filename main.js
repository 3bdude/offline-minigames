document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("mouseover", () => btn.classList.add("hover"));
    btn.addEventListener("mouseout", () => btn.classList.remove("hover"));
  });
});
