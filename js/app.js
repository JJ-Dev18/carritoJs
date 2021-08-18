// import Swal from "sweetalert2";

const itemCarrito = document.getElementById("carrito");
const platillos = document.getElementById("lista-platillos");
const listaPlatillos = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const contentProducts = document.getElementById("content-products");
const templateProductos = document.getElementById("template-products").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};
let cantidad = 0 ;
cargarEventListeners();
console.log(carrito.length)
function cargarEventListeners() {
  platillos.addEventListener("click", addCarrito);
  itemCarrito.addEventListener("click", eliminarPlatillo);
  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
  document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem("carrito")) {
      carrito = JSON.parse(localStorage.getItem("carrito"));
      cantidad = JSON.parse(localStorage.getItem("cantidad"));
      pintarCarrito();
      
    }
    pintarCantidad()
  });
}
const pintarCantidad = ()=>{
  cantidadCarrito.textContent = cantidad;
}
const cargarProductos = (data) => {
  data.forEach((producto) => {
    templateProductos.querySelector("h4").textContent = producto.title;
    templateProductos.querySelector(".imagen-platillo").src = producto.img;
    templateProductos.querySelector(".u-pull-right strong").textContent =
      producto.precio;
    templateProductos.querySelector("a").setAttribute("data-id", producto.id);
    const productos = templateProductos.cloneNode(true);
    fragment.appendChild(productos);
  });
  contentProducts.appendChild(fragment);
};
const fetchData = async () => {
  try {
    const resp = await fetch("js/api.json");
    const data = await resp.json();

    cargarProductos(data);
  } catch (error) {
    console.log(error);
  }
};

function addCarrito(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    setCarrito(e.target.parentElement.parentElement);
    // leerDatosPlatillo(platillo);
  }
  e.stopPropagation();
}

function setCarrito(platillo) {
  const infoPlatillo = {
    imagen: platillo.querySelector("img").src,
    titulo: platillo.querySelector("h4").textContent,
    precio: platillo.querySelector(".u-pull-right strong").textContent,
    id: platillo.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(infoPlatillo.id)) {
    infoPlatillo.cantidad = carrito[infoPlatillo.id].cantidad + 1;
  }
  carrito[infoPlatillo.id] = { ...infoPlatillo };
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Agregado al carrito",
    showConfirmButton: false,
    timer: 1500,
  });
  pintarCarrito();
}
const pintarCarrito = () => {
  listaPlatillos.innerHTML = "";
  for (const key in carrito) {
    templateCarrito.querySelectorAll("td")[0].firstElementChild.src =
      carrito[key].imagen;
    templateCarrito.querySelectorAll("td")[1].textContent = carrito[key].titulo;
    templateCarrito.querySelectorAll("td")[2].textContent =
      carrito[key].precio * carrito[key].cantidad;
    templateCarrito.querySelectorAll("td")[3].textContent =
      carrito[key].cantidad;
    templateCarrito.querySelectorAll("td")[4].firstElementChild.setAttribute('data-id', carrito[key].id);
    

    const productos = templateCarrito.cloneNode(true);
    fragment.appendChild(productos);
  }
  listaPlatillos.appendChild(fragment);
  cantidad = Object.values(carrito).length
  pintarCantidad()
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("cantidad", JSON.stringify(cantidad));
};

function eliminarPlatillo(e) {
  e.preventDefault();

  let platillo, platilloId;

  if (e.target.classList.contains("borrar-platillo")) {
    e.target.parentElement.parentElement.remove();
    platillo = e.target.parentElement.parentElement;
    platilloId = platillo.querySelector("a").getAttribute("data-id");
  }
  
  eliminarPlatilloLocalStorage(platilloId);

  e.stopPropagation()
}

function vaciarCarrito() {
  cantidadCarrito.textContent = 0;
  carrito = {};
  pintarCarrito();
  vaciarLocalStorage();

  return false;
}


function eliminarPlatilloLocalStorage(id) {
  
  if (carrito.hasOwnProperty(id)) {
    delete carrito[id];
  }

  cantidad = Object.values(carrito).length;
  pintarCantidad()
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("cantidad", JSON.stringify(cantidad));
}

function vaciarLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify({}));
  localStorage.setItem("cantidad", JSON.stringify(0));
}
