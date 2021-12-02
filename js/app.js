let cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Comida",
  2: "Bebidas",
  3: "Postres",
};

const btnGuardarCliente = document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;

  //Revisar si los campos están vacios;

  const camposVacios = [mesa, hora].some((campo) => campo === "");

  if (camposVacios) {
    // Verificar si ya existe una alerta
    const existeAlerta = document.querySelector(".invalid-feedback");
    if (!existeAlerta) {
      const alerta = document.createElement("div");
      alerta.classList.add("invalid-feedback", "d-block", "text-center");
      alerta.textContent = "Todos los campos son obligatorios";
      document.querySelector(".modal-body form").appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000);
    }
    return;
  }
  // Asigna los datos del formulario al cliente
  cliente = { ...cliente, mesa, hora };

  // Ocultar modal
  const modalFormulario = document.querySelector("#formulario");
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  // Mostrar las secciones
  mostrarSecciones();

  // Consumir datos de la API
  obtenerPlatillos();
}

function obtenerPlatillos() {
  const url = "http://localhost:4000/platillos";
  fetch(url)
    .then((res) => res.json())
    .then((res) => mostrarPlatillos(res))
    .catch((err) => console.log(err));
}

function mostrarPlatillos(platillos) {
  const contenido = document.querySelector("#platillos .contenido");
  platillos.forEach((platillo) => {
    const row = document.createElement("div");
    row.classList.add("row", "py-3", "border-top");

    const nombre = document.createElement("div");
    nombre.classList.add("col-md-4");
    nombre.textContent = platillo.nombre;

    const precio = document.createElement("div");
    precio.classList.add("col-md-3", "fw-bold");
    precio.textContent = `$ ${platillo.precio}`;

    const categoria = document.createElement("div");
    categoria.classList.add("col-md-3");
    categoria.textContent = categorias[platillo.categoria];

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${platillo.id}`;
    inputCantidad.classList.add("form-control");

    const agregar = document.createElement("div");
    agregar.classList.add("col-md-2");
    agregar.appendChild(inputCantidad);

    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(agregar);
    contenido.appendChild(row);
  });
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll(".d-none");
  seccionesOcultas.forEach((seccion) => seccion.classList.remove("d-none"));
}
