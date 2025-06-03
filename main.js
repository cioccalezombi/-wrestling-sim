let currentYear = 0;
let activeRoster = [];
let descartados = [];
let agentesLibres = [];

function startGame() {
  const select = document.getElementById("startYear");
  currentYear = parseInt(select.value);
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("currentYear").textContent = `Año: ${currentYear}`;

  activeRoster = wrestlers
    .filter(w => w.debut === currentYear)
    .map(w => ({
      ...w,
      level: w.level ?? 5,
      suspendido: w.suspendido ?? 0,
      victorias: w.victorias ?? 0,
      derrotas: w.derrotas ?? 0,
      victorias_anuales: {},
      derrotas_anuales: {}
    }));

  updateRoster();
}

function nextYear() {
  currentYear++;
  document.getElementById("currentYear").textContent = `Año: ${currentYear}`;

  // Reducimos suspensión
  activeRoster.forEach(w => {
    if (w.suspendido > 0) {
      w.suspendido--;
    }
  });

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

  activeRoster = activeRoster.filter(w => estaActivo(w, currentYear));

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

function obtenerFichables(year) {
  return wrestlers.filter(w =>
    w.debut === year &&
    !descartados.includes(w.nombre) &&
    !activeRoster.find(a => a.nombre === w.nombre) &&
    !agentesLibres.find(a => a.nombre === w.nombre)
  );
}

function obtenerRetiros(prevRoster, nuevoRoster) {
  const antiguos = prevRoster.map(w => w.nombre);
  const nuevos = nuevoRoster.map(w => w.nombre);
  return antiguos.filter(nombre => !nuevos.includes(nombre));
}

// Validación antes de permitir fichajes
function mostrarFichajes(fichables) {
  if (activeRoster.length < 10) {
    alert("Necesitás al menos 10 luchadores en el roster para fichar.");
    return;
  }

  let disponibles = [...fichables]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  let fichadosEsteAño = 0;

  while (disponibles.length > 0 && fichadosEsteAño < 5) {
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

    const candidatosCorte = [...activeRoster]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

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
    agentesLibres.push(cortado);

    activeRoster.push({
      ...elegido,
      level: elegido.level ?? 5,
      suspendido: 0,
      victorias: 0,
      derrotas: 0,
      victorias_anuales: {},
      derrotas_anuales: {}
    });

    alert(`${elegido.nombre} fue fichado, ${cortado.nombre} fue cortado.`);
    disponibles.splice(indexElegido, 1);
    fichadosEsteAño++;
  }

  disponibles.forEach(w => {
    if (!activeRoster.includes(w)) {
      descartados.push(w.nombre);
    }
  });

  updateRoster();
}

function generarPrimeraSemana() {
  const elegibles = activeRoster.filter(w => w.suspendido === 0);

  if (elegibles.length < 16) {
    alert("No hay suficientes luchadores elegibles para el Battle Royale.");
    return;
  }

  const participantes = [...elegibles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 16);

  const carteleraDiv = document.getElementById("cartelera");
  carteleraDiv.innerHTML = `
    <h3>🔥 Cartelera Semana 1</h3>
    <p><strong>Main Event:</strong> Battle Royale con 16 participantes</p>
    <div id="battleRoyaleControles"></div>
  `;

  setTimeout(() => {
    iniciarBattleRoyale(participantes);
  }, 100);
}

// Dentro de iniciarBattleRoyale:

f// ...todo tu código anterior se mantiene igual hasta el final del Battle Royale...

function iniciarBattleRoyale(participantes) {
  let vivos = [...participantes];
  let eliminados = [];

  const resultadoDiv = document.getElementById("resultadoCombate");
  resultadoDiv.innerHTML = ""; // Limpiar resultados anteriores

  const lista = document.createElement("ul");
  lista.id = "listaBR";
  participantes.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.nombre;
    li.dataset.nombre = p.nombre;
    lista.appendChild(li);
  });
  resultadoDiv.appendChild(lista);

  const mensaje = document.createElement("p");
  mensaje.id = "mensajeBR";
  resultadoDiv.appendChild(mensaje);

  const logEliminaciones = document.createElement("div");
  logEliminaciones.id = "logEliminaciones";
  logEliminaciones.innerHTML = "<h4>Eliminaciones:</h4><ul id='listaEliminados'></ul>";
  resultadoDiv.appendChild(logEliminaciones);

  const botonera = document.createElement("div");
  botonera.id = "botoneraBR";
  resultadoDiv.appendChild(botonera);

  function actualizarLista() {
    document.querySelectorAll("#listaBR li").forEach(li => {
      const nombre = li.dataset.nombre;
      if (eliminados.find(e => e.nombre === nombre)) {
        li.innerHTML = `<s>${nombre} ❌</s>`;
      } else {
        li.textContent = nombre;
      }
    });
  }

  function siguienteRonda() {
    if (vivos.length === 1) {
      const ganador = vivos[0];
      ganador.level += 2;
      mensaje.innerHTML += `<br>💪 ${ganador.nombre} gana +2 LEVEL por su victoria.`;
      botonera.innerHTML = "";

      // Pasamos automáticamente a la generación de la semana siguiente
      setTimeout(() => {
        mensaje.innerHTML += "<br><br>✅ ¡Avanzando a los shows semanales!";
        setTimeout(() => {
          generarSemana();
        }, 1500);
      }, 2000);
      return;
    }

    const opciones = [...vivos]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    mensaje.innerHTML = `🧠 Elegí a quién eliminar:`;
    botonera.innerHTML = "";

    opciones.forEach(eliminado => {
      const verdugo = opciones.find(o => o !== eliminado);
      const btn = document.createElement("button");
      btn.textContent = eliminado.nombre;
      btn.onclick = () => {
        vivos = vivos.filter(w => w.nombre !== eliminado.nombre);
        eliminados.push(eliminado);
        const li = document.createElement("li");
        li.textContent = `${eliminado.nombre} fue eliminado por ${verdugo.nombre}`;
        document.getElementById("listaEliminados").appendChild(li);
        actualizarLista();

        if (vivos.length > 1) {
          setTimeout(() => {
            const indexAuto = Math.floor(Math.random() * vivos.length);
            const autoEliminado = vivos.splice(indexAuto, 1)[0];
            eliminados.push(autoEliminado);
            const posiblesVerdugos = vivos.filter(w => w !== autoEliminado);
            const verdugoAuto = posiblesVerdugos[Math.floor(Math.random() * posiblesVerdugos.length)];
            const liAuto = document.createElement("li");
            liAuto.textContent = `${autoEliminado.nombre} fue eliminado por ${verdugoAuto.nombre}`;
            document.getElementById("listaEliminados").appendChild(liAuto);
            actualizarLista();

            setTimeout(siguienteRonda, 1500);
          }, 1000);
        } else {
          setTimeout(siguienteRonda, 1000);
        }
      };
      botonera.appendChild(btn);
    });
  }

  siguienteRonda();
}

// NUEVA FUNCIÓN: Generación de shows semanales post-Battle Royale
function generarSemana() {
  const carteleraDiv = document.getElementById("cartelera");
  const elegibles = activeRoster.filter(w => w.suspendido === 0);
  const shows = [];

  for (let i = 1; i <= 4; i++) {
    const combates = [];
    const luchadoresDisponibles = [...elegibles].sort(() => Math.random() - 0.5);
    let especialesRestantes = 1;

    while (combates.length < 5 && luchadoresDisponibles.length > 1) {
      let tipo = "1 vs 1";
      let participantes = [];

      if (especialesRestantes > 0 && luchadoresDisponibles.length >= 3 && Math.random() < 0.3) {
        tipo = Math.random() < 0.5 ? "Triple Threat" : "Fatal 4-Way";
        const count = tipo === "Triple Threat" ? 3 : 4;
        participantes = luchadoresDisponibles.splice(0, count);
        especialesRestantes--;
      } else {
        participantes = luchadoresDisponibles.splice(0, 2);
      }

      combates.push({
        tipo,
        luchadores: participantes
      });
    }

    shows.push({ numero: i, combates });
  }

  // Mostrar en cartelera
  carteleraDiv.innerHTML += `<h3>📺 Shows Semanales</h3>`;
  shows.forEach(show => {
    carteleraDiv.innerHTML += `<h4>Show ${show.numero}</h4>`;
    show.combates.forEach((combate, index) => {
      const nombres = combate.luchadores.map(l => l.nombre).join(" vs ");
      carteleraDiv.innerHTML += `<p>Combate ${index + 1} (${combate.tipo}): ${nombres}</p>`;
    });
  });
}
