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

    // Funcion que detecta la cantidad y el platillo que se está agregando
    inputCantidad.onchange = () => {
      const cantidad = parseInt(inputCantidad.value);
      agregarPlatillo({ ...platillo, cantidad });
    };

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

function agregarPlatillo(producto) {
  if (producto.cantidad > 0) {
    // Revisar que el pedido no esté repetido
    if (cliente.pedido.some((item) => item.id === producto.id)) {
      cliente.pedido.map((item) => {
        if (item.id === producto.id) {
          return (item.cantidad = producto.cantidad);
        }
      });
    } else {
      cliente.pedido = [...cliente.pedido, producto];
    }
    console.log(cliente.pedido);
  } else {
    const resultado = cliente.pedido.filter((item) => item.id !== producto.id);
    cliente.pedido = [...resultado];
  }
  limpiarHTML();
  actualizarResumen();
}

function actualizarResumen() {
  const contenido = document.querySelector("#resumen .contenido");
  const resumen = document.createElement("div");
  resumen.classList.add("col-md-6", "py-5", "card", "px-3", "shadow");
  //Imprimir mesa
  const mesa = document.createElement("p");
  mesa.textContent = "Mesa: ";
  mesa.classList.add("fw-bold");

  const mesaSpan = document.createElement("span");
  mesaSpan.classList.add("fw-normal");
  mesaSpan.textContent = cliente.mesa;
  //Imprimir hora
  const hora = document.createElement("p");
  hora.textContent = "Hora: ";
  hora.classList.add("fw-bold");

  const horaSpan = document.createElement("span");
  horaSpan.classList.add("fw-normal");
  horaSpan.textContent = cliente.hora;

  const heading = document.createElement("h3");
  heading.classList.add("my-4");
  heading.textContent = "Platillos consumidos";

  // Iterar sobre los pedidos para mostralos en pantalla
  const grupo = document.createElement("ul");
  grupo.classList.add("list-group");

  const { pedido } = cliente;
  pedido.forEach((articulo) => {
    const { nombre, cantidad, precio, id } = articulo;

    const lista = document.createElement("li");
    lista.classList.add("list-group-item");

    const nombreEl = document.createElement("h4");
    nombreEl.classList.add("my-4");
    nombreEl.textContent = nombre;
    // Cantidad del articulo
    const cantidadEl = document.createElement("p");
    cantidadEl.classList.add("fw-bold");
    cantidadEl.textContent = "Cantidad: ";

    const cantidadValor = document.createElement("span");
    cantidadValor.classList.add("fw-normal");
    cantidadValor.textContent = cantidad;

    // precio del articulo
    const precioEl = document.createElement("p");
    precioEl.classList.add("fw-bold");
    precioEl.textContent = "Precio: $";

    const precioValor = document.createElement("span");
    precioValor.classList.add("fw-normal");
    precioValor.textContent = precio;

    // subtotal del articulo
    const subtotalEl = document.createElement("p");
    subtotalEl.classList.add("fw-bold");
    subtotalEl.textContent = "Subtotal: $";

    const subtotalValor = document.createElement("span");
    subtotalValor.classList.add("fw-normal");
    subtotalValor.textContent = calcularSubtotal(precio, cantidad);

    // Botón de borrar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.textContent = "Eliminar pedido";

    // Agregar valores a sus contenedores
    cantidadEl.appendChild(cantidadValor);
    precioEl.appendChild(precioValor);
    subtotalEl.appendChild(subtotalValor);

    // funcion para eliminar producto
    btnEliminar.onclick = () => {
      eliminarProducto(id);
    };

    // Agregar elementos al Li
    lista.appendChild(nombreEl);
    lista.appendChild(cantidadEl);
    lista.appendChild(precioEl);
    lista.appendChild(subtotalEl);
    lista.appendChild(btnEliminar);

    // Agregar lista al grupo principal
    grupo.appendChild(lista);
  });

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(heading);
  resumen.appendChild(grupo);

  contenido.appendChild(resumen);
}

function limpiarHTML() {
  const contenido = document.querySelector("#resumen .contenido");

  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

function calcularSubtotal(precio, cantidad) {
  return precio * cantidad;
}

function eliminarProducto(id) {
  const { pedido } = cliente;

  const resultado = pedido.filter((item) => item.id !== id);

  cliente.pedido = [...resultado];

  // Limpiar html
  limpiarHTML();
  actualizarResumen();
}
