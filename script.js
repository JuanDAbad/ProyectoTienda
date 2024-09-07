//todas las imagenes utilizadas son extraidas de internet, no son de mi autoria y son solo colocadas como referencia

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
let sesionActiva = false;
let clienteActivo = []
const DateTime = luxon.DateTime;
const now = DateTime.now();
let botonesEliminar = []

const agregarCero = (number) =>{
    if(number<10){
        let numeroString = `0${number}`
        return numeroString;
    }else{
        return number;
    }
}

const obtenerDate = () =>{
    let fecha = []
    let day = agregarCero(now.day)
    let year = agregarCero(now.year)
    let month = agregarCero(now.month)
    let hour = agregarCero(now.hour)
    let min = agregarCero(now.minute)

    let fechaDia = `${day}/${month}/${year}`
    let fechaHora = `${hour}:${min}`
    fecha.push(fechaDia)
    fecha.push(fechaHora)
    return fecha;
}


let comprobarPrimerUso = () =>{

  if(clientes.length===0){
    sesionActiva=false;
    localStorage.setItem("sesionActiva", JSON.stringify(sesionActiva))
  }else{
    sesionActiva = JSON.parse(localStorage.getItem("sesionActiva"))
  }
}


//Preset de carga para nuevo usuario
function cargarDOMInicial(){
  const mensajeAdvertencia = document.createElement("h6")
  const botonLogOut = document.querySelector("#logOut")
  botonLogOut.classList.add("oculto")
  const h2saludo = document.createElement("h2")
  h2saludo.innerText = 'Bienvenido'
  formularioInicial.innerHTML=""
  const h3saludo = document.createElement("h3")
  h3saludo.innerText = 'Registrate!'
  intro.innerHTML=""
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
    const botonLogOut = document.querySelector("#logOut")
    let nombre = ultimoUsuario.nombre.toUpperCase()
    h2saludo.innerText = `HOLA ${nombre} `
    intro.innerHTML = ''
    intro.appendChild(h2saludo)  
    botonLogOut.classList.remove("oculto")
}

//Clases para los botones de mas y menos que incluyen sus addEventListener asignados al boton al momento de ser creados.
class BoxesMore {
  constructor(element,numero) {
    this.onclick2 = this.onclick2.bind(this);
    element.addEventListener("click", this.onclick2, false); 
    this.numero = numero;
  }
  onclick2(event) {
  let numeroProductos = document.getElementById(`cantidad${this.numero}`);
  event.preventDefault();
  let currentValue = Number(numeroProductos.value) || 0;
  numeroProductos.value = currentValue + 1;
  }
} 

class BoxesLess { 
  constructor(element,numero) {
    
    this.onclick2 = this.onclick2.bind(this);
    element.addEventListener("click", this.onclick2, false); 
    this.numero = numero;
  }
  onclick2(event) {
  let numeroProductos = document.getElementById(`cantidad${this.numero}`);
  event.preventDefault();
  let currentValue = Number(numeroProductos.value) || 0;
  numeroProductos.value = currentValue - 1;
  if(numeroProductos.value<=0){
    numeroProductos.value = ''
  }
} }


//Setteo de Clases
class Producto {
  constructor(nombre, clase, precio, size, codigo, src, alt) {
    this.nombre = nombre;
    this.clase = clase;
    this.precio = Number.parseFloat(precio).toFixed(2);
    this.size = size;
    this.codigo = codigo;
    this.src = src;
    this.alt = alt;
  }
}

class Cliente {
  constructor(nombre, apellido, email) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
  }
}

class ElementoCarrito {
  constructor(codigo, nombre, precio, cantidad) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}


//Funcion para agregar producto al catalogo
const agregarProducto = function (obj) {
  const producto = new Producto(obj.nombre, obj.clase, obj.precio, obj.size, obj.codigo, obj.src, obj.alt);
  productos.push(producto);
};


//FUNCION FETCH
const productosPreexistentes = async ()=>{
  // Si el array de productos esta vacio, hace un fetch de los productos
  if (productos.length===0){
      try{

          const URLprodRelativoRaiz = "/Proyecto/baseDatos.json" 
          const URLprodRelativoPosicion = "./baseDatos.json" 
          const productosBasePuro = await fetch(URLprodRelativoPosicion)
          const productosBase = await productosBasePuro.json()
          productosBase.forEach(prod=>{
              agregarProducto(prod) }
              )
      } catch(err) {
          console.error("Se produjo un error al realizar el fetch:", err)
      }finally{
          arrayFiltrado=productos
          const finalCompra = localStorage.getItem("finCompra")

          if (finalCompra==="true"){
            const catalogo = document.querySelector(".catalogo")
            catalogo.innerHTML=""
          }else{
            dibujarCatalogo(arrayFiltrado)
          }
      }
  } else {
    dibujarCatalogo(arrayFiltrado)
  }
}
 

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

//funcion para ver si ya hay alguien registrado con ese correo
const flitrarCorreo = (correo) => {
  let correoMin = correo.toLowerCase()
  const filtrado = clientes.filter((cliente) => {
    return cliente.email.toLowerCase() === correoMin;
  })
  return filtrado
}

//funcion para agregar clientes
const agregarCliente = function (nombre, apellido, email) {
  const nombreJunto = nombre.replace(/\s/g, "");
  const apellidoJunto = apellido.replace(/\s/g, "");
  const emailJunto = email.replace(/\s/g, "");

  if (nombreJunto !== "" && apellidoJunto !== "" && emailJunto !== "") {
    if (validarString(nombreJunto)) { //Se corrobora que sea un nombre valido,si tiene numeros te sale un aviso y el dato resaltado en rojo (la caja de ingreso de texto)
      const inputNombre = document.querySelector("#nombre")
      inputNombre.className = "badInput"
    }else{
      const inputNombre = document.querySelector("#nombre")
      inputNombre.className = ""
    }

    if (validarString(apellidoJunto)) {
      const inputApellido = document.querySelector("#apellido")//misma logica de validacion que la del nombre
      inputApellido.className = "badInput"
    }else{
      const inputApellido = document.querySelector("#apellido")
      inputApellido.className = ""
    }

    const input = document.querySelector("#email")
    input.className = ""

    if (!validarString(nombreJunto) &&!validarString(apellidoJunto)) {
      let clienteExistente = flitrarCorreo(email)
      clienteActivo = []
      if (clienteExistente.length === 0){
      const cliente = new Cliente(nombre, apellido, email)
      clientes.push(cliente)
      clienteValido = true
      sesionActiva = true;
      localStorage.setItem("sesionActiva", JSON.stringify(sesionActiva))
      localStorage.setItem("clientes", JSON.stringify(clientes))
      clienteActivo.push(cliente)
      localStorage.setItem("clienteActivo", JSON.stringify(clienteActivo))
      }
      else{
        clienteActivo = clienteExistente;
        sesionActiva = true;
        localStorage.setItem("sesionActiva", JSON.stringify(sesionActiva))
        localStorage.setItem("clienteActivo", JSON.stringify(clienteActivo))
        cargarDomUsuario(clienteActivo)
      }
   
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

const recuperarClienteActivo=()=>{
  const nuevoClienteActivo = JSON.parse(localStorage.getItem("clienteActivo"))

  if(nuevoClienteActivo === null){
    return []
} else {
    //Si los encuentro, los paso por la clase asi le agrego los metodos
    return nuevoClienteActivo
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
            nuevoCarrito.push(new ElementoCarrito(carritoObtenido[i].codigo, carritoObtenido[i].nombre, carritoObtenido[i].precio, carritoObtenido[i].cantidad))
        }
        return nuevoCarrito
    }
}

//funcion para filtrar productos mayores a cierto precio, no llegue a implementarlo
const filtrarPrecioMayor = (monto) => {
  const filtrado = productos.filter((producto) => {
    return producto.precio >= monto;
  });

  if (filtrado.length === 0) {
    const h3 = document.createElement("h3")
    h3.innerText = `No existe productos mayores a ese monto`
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
    const h3 = document.createElement("h3")
    h3.innerText = `No existe productos menores a ese monto`
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
    const h3 = document.createElement("h3")
    h3.innerText = `No existen coincidencias`
  } else {
    return productoEle;
  }
};


//funcion para buscar por clase de producto
const buscarxClase = (clase, catalogo) => {
  const productoEle = catalogo.filter((producto) => {
    return buscarPalabra(producto.clase, clase);
  });
  
  if (productoEle === undefined) {
    const h3 = document.createElement("h3")
    h3.innerText = `No existen coincidencias`
  } else {
    return productoEle
  }
};

//funcion para agregar productos al carrito, la cambie para que sumara productos con el mismo codigo.
//Te permite si deseas aumentar la cantidad de un producto
const agregarCarrito = (codigo, cantidad, catalogo) => {
  const productoEncontrado = catalogo.find((producto) => {
    return producto.codigo === codigo;
  });

  if(cantidad!==''){ 
  if (productoEncontrado) {
    const carritoEncontrado = carrito.find((producto) => {
      return producto.codigo === codigo;
    });
  
    if(carritoEncontrado){
      let nuevaCantidad = parseInt(carritoEncontrado.cantidad) + parseFloat(cantidad)
      let index = carrito.indexOf(carritoEncontrado)
      carrito[index].cantidad = nuevaCantidad
    }else{
      const eleCarrito = new ElementoCarrito(productoEncontrado.codigo,productoEncontrado.nombre,productoEncontrado.precio,cantidad);
      carrito.push(eleCarrito);
      localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    
  }}
};


//funcion para quitar un elemento del carrito
const quitarEleXCodigo = (codigo, catalogo) => {
  const productoEncontrado = catalogo.find((producto) => {
    return producto.codigo === codigo;
  });

  if (productoEncontrado !== undefined) {
    let posicion = catalogo.indexOf(productoEncontrado);

    catalogo.splice(posicion, 1);
    localStorage.setItem("carrito", JSON.stringify(catalogo))  
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

let arrayDisminuir = []
let arrayAumentar = []

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
        box.innerHTML+=`<div >
        <img class="imgCatalogo" src="${array[f*4+j].src}" alt="${array[f*4+j].alt}">
        </div>`
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].nombre}</div>`
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].precio} S/.</div>`
        box.innerHTML+=`<div class="contador">
          <input type="submit" value="-" id="menos" class="espaciadox5">
          <input type="text" name="cantidad" id="cantidad${f*4+j}" placeholder="0" readonly>
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
          box.innerHTML+=`<div >
        <img class="imgCatalogo" src="${array[f*4+j].src}" alt="${array[f*4+j].alt}">
        </div>`
          box.innerHTML+=`<div class="labelProducto">${array[f*4+j].nombre}</div>`
          box.innerHTML+=`<div class="labelProducto">${array[f*4+j].precio} S/.</div>`
          box.innerHTML+=`<div class="contador">
          <input type="submit" value="-" id="menos" class="espaciadox5">
          <input type="text" name="cantidad" id="cantidad${f*4+j}" placeholder="0" readonly>
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
        box.innerHTML+=`<div >
        <img class="imgCatalogo" src="${array[f*4+j].src}" alt="${array[f*4+j].alt}">
        </div>`
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].nombre}</div>`
        box.innerHTML+=`<div class="labelProducto">${array[f*4+j].precio} S/.</div>`
        box.innerHTML+=`<div class="contador">
          <input type="submit" value="-" id="menos" class="espaciadox5">
          <input type="text" name="cantidad" id="cantidad${f*4+j}" placeholder="0" readonly>
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


//Funcion mostrar la bolsa del carrito
const dibujarBolsa = () =>{
  const seccionBolsa = document.querySelector(".bolsa")
  seccionBolsa.innerHTML=''
  let finCompra = localStorage.getItem("finCompra")
  if(carrito.length>0){
    if (finCompra === "true" ){
      seccionBolsa.innerHTML+=`<div class="titulosCarrito"> <h3 class="tituloCarrito">Carrito</h3>
     <div class="subtitulosCarrito">
      <h3 class="subtituloBolsa">Nombre</h3>
      <h3 class="subtituloBolsa">Precio Unitario (S/.)</h3>
      <h3 class="subtituloBolsa">Cantidad</h3>
      <h3 class="subtituloBolsa">Subtotal (S/.)</h3>
     </div>
    </div>
    `
    }else{
      seccionBolsa.innerHTML+=`<div class="titulosCarrito"> <h3 class="tituloCarrito">Carrito</h3>
     <div class="subtitulosCarrito">
      <h3 class="subtituloBolsa">Nombre</h3>
      <h3 class="subtituloBolsa">Precio Unitario (S/.)</h3>
      <h3 class="subtituloBolsa">Cantidad</h3>
      <h3 class="subtituloBolsa">Subtotal (S/.)</h3>
      <h3 class="subtituloBolsa">Eliminar Producto</h3>
     </div>
    </div>
    `
    }
    
  }
 
  if (finCompra === "true" ){
    let i = 0
    carrito.forEach(item => {
  
      let precioElementos = item.precio*item.cantidad
      seccionBolsa.innerHTML+=` <div class="enBolsa" id="enBolsa${i}">
          <h3 class="elemento-bolsa">${item.nombre}</h3>
          <h3 class="elemento-bolsa">${item.precio}</h3>
          <h3 class="elemento-bolsa">${item.cantidad}</h3>
          <h3 class="elemento-bolsa">${precioElementos}</h3>
        </div>`
      i++
    }
  );
  }else{
    let i = 0
    carrito.forEach(item => {
  
      let precioElementos = item.precio*item.cantidad
      seccionBolsa.innerHTML+=` <div class="enBolsa" id="enBolsa${i}">
          <h3 class="elemento-bolsa">${item.nombre}</h3>
          <h3 class="elemento-bolsa">${item.precio}</h3>
          <h3 class="elemento-bolsa">${item.cantidad}</h3>
          <h3 class="elemento-bolsa">${precioElementos}</h3>
          <input type="submit" value="X" id="quitarEleCarrito${i}">
        </div>`
      i++
    }
  );
  }

  const total=document.querySelector(".totalBolsa")
  //Esta parte ve si es que hay algun elemento en la bolsa revisando el total consumido
  //y muestra el boton para finalizar compra, siempre y cuando haya al menos un elemento en la bolsa y el usuario se haya registrado
  if(totalBolsa!==0){
    total.innerText=`TOTAL: S./${totalBolsa}`
    const botonFinCompra = document.querySelector("#botonFinCompra")
    const vaciarCarrito = document.querySelector("#chauCarrito")
    const avisoCliente = document.querySelector(".avisoCliente")
    if(clienteActivo.length===0){
      avisoCliente.innerText = "Por favor registrarse para poder comprar o modificar bolsa"
    }else{
      avisoCliente.innerText = ''
      botonFinCompra.classList.remove("oculto")
      vaciarCarrito.classList.remove("oculto")
    }
    
  }else{
    total.innerText="No hay elementos en bolsa"
    const botonFinCompra = document.querySelector("#botonFinCompra")
    const vaciarCarrito = document.querySelector("#chauCarrito")
    botonFinCompra.classList.add("oculto")
      vaciarCarrito.classList.add("oculto")
  }  
}

//Creamos los botones de finalizar compra y de nueva compra, pero ocultos
const finCompra = document.querySelector(".finCompra")
finCompra.innerHTML=`<div class="seccionFinCompra">
      <h3 class="avisoCliente"></h3>
      <input class="espaciadox10 oculto" type="submit" value="Borrar Carrito" id="chauCarrito">
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

//Selector de botones agregado
const radioTodos = document.querySelector("#todo")
const radioPrint = document.querySelector("#print")
const radioSticker = document.querySelector("#sticker")
const radioAccesorio= document.querySelector("#accesorio")

radioPrint.addEventListener("change", (e)=>{
  let arrayNuevo = buscarxClase("print",productos)
  arrayFiltrado=arrayNuevo
  dibujarCatalogo(arrayFiltrado)
  })

radioSticker.addEventListener("change", (e)=>{
  let arrayNuevo = buscarxClase("Sticker",productos)
  arrayFiltrado=arrayNuevo
  dibujarCatalogo(arrayFiltrado)
  })

radioTodos.addEventListener("change", (e)=>{
  let arrayNuevo = productos
  arrayFiltrado=arrayNuevo
  dibujarCatalogo(arrayFiltrado)
  })

radioAccesorio.addEventListener("change", (e)=>{
  let arrayNuevo = buscarxClase("Accesorio",productos)
  arrayFiltrado=arrayNuevo
  dibujarCatalogo(arrayFiltrado)
  })

//Evento de click en boton para agregar elementos al carrito
const botonAgregarProductos = document.querySelector("#agregar")
botonAgregarProductos.addEventListener("click", (e)=>{
  e.preventDefault()
  cargarCarrito()
  calcularTotalBolsa()
  dibujarBolsa()
  for (let i = 0; i<arrayFiltrado.length;i++){
    let resultado = document.querySelector(`#cantidad${i}`)
    resultado.value = ''
  }
  }
)

//Funcion para cargar el dom de compra finalizada
const domFinalCompra = ()=>{
finalCompra = localStorage.getItem("finCompra")
let fechaActual = obtenerDate()

//cambios en la pagina luego de que terminas de comprar
if(finalCompra=="true"){
  const catalogo = document.querySelector(".catalogo")
  const filtro = document.querySelector(".filtro")
  const addProductos = document.querySelector(".addProductos")
  const h2 = document.querySelector("h2")
  const botonLogOut = document.querySelector("#logOut")
  const tituloCarrito = document.querySelector(".tituloCarrito")
  const finCompra = document.querySelector("#botonFinCompra")
  const vaciarCarrito = document.querySelector("#chauCarrito")
  const nuevaCompra = document.querySelector("#nuevaCompra")

  filtro.classList.add("oculto")
  catalogo.innerHTML = ''
  addProductos.innerHTML = ''
  let cliente = clienteActivo[0]
  h2.innerText = `Gracias por tu compra ${cliente.nombre.toUpperCase()}\n Compra realizada el ${fechaActual[0]} a las ${fechaActual[1]} hrs.\n La factura ha sido enviada a ${cliente.email}`
  tituloCarrito.innerText='Resumen Compra'
  finCompra.classList.toggle("oculto")
  botonLogOut.classList.toggle("oculto")
  finCompra.classList.toggle("espaciadox10")
  vaciarCarrito.classList.toggle("oculto")
  nuevaCompra.classList.toggle("oculto")
}
}
 


//////////////////////////////////
/* EMPIEZA EL PROCESO */
productosPreexistentes()// Se hace el fetch con json y se dibuja el catalogo
clientes = recuperarClientes()//RECUPERAMOS DATOS DE CLIENTES
carrito = recuperarCarrito()//RECUPERAMOS DATOS DE carrito
clienteActivo=recuperarClienteActivo()

comprobarPrimerUso()
calcularTotalBolsa()//calculamos el monto inicial, que puede ser diferente de cero si se estaba comprando antes.


//Si eres nuevo usuario te manda el formulario, sino, no
if (sesionActiva===false){
  cargarDOMInicial()
}else{
  cargarDomUsuario(clienteActivo)
}


dibujarBolsa()//Muestra lo que hay en bolsa
cargarCarrito()
domFinalCompra()

/* FIN PROCESO */
////////////////////////////////////////





//Zona de eventos: Esta despues porque algunos requieren que sea cargado o creado elementos del Dom para funcionar

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
    if (clienteActivo.length!==0){
      cargarDomUsuario(submits)
      location.reload()
    } 
   
})

//Este es el evento del filtro que te permite seleccionar entre tres tipos de orden
selectorFiltro.addEventListener("change", event => {
  event.preventDefault();
  let metodoFiltrado = selectorFiltro.value
  radioTodos.checked = true
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


//Evento del boton que finaliza la compra y muestra el carrito y el total 
const botonFinalCompra = document.querySelector("#botonFinCompra")
botonFinalCompra.addEventListener("click", event => {
let compraFinalizada = true
localStorage.setItem("finCompra", JSON.stringify(compraFinalizada))
domFinalCompra()
location.reload();
});


//Boton que te permite volver a realizar una compra, resetea el carrito
const botonNuevaCompra = document.querySelector("#nuevaCompra")
botonNuevaCompra.addEventListener("click", event => {
  let compraFinalizada = false
  localStorage.setItem("finCompra", JSON.stringify(compraFinalizada))
  carrito=[]
  localStorage.setItem("carrito", JSON.stringify(carrito))
  location.reload();
  });


//Boton para borrar elementos del carrito
const chauCarrito = document.querySelector("#chauCarrito")
chauCarrito.addEventListener("click", event => {
  carrito=[]
  localStorage.setItem("carrito", JSON.stringify(carrito))
  event.preventDefault()
  for (let i = 0; i<arrayFiltrado.length;i++){
    let resultado = document.querySelector(`#cantidad${i}`)
    resultado.value = ''
  }
  cargarCarrito()
  calcularTotalBolsa()
  dibujarBolsa()
  });

  //Boton para hacer log out 
const logOut = document.querySelector("#logOut")
logOut.addEventListener("click", event => {
  event.preventDefault()
  carrito=[]
  sesionActiva=false;
  clienteActivo=[]
  localStorage.setItem("sesionActiva", JSON.stringify(sesionActiva))
  localStorage.setItem("clienteActivo", JSON.stringify(clienteActivo))
  localStorage.setItem("carrito", JSON.stringify(carrito))
  for (let i = 0; i<arrayFiltrado.length;i++){
    let resultado = document.querySelector(`#cantidad${i}`)
    resultado.value = ''
  }
  cargarDOMInicial()
  cargarCarrito()
  calcularTotalBolsa()
  dibujarBolsa()
 
  });


//Boton y evento para buscar escribiendo directamente

const botonBuscar = document.querySelector("#botonBuscar")
botonBuscar.addEventListener("click", event =>{
  let infoBuscar = document.querySelector("#busqueda")
  let busqueda = infoBuscar.value
  let arrayEncontrado = buscarxNombre(busqueda,productos)
  arrayFiltrado=arrayEncontrado
  dibujarCatalogo(arrayFiltrado)
  
})

document.addEventListener("click",(event)=> {
  const clickedElement = event.target;

  for (let i = 0;i<carrito.length;i++){
    if(clickedElement.matches(`#quitarEleCarrito${i}`)){
      carrito.splice(i, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito))  
      calcularTotalBolsa()
      dibujarBolsa()
    }
  }
  
})

let home = document.querySelector(".home")

home.addEventListener("mouseover",(event)=> {
  home.classList.toggle("mouseEncima")
})

home.addEventListener("mouseout",(event)=> {
  home.classList.toggle("mouseEncima")
})

home.addEventListener("click",(event)=>{
  location.reload()
})