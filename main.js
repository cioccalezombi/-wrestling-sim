let currentYear = 0;
let activeRoster = [];
let descartados = [];
function startGame() {
  const select = document.getElementById("startYear");
  currentYear = parseInt(select.value);
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("currentYear").textContent = `Año: ${currentYear}`;

  // Solo agregamos los que debutan este año al empezar
  activeRoster = wrestlers.filter(w => w.debut === currentYear);
  updateRoster();
}

function nextYear() {
  currentYear++;
  document.getElementById("currentYear").textContent = `Año: ${currentYear}`;

  const prevRoster = [...activeRoster];
  updateRoster();

  const retiros = obtenerRetiros(prevRoster, activeRoster);
  if (retiros.length > 0) {
    alert("Se retiraron: " + retiros.join(", "));
  }

  const fichables = obtenerFichables(currentYear);
  if (fichables.length > 0) {
    mostrarFichajes(fichables);
  }
}

function updateRoster() {
  const rosterDiv = document.getElementById("roster");
  rosterDiv.innerHTML = "";

  if (activeRoster.length === 0) {
    rosterDiv.innerHTML = "<p>No hay luchadores activos este año.</p>";
    return;
  }

  // Filtrar los que siguen activos (no retirados por edad o carrera)
  const activos = activeRoster.filter(w => estaActivo(w, currentYear));
  activeRoster = activos;

  activos.forEach(w => {
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

function obtenerFichables(year) {
  return wrestlers.filter(w => w.debut === year);
}

function obtenerRetiros(prevRoster, nuevoRoster) {
  const antiguos = prevRoster.map(w => w.nombre);
  const nuevos = nuevoRoster.map(w => w.nombre);
  return antiguos.filter(nombre => !nuevos.includes(nombre));
}

function mostrarFichajes(fichables) {
let disponibles = [...fichables]
  .sort(() => Math.random() - 0.5)
  .slice(0, 10);
  let fichadosEsteAño = 0;

  while (disponibles.length > 0 && fichadosEsteAño < 5) {
    // Armar lista numerada
    const lista = disponibles
      .map((w, i) => `${i + 1}. ${w.nombre}`)
      .join("\n");

    const entrada = prompt(
      `Luchadores disponibles para fichar (${5 - fichadosEsteAño} fichajes restantes):\n\n` +
      lista +
      "\n\nEscribí el número del luchador a fichar (o dejá vacío para terminar):"
    );

    if (!entrada) break;

    const indexElegido = parseInt(entrada) - 1;
    if (isNaN(indexElegido) || indexElegido < 0 || indexElegido >= disponibles.length) {
      alert("Número inválido.");
      continue;
    }

    const elegido = disponibles[indexElegido];

    // Lista numerada para cortar
   // Elegir 10 luchadores aleatorios del roster para mostrar como posibles cortes
const candidatosCorte = [...activeRoster]
  .sort(() => Math.random() - 0.5) // Mezclar el array
  .slice(0, 10); // Tomar los primeros 10

const corteLista = candidatosCorte
  .map((w, i) => `${i + 1}. ${w.nombre}`)
  .join("\n");

const corteEntrada = prompt(
  `Vas a fichar a ${elegido.nombre}.\n\nSeleccioná a quién querés cortar del roster (escribí el número):\n\n${corteLista}`
);

const indexCorte = parseInt(corteEntrada) - 1;
if (isNaN(indexCorte) || indexCorte < 0 || indexCorte >= candidatosCorte.length) {
  alert("Número inválido para cortar.");
  continue;
}

const cortado = candidatosCorte[indexCorte];
const corteRealIndex = activeRoster.findIndex(w => w.nombre === cortado.nombre);
activeRoster.splice(corteRealIndex, 1);

    activeRoster.splice(indexCorte, 1);
    activeRoster.push(elegido);
    alert(`${elegido.nombre} fue fichado, ${cortado.nombre} fue cortado.`);

    disponibles.splice(indexElegido, 1);
    fichadosEsteAño++;
  }

  updateRoster();
}

