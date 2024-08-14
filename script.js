let carrito = [];
let clientes = [];
const productos = [];
let clienteValido = false
const header = document.querySelector("header")
const intro = document.querySelector(".intro")
const footer = document.querySelector("footer")
const formularioInicial = document.createElement("form")
const selectorFiltro = document.querySelector(".selectroFiltro")
let arrayFiltrado = []
let totalBolsa = 0
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

class BoxesMore {
  name = "Something Good";

  constructor(element,numero) {
    // bind causes a fixed `this` context to be assigned to `onclick2`
    this.onclick2 = this.onclick2.bind(this);
    element.addEventListener("click", this.onclick1, false);
    element.addEventListener("click", this.onclick2, false); // Trick
    this.numero = numero;
  }
  onclick1(event) {
    console.log(this.name); // undefined, as `this` is the element
  }
  onclick2(event) {
    console.log(this.name); // 'Something Good', as `this` is bound to the Something instance
    
  let numeroProductos1 = document.getElementById(`cantidad${this.numero}`);
  event.preventDefault();
  let currentValue = Number(numeroProductos1.value) || 0;
  numeroProductos1.value = currentValue + 1;
  }
} 

class BoxesLess {
  name = "Something Good";
  constructor(element,numero) {
    // bind causes a fixed `this` context to be assigned to `onclick2`
    this.onclick2 = this.onclick2.bind(this);
    element.addEventListener("click", this.onclick1, false);
    element.addEventListener("click", this.onclick2, false); // Trick
    this.numero = numero;
  }
  onclick1(event) {
    console.log(this.name); // undefined, as `this` is the element
  }
  onclick2(event) {
    console.log(this.name); // 'Something Good', as `this` is bound to the Something instance
    
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
    console.log(" Carrito obtenido", carritoObtenido)
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

//funcion para crear botones. Esto lo hago porque necesito tener todos los botones existentes para crear los eventos, sino genera error.
const crearBotones = (array)=>{
  for (let i = 0; i < array.length;i++){
    const elementoInput = document.createElement("input")
    const aumentar = document.createElement("input")
    arrayDisminuir.push(elementoInput)
    arrayAumentar.push(aumentar)
  }
}

const dibujarBolsa = () =>{

  const seccionBolsa = document.querySelector(".bolsa")
  seccionBolsa.innerHTML=''

  if(carrito.length>0){
    seccionBolsa.innerHTML+=`<div class="titulosCarrito"> <h3 class="tituloCarrito">Carrito</h3>
     <div class="subtitulosCarrito">
      <h3 class="subtituloBolsa">Nombre</h3>
      <h3 class="subtituloBolsa">Precio Unitario</h3>
      <h3 class="subtituloBolsa">Cantidad</h3>
      <h3 class="subtituloBolsa">Subtotal</h3>
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
  
  if(totalBolsa!==0){
    total.innerText=`TOTAL: ${totalBolsa}`
  }else{
    total.innerText="No hay elementos en bolsa"
  }
 
}


const cargarCarrito = () =>{
  let arrayCantidades = leerCantidades()
  console.log(arrayCantidades)
  for(let i = 0; i<arrayFiltrado.length;i++){
  agregarCarrito(arrayFiltrado[i].codigo,arrayCantidades[i],arrayFiltrado)
  }
}

const calcularTotalBolsa = () =>{

  totalBolsa = 0;
  for(let i=0;i<carrito.length;i++){
    totalBolsa+=carrito[i].precio*carrito[i].cantidad
  }

}

/* EMPIEZA EL PROCESO */

clientes = recuperarClientes()//RECUPERAMOS DATOS DE CLIENTES
carrito = recuperarCarrito()//RECUPERAMOS DATOS DE carrito

calcularTotalBolsa()



//Evento de click en boton para agregar elementos al carrito
const botonAgregarProductos = document.querySelector("#agregar")

botonAgregarProductos.addEventListener("click", (e)=>{
  e.preventDefault()
  cargarCarrito()
  calcularTotalBolsa()
  console.log(carrito)
  dibujarBolsa()
  }
)



//Si eres nuevo usuario te manda el formulario, sino, no te manda el formulario
if (clientes.length===0){
  cargarDOMInicial()
}else{
  cargarDomUsuario(clientes)
}

//Creamos los botoenes en funcion de la cantidad total de productos
crearBotones(productos)

//Carga evento de click de submit
formularioInicial.addEventListener("submit", (e)=>{
    // evita el reset
    const submits = []
    e.preventDefault()
    // usamos la clase de Js FormData para crear un objeto que contiene toda la info al momento del submit
    const informacion = new FormData(e.target)
    // usamos el metodo diseñado para la clase de arriba de Object para manejarlo más facil
    const submit = Object.fromEntries(informacion)
    submits.push(submit)
    console.log(submits)
    const objeto = submits[submits.length-1]
    agregarCliente(objeto.nombre, objeto.apellido, objeto.email)
    if (clienteValido){
      cargarDomUsuario(submits)
    } 
})

dibujarCatalogo(productos)


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

dibujarBolsa()
cargarCarrito()