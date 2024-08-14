let carrito = [];
let clientes = [];
const productos = [];
let clienteValido = false
const header = document.querySelector("header")
const intro = document.querySelector(".intro")
const footer = document.querySelector("footer")
const formularioInicial = document.createElement("form")
const selectorFiltro = document.querySelector(".selectorFiltro")
let arrayFiltrado = []
let totalBolsa = 0
let finalCompra = false;

//Preset de carga para nuevo usuario
function cargarDOMInicial(){
  const mensajeAdvertencia = document.createElement("h6")
  const h2saludo = document.createElement("h2")
    h2saludo.innerText = 'Bienvenido'
    const h3saludo = document.createElement("h3")
    h3saludo.innerText = 'Registrate!'
    intro.appendChild(h2saludo)
    intro.appendChild(h3saludo)
    intro.appendChild(formularioInicial)
    formularioInicial.innerHTML += 

`<label for="nombre">Nombres</label>
<input type="text" name="nombre" id="nombre" placeholder="Nombres">

<label for="apellido">Apellidos</label>
<input type="text" name="apellido" id="apellido" placeholder="Apellidos">

<label for="email">E-Mail</label>
<input type="email" name="email" id="email" placeholder="E-mail">

<input type="submit" value="Enviar" id="enviar">`
intro.appendChild(mensajeAdvertencia)
  }

//Preset de carga para usuario anteriormente registrado o con sesión iniciada en ese dispositivo (verifica localstorage por el array clientes)
function cargarDomUsuario(array){
    const h2saludo = document.createElement("h2")
    const ultimoUsuario = array[array.length - 1]
    let nombre = ultimoUsuario.nombre.toUpperCase()
    h2saludo.innerText = `HOLA ${nombre} `
    intro.innerHTML = ''
    intro.appendChild(h2saludo)  
}

//Clases para los botones de mas y menos que incluyen sus addEventListener asignados al boton al momento de ser creados.
class BoxesMore {
  constructor(element,numero) {
    this.onclick2 = this.onclick2.bind(this);
    element.addEventListener("click", this.onclick2, false); 
    this.numero = numero;
  }
  onclick2(event) {
  let numeroProductos1 = document.getElementById(`cantidad${this.numero}`);
  event.preventDefault();
  let currentValue = Number(numeroProductos1.value) || 0;
  numeroProductos1.value = currentValue + 1;
  }
} 

class BoxesLess {
  
  constructor(element,numero) {
    
    this.onclick2 = this.onclick2.bind(this);
    element.addEventListener("click", this.onclick2, false); 
    this.numero = numero;
  }
  onclick2(event) {
  let numeroProductos1 = document.getElementById(`cantidad${this.numero}`);
  event.preventDefault();
  let currentValue = Number(numeroProductos1.value) || 0;
  numeroProductos1.value = currentValue - 1;
  if(numeroProductos1.value<=0){
    numeroProductos1.value = ''
  }
} }

//Setteo de Clases
class Producto {
  constructor(nombre, clase, precio, size, codigo) {
    this.nombre = nombre;
    this.clase = clase;
    this.precio = Number.parseFloat(precio).toFixed(2);
    this.size = size;
    this.codigo = codigo;
  }
}

class Cliente {
  constructor(nombre, apellido, email) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
  }
}

class elementoCarrito {
  constructor(codigo, nombre, precio, cantidad) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}

//Funcion para agregar producto al catalogo
const agregarProducto = function (nombre, clase, precio, size, codigo) {
  const producto = new Producto(nombre, clase, precio, size, codigo);
  productos.push(producto);
};

agregarProducto("Print 1", "Print A5", 15.0, "14.8x21", 1);
agregarProducto("Print 2", "Print A4", 30.0, "21x29.7", 2);
agregarProducto("Print 3", "Print A3", 50.0, "29.7x42", 3);
agregarProducto("Pack Sticker 1", "Pack Stickers x5", 5.0, "5x5", 4);
agregarProducto("Pack Sticker 2", "Pack Stickers x10", 10.0, "5x5", 5);
agregarProducto("Taza 1", "Accesorio", 15.0, "", 6);
agregarProducto("Tote Bag 1", "Accesorio", 50.0, "10x20", 7);
agregarProducto("Gorra 1", "Accesorio", 30.0, "5x5", 8);

arrayFiltrado=productos

//funcion validar si un string tiene numeros
const validarString = (nombre) => {
  let contieneNum = false;
  for (let i = 0; i < nombre.length; i++) {
    if (!isNaN(nombre[i])) {
      contieneNum = true;
      break;
    }
  }
  return contieneNum;
};

//funcion para agregar clientes
const agregarCliente = function (nombre, apellido, email) {
  const nombreJunto = nombre.replace(/\s/g, "");
  const apellidoJunto = apellido.replace(/\s/g, "");
  const emailJunto = email.replace(/\s/g, "");

  if (nombreJunto !== "" && apellidoJunto !== "" && emailJunto !== "") {
    if (validarString(nombreJunto)) {
      const inputNombre = document.querySelector("#nombre")
      inputNombre.className = "badInput"
    }else{
      const inputNombre = document.querySelector("#nombre")
      inputNombre.className = ""
    }

    if (validarString(apellidoJunto)) {
      const inputApellido = document.querySelector("#apellido")
      inputApellido.className = "badInput"
    }else{
      const inputApellido = document.querySelector("#apellido")
      inputApellido.className = ""
    }

    const input = document.querySelector("#email")
    input.className = ""

    if (!validarString(nombreJunto) &&!validarString(apellidoJunto)) {
      const cliente = new Cliente(nombre, apellido, email)
      clientes.push(cliente)
      clienteValido = true
      localStorage.setItem("clientes", JSON.stringify(clientes))
    }else{
      const mensajeAdvertencia = document.querySelector("h6")
      mensajeAdvertencia.innerText = "Uno o mas campos estan incorrectos"
    }
  } else {
    const mensajeAdvertencia = document.querySelector("h6")
      mensajeAdvertencia.innerText = "Falta rellenar uno o más campos"
    if(nombreJunto===""){
      const inputNombre = document.querySelector("#nombre")
      inputNombre.className = "badInput"
    }else{
      const inputNombre = document.querySelector("#nombre")
      inputNombre.className = ""
    }
    if(apellidoJunto===""){
      const inputApellido = document.querySelector("#apellido")
      inputApellido.className = "badInput"
    }else{
      const inputApellido = document.querySelector("#apellido")
      inputApellido.className = ""
    }
    if(emailJunto===""){
      const input = document.querySelector("#email")
      input.className = "badInput"
    }else{
      const input = document.querySelector("#email")
      input.className = ""
    }
  }
};

//funcion para cargar clientes guardados en el storage
const recuperarClientes=()=>{
    // busco en el storage los datos
    const clientesObtenidos = JSON.parse(localStorage.getItem("clientes"))
    /* console.log(" clientes obtenidos", clientesObtenidos) */
    // Si no los encuentro retorno un array vacio
    if(clientesObtenidos === null){
        return []
    } else {
        //Si los encuentro, los paso por la clase asi le agrego los metodos
        const nuevosClientes = []
        for(let i=0; i<clientesObtenidos.length; i++){
            nuevosClientes.push(new Cliente(clientesObtenidos[i].nombre, clientesObtenidos[i].apellido, clientesObtenidos[i].email))
        }
        return nuevosClientes
    }
}

//funcion para cargar el carrito previo
const recuperarCarrito=()=>{
    // busco en el storage los datos
    const carritoObtenido = JSON.parse(localStorage.getItem("carrito"))
    // Si no los encuentro retorno un array vacio
    if(carritoObtenido === null){
        return []
    } else {
        //Si los encuentro, los paso por la clase asi le agrego los metodos
        const nuevoCarrito = []
        for(let i=0; i<carritoObtenido.length; i++){
            nuevoCarrito.push(new elementoCarrito(carritoObtenido[i].codigo, carritoObtenido[i].nombre, carritoObtenido[i].precio, carritoObtenido[i].cantidad))
        }
        return nuevoCarrito
    }
}

//funcion para filtrar productos mayores a cierto precio
const filtrarPrecioMayor = (monto) => {
  const filtrado = productos.filter((producto) => {
    return producto.precio >= monto;
  });

  if (filtrado.length === 0) {
    alert(`No hay productos mayores a ${monto} soles`);
  }else{
    return filtrado
  }
};

//funcion para filtrar productos menores a cierto precio
const filtrarPrecioMenor = (monto) => {
  const filtrado = productos.filter((producto) => {
    return producto.precio <= monto;
  });

  if (filtrado.length === 0) {
    alert(`No hay productos menores a ${monto} soles`);
  }else{
    return filtrado
  }
};

//funciones para buscar por un nombre de producto especifico
const buscarPalabra = (string, clave) => {
  return string.toLowerCase().includes(clave.toLowerCase());
};

const buscarxNombre = (palabra, catalogo) => {
  const productoEle = catalogo.filter((producto) => {
    return buscarPalabra(producto.nombre, palabra);
  });
  if (productoEle === undefined) {
    console.log("cero resultados");
  } else {
    /* alert(`el combo encontrado es: ${comboEle.nombre}`) */
    return productoEle;
  }
};


//funcion para buscar por clase de producto
const buscarxClase = (clase, catalogo) => {
  const productoEle = catalogo.filter((producto) => {
    return buscarPalabra(producto.clase, clase);
  });
  console.log(productoEle);

  if (productoEle === undefined) {
    console.log("cero resultados");
  } else {
    /* alert(`el combo encontrado es: ${comboEle.nombre}`) */
    console.log(`el precio es ${productoEle.precio}`);
  }
};

//funcion para agregar productos al carrito
const agregarCarrito = (codigo, cantidad, catalogo) => {
  const productoEncontrado = catalogo.find((producto) => {
    return producto.codigo === codigo;
  });

  if(cantidad!==''){ 
  if (productoEncontrado) {
    const eleCarrito = new elementoCarrito(productoEncontrado.codigo,productoEncontrado.nombre,productoEncontrado.precio,cantidad);
    carrito.push(eleCarrito);
    localStorage.setItem("carrito", JSON.stringify(carrito))
  } else {
    console.log(`No contamos con stock de del producto`);
  }}
};

//funcion para quitar un elemento del carrito
const quitarElemento = (codigo, catalogo) => {
  const productoEncontrado = catalogo.find((producto) => {
    return producto.codigo === codigo;
  });

  if (productoEncontrado !== undefined) {
    let posicion = catalogo.indexOf(productoEncontrado);

    catalogo.splice(posicion, 1);
    localStorage.setItem("carrito", JSON.stringify(catalogo))
    console.table(catalogo);
  } else {
    console.log("no se encontro producto");
  }
};

//Funcion para leer los valores de todas las cantidades seleccionadas de los productos
const leerCantidades = ()=>{
  let arrayCantidades = []

  for (let i = 0; i<arrayFiltrado.length;i++){
    let resultado = document.querySelector(`#cantidad${i}`)
    arrayCantidades.push(resultado.value)
  }
return arrayCantidades
}


//funciones para ordenar el catalogo segun mayor o menor
let nuevoCatalogo = [];
const ordenarCatalogo = (catalogo, orden) => {
  nuevoCatalogo = JSON.parse(JSON.stringify(catalogo));

  if (orden === "menor") {
    nuevoCatalogo.sort((primerItem, segundoItem) => {
      return primerItem.precio - segundoItem.precio;
    });
  } else if (orden === "mayor") {
    nuevoCatalogo.sort((primerItem, segundoItem) => {
      return segundoItem.precio - primerItem.precio;
    });
  } else {
    nuevoCatalogo = JSON.parse(JSON.stringify(catalogo));
  }

  return nuevoCatalogo
};


//funcion para cargar el precio total de todos los productos 
  const calcularTotal = (carritoElegido) => {
    const total = carritoElegido.reduce((total, eleCarrito) => {
      return total + eleCarrito.precio * eleCarrito.cantidad;
    }, 0);
    return total;
  };
  

//funcion para mostrar los productos del catalogo
const dibujarCatalogo=(array)=>{
  const catalogo = document.querySelector(".catalogo")
  let exacto = 0
  let numeroElementos=array.length
  let resto = numeroElementos%4
  catalogo.innerHTML = ''
  if(resto!==0){
    exacto = 1;
  }

  let cantidadDeFilas=Math.floor(numeroElementos/4) + exacto
  let f = 0
  for (let i = 0; i<cantidadDeFilas;i++){
    const fila=document.createElement("div")
    fila.classList.add("row")
    fila.classList.add(`row${i}`)
    fila.innerHTML =
           `<div class="box box1"></div>
            <div class="box box2"></div>
            <div class="box box3"></div>
            <div class="box box4"></div>`
    catalogo.appendChild(fila)

    if(exacto===0){
      for(let j = 0;j<4;j++){
        const box = document.querySelector(`div.row${f} > div.box${j+1}`)
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].nombre}</div>`
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].precio} S/.</div>`
        box.innerHTML+=`<div class="contador">
          <input type="submit" value="-" id="menos" class="espaciadox5">
          <input type="text" name="cantidad" id="cantidad${f*4+j}" placeholder="0">
          <input type="submit" value="+" id="mas" class="espaciadox5">
        </div>`
        const menos = document.querySelector(`div.row${f} > div.box${j+1} > .contador > #menos`)
        const mas = document.querySelector(`div.row${f} > div.box${j+1} > .contador > #mas`)
        const boxmas = new BoxesMore(mas,f*4+j)
        const boxmenos = new BoxesLess(menos,f*4+j)

        arrayAumentar[f*4+j] = mas
        arrayDisminuir[f*4+j] = menos

      }
    }else{
      if(f*4 + resto < numeroElementos){
        for(let j = 0;j<4;j++){
          const box = document.querySelector(`div.row${f} > div.box${j+1}`)
          box.innerHTML+=`<div class="labelProducto">${array[f*4+j].nombre}</div>`
          box.innerHTML+=`<div class="labelProducto">${array[f*4+j].precio} S/.</div>`
          box.innerHTML+=`<div class="contador">
          <input type="submit" value="-" id="menos" class="espaciadox5">
          <input type="text" name="cantidad" id="cantidad${f*4+j}" placeholder="0">
          <input type="submit" value="+" id="mas" class="espaciadox5">
        </div>`
        const menos = document.querySelector(`div.row${f} > div.box${j+1} > .contador > #menos`)
        const mas = document.querySelector(`div.row${f} > div.box${j+1} > .contador > #mas`)
        const boxmas = new BoxesMore(mas,f*4+j)
        const boxmenos = new BoxesLess(menos,f*4+j)
        arrayAumentar[f*4+j] = mas
        arrayDisminuir[f*4+j] = menos
        }
      }else{ 
      for(let j = 0;j<resto;j++){    
        const box = document.querySelector(`div.row${f} > div.box${j+1}`)
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].nombre}</div>`
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].precio} S/.</div>`
        box.innerHTML+=`<div class="contador">
          <input type="submit" value="-" id="menos" class="espaciadox5">
          <input type="text" name="cantidad" id="cantidad${f*4+j}" placeholder="0">
          <input type="submit" value="+" id="mas" class="espaciadox5">
        </div>`
      const menos = document.querySelector(`div.row${f} > div.box${j+1} > .contador > #menos`)
      const mas = document.querySelector(`div.row${f} > div.box${j+1} > .contador > #mas`)
      const boxmas = new BoxesMore(mas,f*4+j)
      const boxmenos = new BoxesLess(menos,f*4+j)
      arrayAumentar[f*4+j] = mas
      arrayDisminuir[f*4+j] = menos
      }
    }}
    f++;
  }
}
//fin de funcion de creacion visual del catalogo

let arrayDisminuir = []
let arrayAumentar = []

//Funcion mostrar la bolsa del carrito
const dibujarBolsa = () =>{
  const seccionBolsa = document.querySelector(".bolsa")
  seccionBolsa.innerHTML=''

  if(carrito.length>0){
    seccionBolsa.innerHTML+=`<div class="titulosCarrito"> <h3 class="tituloCarrito">Carrito</h3>
     <div class="subtitulosCarrito">
      <h3 class="subtituloBolsa">Nombre</h3>
      <h3 class="subtituloBolsa">Precio Unitario (S/.)</h3>
      <h3 class="subtituloBolsa">Cantidad</h3>
      <h3 class="subtituloBolsa">Subtotal (S/.)</h3>
     </div>
    </div>
    `
  }

  for(let i = 0; i<carrito.length;i++){
    let precioElementos = carrito[i].precio*carrito[i].cantidad
    seccionBolsa.innerHTML+=` <div class="enBolsa" id="enBolsa${i}">
        <h3 class="elemento-bolsa">${carrito[i].nombre}</h3>
        <h3 class="elemento-bolsa">${carrito[i].precio}</h3>
        <h3 class="elemento-bolsa">${carrito[i].cantidad}</h3>
        <h3 class="elemento-bolsa">${precioElementos}</h3>
      </div>`
  }
  
  const total=document.querySelector(".totalBolsa")
  //Esta parte ve si es que hay algun elemento en la bolsa revisando el total consumido
  //y muestra el boton para finalizar compra, siempre y cuando haya al menos un elemento en la bolsa
  if(totalBolsa!==0){
    total.innerText=`TOTAL: S./${totalBolsa}`
    const botonFinCompra = document.querySelector("#botonFinCompra")
    botonFinCompra.classList.remove("oculto")
  }else{
    total.innerText="No hay elementos en bolsa"
  }  
}

//Creamos los botones de finalizar compra y de nueva compra, pero ocultos
const finCompra = document.querySelector(".finCompra")
finCompra.innerHTML=`<div class="seccionFinCompra">
      <input class="espaciadox10 oculto" type="submit" value="Finalizar Compra" id="botonFinCompra">
      <input class="espaciadox10 oculto" type="submit" value="Volver a comprar" id="nuevaCompra">
      </div>`

//Funcion que toma las cantidades seleccionadas y ejecuta la funcion agregar elementos al carrito
const cargarCarrito = () =>{
  let arrayCantidades = leerCantidades()
  for(let i = 0; i<arrayFiltrado.length;i++){
  agregarCarrito(arrayFiltrado[i].codigo,arrayCantidades[i],arrayFiltrado)
  }
}

//Funcion que calcula el total del monto a pagar
const calcularTotalBolsa = () =>{
  totalBolsa = 0;
  for(let i=0;i<carrito.length;i++){
    totalBolsa+=carrito[i].precio*carrito[i].cantidad
  }
}

/* EMPIEZA EL PROCESO */

clientes = recuperarClientes()//RECUPERAMOS DATOS DE CLIENTES
carrito = recuperarCarrito()//RECUPERAMOS DATOS DE carrito

calcularTotalBolsa()//calculamos el monto inicial, que puede ser diferente de cero si se estaba comprando antes.

//Evento de click en boton para agregar elementos al carrito
const botonAgregarProductos = document.querySelector("#agregar")
botonAgregarProductos.addEventListener("click", (e)=>{
  e.preventDefault()
  cargarCarrito()
  calcularTotalBolsa()
  dibujarBolsa()
  }
)

//Si eres nuevo usuario te manda el formulario, sino, no
if (clientes.length===0){
  cargarDOMInicial()
}else{
  cargarDomUsuario(clientes)
}


//Carga evento de click de submit para crear nuevo usuario
formularioInicial.addEventListener("submit", (e)=>{
    // evita el reset
    const submits = []
    e.preventDefault()
    // usamos la clase de Js FormData para crear un objeto que contiene toda la info al momento del submit
    const informacion = new FormData(e.target)
    // usamos el metodo diseñado para la clase de arriba de Object para manejarlo más facil
    const submit = Object.fromEntries(informacion)
    submits.push(submit)
    const objeto = submits[submits.length-1]
    agregarCliente(objeto.nombre, objeto.apellido, objeto.email)
    if (clienteValido){
      cargarDomUsuario(submits)
    } 
})

//Diagramamos el catalago de productos
dibujarCatalogo(productos)

//Este es el evento del filtro que te permite seleccionar entre tres tipos de orden
selectorFiltro.addEventListener("change", event => {
  event.preventDefault();
  let metodoFiltrado = selectorFiltro.value
  
  if(metodoFiltrado==1){
    arrayFiltrado=productos
    dibujarCatalogo(arrayFiltrado)
  }else if(metodoFiltrado==2){
    arrayFiltrado = ordenarCatalogo(productos, 'mayor')
    dibujarCatalogo(arrayFiltrado)
  }else if(metodoFiltrado==3){
    arrayFiltrado = ordenarCatalogo(productos, 'menor')
    dibujarCatalogo(arrayFiltrado)
  }   
});

dibujarBolsa()//Muestra lo que hay en bolsa
cargarCarrito()

//Evento del boton que finaliza la compra y muestra el carrito y el total 
const botonFinalCompra = document.querySelector("#botonFinCompra")
botonFinalCompra.addEventListener("click", event => {
console.log(finalCompra)
let compraFinalizada = true
localStorage.setItem("finCompra", JSON.stringify(compraFinalizada))
location.reload();
});

finalCompra = localStorage.getItem("finCompra")

//cambios en la pagina luego de que terminas de comprar
if(finalCompra=="true"){
  const catalogo = document.querySelector(".catalogo")
  const filtro = document.querySelector(".filtro")
  const addProductos = document.querySelector(".addProductos")
  const h2 = document.querySelector("h2")
  const tituloCarrito = document.querySelector(".tituloCarrito")
  const finCompra = document.querySelector("#botonFinCompra")
  const nuevaCompra = document.querySelector("#nuevaCompra")

  filtro.classList.add("oculto")
  catalogo.innerHTML = ''
  addProductos.innerHTML = ''
  let nombre = clientes[clientes.length-1].nombre.toUpperCase()
  h2.innerText = `Gracias por tu compra ${nombre} \n La factura ha sido enviada a tu correo`
  tituloCarrito.innerText='Resumen Compra'
  finCompra.classList.toggle("oculto")
  finCompra.classList.toggle("espaciadox10")
  nuevaCompra.classList.toggle("oculto")
}

//Boton que te permite volver a realizar una compra, resetea el carrito
const botonNuevaCompra = document.querySelector("#nuevaCompra")
botonNuevaCompra.addEventListener("click", event => {
  let compraFinalizada = false
  localStorage.setItem("finCompra", JSON.stringify(compraFinalizada))
  carrito=[]
  localStorage.setItem("carrito", JSON.stringify(carrito))
  location.reload();
  });