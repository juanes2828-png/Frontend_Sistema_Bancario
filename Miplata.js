
Autenticacion()

function Autenticacion(){
    console.log("<--| REGISTRO Y AUTENTICACIÓN |-->");

    let seleccionInicioSesion=Number(prompt("<--<< Inicio de Sesión >>-->\n1. Iniciar sesión \n2. Registrarse\n3. Salir"));

    //Validación ingreso. Debe seleccionar 1 o 2 hasta que se canse
    while (seleccionInicioSesion<1 || seleccionInicioSesion>3){
        seleccionInicioSesion=Number(prompt("No ha seleccionado una opción válida:\n1. Iniciar sesión\n2. Registrarse\n3. Salir"));    
    }

    switch(seleccionInicioSesion){
        case 1:
            iniciarSesion();
            break;
        case 2:
            registro();
            break;
        case 3:
            console.log("Muchas gracias por utilizar nuestro servicio. Hasta pronto.");
            break;
    }
}


//Función Registro de usuario
function registro(){
    let identificacion=""
    while (identificacion===null){
        identificacion=Number(prompt("identificacion"))
    }
    
    const usuariosRegistrados = JSON.parse(localStorage.getItem("datosRegistro")) || [];
    let usuarioDisponible=false
    //let usuario=""
     
    //Aquí voy. Debemos hacer la validación
    
    let usuario=prompt("Usuario")
    while (usuario===null || usuario.trim()===""){
        usuario=prompt(`El campo no debe quedar vacío
            Escribe un nombre de usuario`)    
    }

    let correo=""
    while (correo===null || correo.trim()===""){
        correo=prompt("Correo");
    }
    let clave=prompt("Digite una clave. Debe tener entre 8 y 16 caracteres");
    while(clave.length<8 || clave.length>16){
        clave=prompt("No cumpliste con los requisitos para crear la clave. \nDigite nuevamente clave. Debe tener entre 8 y 16 caracteres");
    }
    let repetirClave=prompt("Repita la clave:");
    while(clave!=repetirClave){
        repetirClave=prompt("La clave no coincide con la anterior. Vuelva a intentarlo")
    }

    //almacenamiento local
    const datosUsuario={
        idAlmLocal:identificacion,
        usuarioAlmLocal:usuario,
        correoAlmLocal: correo,
        claveAlmLocal: clave,

    }

    let directorioUsuarios=JSON.parse(localStorage.getItem("datosRegistro")) || [];
    directorioUsuarios.push(datosUsuario);
    localStorage.setItem("datosRegistro",JSON.stringify(directorioUsuarios))

    let recuperado=JSON.parse(localStorage.getItem("datosRegistro"))
    let ultimoRegistro=recuperado.at(-1)

    
    console.log(`Se ha registrado el siguiente usuario:
        identificacion: ${ultimoRegistro.idAlmLocal}
        usuario:        ${ultimoRegistro.usuarioAlmLocal}
        correo:         ${ultimoRegistro.correoAlmLocal}
        contraseña:     ********`);
    
        console.log("\nUsuario registrado con éxito. Vuelva e inicie sesión");
    Autenticacion()
}

function iniciarSesion(){
    datosCorrectos=false
    let contadorAccesoDenegado=0
    while(datosCorrectos==false && contadorAccesoDenegado!=3){
        const usuarioInicioSesion=prompt("Usuario");
        const contrasenaInicioSesion=prompt("Contraseña")

        datosGuardados=localStorage.getItem("datosRegistro");

        const usuariosArray=JSON.parse(datosGuardados || "[]")
        
        datosCorrectos=usuariosArray.some(datosUsuario=>{
            return datosUsuario.usuarioAlmLocal===usuarioInicioSesion && datosUsuario.claveAlmLocal===contrasenaInicioSesion;
            
        })
        
    if (datosCorrectos){
            console.log("Acceso correcto");
            Transacciones(usuarioInicioSesion)
            return usuarioInicioSesion
            
        }else{
            console.log("Acceso denegado. Vuelva e intente.");
            contadorAccesoDenegado++
            if (contadorAccesoDenegado==3){
                console.log("Cuenta bloqueada por 24 horas, comunícate con tu banco. Hasta pronto.");
            }
        }
    }   
}

function Transacciones(usuarioActivo){
    const consultasYMovimientos=Number(prompt(`Consultas y movimientos:
        1. RetirarDinero
        2. Consultar saldo
        3. Consignar
        4. Consultar movimientos
        5. Transferencia entre usuarios
        6. Salir`))
    switch(consultasYMovimientos){
        case 1: 
            RetirarDinero();
            break;
        case 2: 
            ConsultarSaldo();
            break;
        case 3: 
            Consignar(usuarioActivo);
            break;
        case 4: 
            ConsultarMovimientos();
            break;
        case 5: 
            TransferenciaEntreUsuarios();
            break;
        case 6:
            console.log("Hasta pronto.");
            break;
        default:
            console.log("No seleccionó una opción válida");
    }
}

function Consignar(usuarioActivo){
    //solicitar el valor consignar y se valida que sea mayor a cero
    let valorAConsignar=Number(prompt("Digite el valor a consignar:"))
    while (valorAConsignar<=0){
        valorAConsignar=Number(prompt(`Debe diligenciar un valor positivo.
        Digite nuevamente el valor a consignar`))
    }
    
    
    const transaccion={
        usuarioConsignacion: usuarioActivo,
        tipoTransaccion:"Consignación",
        valorConsignado: valorAConsignar,
        fechaTransaccion: new Date()
    }

    let directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    directorioTransacciones.push(transaccion);
    localStorage.setItem("TransaccionesRegistro",JSON.stringify(directorioTransacciones))

    console.log(`Resumen de la transacción:
        Tipo de transacción: ${transaccion.tipoTransaccion}
        Valor consignado:    ${transaccion.valorConsignado.toLocaleString("en-US")}
        fecha de transacción ${transaccion.fechaTransaccion}
        `);
    Transacciones()
}