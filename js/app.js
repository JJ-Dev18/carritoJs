const carrito = document.getElementById("carrito");
const platillos = document.getElementById("lista-platillos");
const listaPlatillos = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const contentProducts = document.getElementById("content-products");
const templateProductos = document.getElementById("template-products").content;
const fragmentProductos = document.createDocumentFragment();
cargarEventListeners();

function cargarEventListeners() {
  platillos.addEventListener("click", comprarPlatillo);
  carrito.addEventListener("click", eliminarPlatillo);
  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
  document.addEventListener("DOMContentLoaded",  () => {
    fetchData()
  });
}
const cargarProductos = (data) => {
   data.forEach(producto=> {
       templateProductos.querySelector('h4').textContent = producto.title;
       templateProductos.querySelector(".imagen-platillo").src = producto.img;
       templateProductos.querySelector('.precio span').textContent = producto.precio;

       const productos =  templateProductos.cloneNode(true)
       fragmentProductos.appendChild(productos)
   })
   contentProducts.appendChild(fragmentProductos);
//    console.log(templateProductos.content)
}
const fetchData = async () => {
    try {
          const resp = await fetch('js/api.json');
          const data = await resp.json();
          
          cargarProductos(data)
    } catch (error) {
        console.log(error)
    }

};

function comprarPlatillo(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const platillo = e.target.parentElement.parentElement;
    leerDatosPlatillo(platillo);
  }
}

function leerDatosPlatillo(platillo) {
  const infoPlatillo = {
    imagen: platillo.querySelector("img").src,
    titulo: platillo.querySelector("h4").textContent,
    precio: platillo.querySelector(".precio span").textContent,
    id: platillo.querySelector("a").getAttribute("data-id"),
  };

  insertarCarrito(infoPlatillo);
}

function insertarCarrito(platillo) {
  const row = document.createElement("tr");
  row.innerHTML = `
       <td>
           <img src="${platillo.imagen}" width=100> 
       </td> 
       <td>${platillo.titulo}</td>
       <td>${platillo.precio}</td>
       <td>
        <a href="#" class="borrar-platillo" data-id="${platillo.id}">X</a>
       </td>
    `;
  cantidadCarrito.textContent = parseInt(cantidadCarrito.textContent) + 1;
  listaPlatillos.appendChild(row);
  guardarPlatilloLocalStorage(platillo);
}

function eliminarPlatillo(e) {
  e.preventDefault();

  let platillo, platilloId;

  if (e.target.classList.contains("borrar-platillo")) {
    e.target.parentElement.parentElement.remove();
    platillo = e.target.parentElement.parentElement;
    platilloId = platillo.querySelector("a").getAttribute("data-id");
  }
  eliminarPlatilloLocalStorage(platilloId);
}

function vaciarCarrito() {
  while (listaPlatillos.firstChild) {
    listaPlatillos.removeChild(listaPlatillos.firstChild);
  }
  vaciarLocalStorage();

  return false;
}

function guardarPlatilloLocalStorage(platillo) {
  let platillos;
  let cantidad;

  platillos = obtenerPlatillosLocalStorage();
  cantidad = platillos.length;
  platillos.push(platillo);
  localStorage.setItem("platillos", JSON.stringify(platillos));
  // localStorage.setItem('cantidad', JSON.stringify(cantidad))
}

// function leerCantidadPlatillos(cantidad) {
//     cantidadCarrito.textContent = cantidad +1

// }
function obtenerPlatillosLocalStorage() {
  let platillosLS;
  let cantidad;
  if (localStorage.getItem("platillos") === null) {
    platillosLS = [];
    cantidad = 0;
  } else {
    platillosLS = JSON.parse(localStorage.getItem("platillos"));
    // cantidad = platillosLS.length
    // leerCantidadPlatillos(cantidad)
  }
  return platillosLS;
}

function leerLocalStorage() {
  let platillosLS;

  platillosLS = obtenerPlatillosLocalStorage();

  platillosLS.forEach(function (platillo) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${platillo.imagen}" width=100>
            </td>
            <td>${platillo.titulo}</td>
            <td>${platillo.precio}</td>
            <td>
                <a href="#" class="borrar-platillo" data-id="${platillo.id}">X</a>
            </td>
        `;
    listaPlatillos.appendChild(row);
  });
}

function eliminarPlatilloLocalStorage(platillo) {
  let platillosLS;
  platillosLS = obtenerPlatillosLocalStorage();

  platillosLS.forEach(function (platilloLS, index) {
    if (platilloLS.id === platillo) {
      platillosLS.splice(index, 1);
    }
  });

  localStorage.setItem("platillos", JSON.stringify(platillosLS));
}

function vaciarLocalStorage() {
  localStorage.clear();
}
