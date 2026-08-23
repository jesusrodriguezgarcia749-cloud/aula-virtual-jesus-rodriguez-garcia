// menu.js — Menú de navegación compartido, Aula Virtual JRG
// Se agrega con: <script src="menu.js"></script> antes de </body>

(function () {
  const materiaActual = new URLSearchParams(window.location.search).get('materia') || 'bases-culinarias';

  const ENLACES = [
    { icono: '🏠', texto: 'Inicio', href: 'index.html' },
    { icono: '📖', texto: 'Compendio', href: `compendio.html?materia=${materiaActual}` },
    { icono: '✅', texto: 'Actividades (Participación)', href: 'actividades.html' },
    { icono: '🗒️', texto: 'Ensayos', href: 'ensayos.html' },
    { icono: '📝', texto: 'Examen en Línea', href: 'examen.html' },
    { icono: '📊', texto: 'Mi Progreso', href: 'mi-progreso.html' },
    { icono: '🔑', texto: 'Panel Docente', href: 'admin.html' },
  ];

  const estilos = document.createElement('style');
  estilos.textContent = `
    #jrgMenuBtn {
      position: fixed; right: 16px; z-index: 998;
      width: 42px; height: 42px; border-radius: 50%;
      background: rgba(23,20,15,0.72); backdrop-filter: blur(3px);
      border: none; color: #f2ece1; font-size: 1.3rem;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-family: Georgia, serif;
    }
    #jrgMenuOverlay {
      position: fixed; inset: 0; z-index: 999;
      background: rgba(23,20,15,0.6);
      display: none; align-items: flex-start; justify-content: flex-end;
    }
    #jrgMenuOverlay.abierto { display: flex; }
    #jrgMenuPanel {
      width: 78%; max-width: 320px; height: 100%;
      background: #201b13; border-left: 1px solid #3a3020;
      padding: 70px 0 24px; font-family: Georgia, 'Times New Roman', serif;
      display: flex; flex-direction: column;
      animation: jrgDeslizar 0.25s ease-out;
    }
    @keyframes jrgDeslizar { from { transform: translateX(100%); } to { transform: translateX(0); } }
    #jrgMenuPanel .titulo {
      color: #d99a3d; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase;
      padding: 0 24px 14px;
    }
    #jrgMenuPanel a, #jrgMenuPanel .item-proximamente {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 24px; color: #f2ece1; text-decoration: none; font-size: 1rem;
      border-left: 3px solid transparent;
    }
    #jrgMenuPanel a:active, #jrgMenuPanel a:hover { background: #2a2013; border-left-color: #d99a3d; }
    #jrgMenuPanel .item-proximamente { color: #6b6252; cursor: default; }
    #jrgMenuPanel .item-proximamente span.etq {
      margin-left: auto; font-size: 0.7rem; background: #3a3020; color: #a89f8d;
      padding: 2px 8px; border-radius: 10px;
    }
    #jrgMenuCerrar {
      position: absolute; top: 16px; right: 16px; background: none; border: none;
      color: #cfc6b6; font-size: 1.5rem; cursor: pointer;
    }
  `;
  document.head.appendChild(estilos);

  const btn = document.createElement('button');
  btn.id = 'jrgMenuBtn';
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.innerHTML = '☰';
  document.body.appendChild(btn);

  // --- Posición dinámica según la altura real del encabezado de la página ---
  // Se acerca más al encabezado (antes +12, ahora +4) y nunca baja de más de
  // 100px desde arriba, para que en encabezados muy altos (paneles de 2-3
  // líneas) el botón no quede "flotando" muy abajo en la pantalla.
  function ubicarBoton() {
    const header = document.querySelector('header');
    const alturaHeader = header ? header.getBoundingClientRect().bottom : 60;
    const top = Math.min(Math.round(alturaHeader + 4), 64);
    btn.style.top = top + 'px';
  }
  ubicarBoton();
  window.addEventListener('resize', ubicarBoton);
  window.addEventListener('load', ubicarBoton);

  const overlay = document.createElement('div');
  overlay.id = 'jrgMenuOverlay';
  const panel = document.createElement('div');
  panel.id = 'jrgMenuPanel';
  panel.style.position = 'relative';

  const cerrar = document.createElement('button');
  cerrar.id = 'jrgMenuCerrar';
  cerrar.innerHTML = '✕';
  cerrar.setAttribute('aria-label', 'Cerrar menú');
  panel.appendChild(cerrar);

  const titulo = document.createElement('div');
  titulo.className = 'titulo';
  titulo.textContent = 'Aula Virtual JRG';
  panel.appendChild(titulo);

  ENLACES.forEach((item) => {
    if (item.proximamente) {
      const div = document.createElement('div');
      div.className = 'item-proximamente';
      div.innerHTML = `${item.icono} ${item.texto} <span class="etq">Próximamente</span>`;
      panel.appendChild(div);
    } else {
      const a = document.createElement('a');
      a.href = item.href;
      a.innerHTML = `${item.icono} ${item.texto}`;
      panel.appendChild(a);
    }
  });

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  function abrirMenu() { overlay.classList.add('abierto'); }
  function cerrarMenu() { overlay.classList.remove('abierto'); }

  btn.addEventListener('click', abrirMenu);
  cerrar.addEventListener('click', cerrarMenu);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrarMenu(); });
})();
