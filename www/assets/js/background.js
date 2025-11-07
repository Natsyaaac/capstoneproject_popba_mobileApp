
const warnaBalon = ["#ff4b5c", "#ffd56b", "#6bcbee", "#9b59b6", "#2ecc71", "#f39c12"];
const jumlahBalon = 20;

for (let i = 0; i < jumlahBalon; i++) {
  let balon = document.createElement("div");
  balon.classList.add("balon");
  balon.style.left = Math.random() * 100 + "vw";
  balon.style.backgroundColor = warnaBalon[Math.floor(Math.random() * warnaBalon.length)];
  balon.style.animationDuration = 6 + Math.random() * 5 + "s";
  balon.style.animationDelay = Math.random() * 5 + "s";
  document.body.appendChild(balon);
}

