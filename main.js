// main.js

let currentYear = 0;
let activeRoster = [];

function startGame() {
  const select = document.getElementById("startYear");
  currentYear = parseInt(select.value);
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("currentYear").textContent = `Año: ${currentYear}`;
  updateRoster();
}

function nextYear() {
  currentYear++;
  document.getElementById("currentYear").textContent = `Año: ${currentYear}`;
  updateRoster();
}

function updateRoster() {
  // Filtrar luchadores activos en el año actual
  activeRoster = wrestlers.filter(w => estaActivo(w, currentYear));
  const rosterDiv = document.getElementById("roster");
  rosterDiv.innerHTML = "";

  if (activeRoster.length === 0) {
    rosterDiv.innerHTML = "<p>No hay luchadores activos este año.</p>";
    return;
  }

  activeRoster.forEach(w => {
    const div = document.createElement("div");
    div.className = "wrestler";
    const edad = currentYear - w.año_nacimiento;
    div.textContent = `${w.nombre} (Edad: ${edad} años)`;
    rosterDiv.appendChild(div);
  });
}


function estaActivo(wrestler, year) {
  const edad = year - wrestler.año_nacimiento;
  const añosDeCarrera = year - wrestler.debut;
  return edad < 50 && añosDeCarrera < 20 && wrestler.debut <= year;
}
