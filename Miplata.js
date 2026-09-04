Autenticacion()

function Autenticacion(){
    console.log("<--| REGISTRO Y AUTENTICACIÓN |-->");

    let seleccionInicioSesion=Number(prompt("<--<< Inicio de Sesión >>-->\n1. Iniciar sesión \n2. Registrarse\n3. Salir"));

    //Validación ingreso. Debe seleccionar 1 o 2 hasta que se canse
    while (seleccionInicioSesion<1 || seleccionInicioSesion>3){
        seleccionInicioSesion=Number(prompt("No ha seleccionado una opción válida:\n1. Iniciar sesión\n2. Registrarse\n3. Salir"));    
    }

    // Seleccionar si quiere iniciar sesión, registrarse o salir
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
    
        identificacion=Number(prompt("identificacion"))
    
    //Consultar la base de datos de los usuarios
    const usuariosRegistrados = JSON.parse(localStorage.getItem("datosRegistro")) || [];
    
    //Valida si la identificación del usuario ya existe y solicita ingresar nuevamente la información
    let buscarId=usuariosRegistrados.find(usuarioLocal => usuarioLocal.idAlmLocal===identificacion);
    console.log(buscarId);
    while(buscarId){
        identificacion=Number(prompt("Ya existe un usuario con este número de identificación.\nInicia sesión."));
        buscarId=usuariosRegistrados.find(usuarioLocal => usuarioLocal.idAlmLocal===identificacion);
    }
     
    let usuario=prompt("Usuario")
    while (usuario===null || usuario.trim()===""){
        usuario=prompt(`El campo no debe quedar vacío
            Escribe un nombre de usuario`)    
    }
    // valida si el nombre de usuario ya existe y solicita ingrear la información nuevamente
    let buscarUsuario=usuariosRegistrados.find(usuarioLocal => usuarioLocal.usuarioAlmLocal===usuario);
    while(buscarUsuario){
        usuario=prompt("Ya existe un usuario registrado con ese nombre. Inténtalo de nuevo")
        buscarUsuario=usuariosRegistrados.find(usuarioLocal => usuarioLocal.usuarioAlmLocal===usuario);
    }

    let correo=""
    while (correo===null || correo.trim()===""){
        correo=prompt("Correo");
    }
    let clave=prompt("Digite una clave. Debe tener entre 8 y 16 caracteres");
    
    //Valida que la clave tenga entre 8 y 16 caracteres. Si no, repite el proceso
    while(clave.length<8 || clave.length>16){
        clave=prompt("No cumpliste con los requisitos para crear la clave. \nDigite nuevamente clave. Debe tener entre 8 y 16 caracteres");
    }
    let repetirClave=prompt("Repita la clave:");
    
    //Valida que las dos claves coincidan
    while(clave!=repetirClave){
        repetirClave=prompt("La clave no coincide con la anterior. Vuelva a intentarlo")
    }

    //Crea el objeto datosUsuario para almacenar en el arreglo datosRegistro
    const datosUsuario={
        idAlmLocal:identificacion,
        usuarioAlmLocal:usuario,
        correoAlmLocal: correo,
        claveAlmLocal: clave,

    }

    //Busca el arreglo, pega el objeto al arreglo y lo actualiza
    let directorioUsuarios=JSON.parse(localStorage.getItem("datosRegistro")) || [];
    directorioUsuarios.push(datosUsuario);
    localStorage.setItem("datosRegistro",JSON.stringify(directorioUsuarios))

    let recuperado=JSON.parse(localStorage.getItem("datosRegistro"))
    //Muestra el último registro almacenado
    let ultimoRegistro=recuperado.at(-1)

    
    console.log(`Se ha registrado el siguiente usuario:
        identificacion: ${ultimoRegistro.idAlmLocal}
        usuario:        ${ultimoRegistro.usuarioAlmLocal}
        correo:         ${ultimoRegistro.correoAlmLocal}
        contraseña:     ********`);
    
        console.log("\nUsuario registrado con éxito. Regrese para iniciar sesión");
    Autenticacion()
    
}


function iniciarSesion(){
    let contadorAccesoDenegado=0
    let usuarioInicioSesion=prompt("Usuario");
    
    //Se llama la base de datos local
    const directorioUsuarios=JSON.parse(localStorage.getItem("datosRegistro") || "[]")
    /* let usuarioCorrecto=directorioUsuarios.some(usuarioObjeto=>{
        return usuarioObjeto.usuarioAlmLocal===usuarioInicioSesion
    })
    while(!usuarioCorrecto){
        console.log("El usuario no existe. Por favor regístrese antes de continuar.");
        usuarioCorrecto=true;
        Autenticacion();
    } */
    let contrasenaInicioSesion=prompt("Contraseña")
    
    //Validación el el nombre de usuario exista y que coincida con la clave
    let datosCorrectos=directorioUsuarios.some(datosUsuario=>{
            return datosUsuario.usuarioAlmLocal===usuarioInicioSesion && datosUsuario.claveAlmLocal===contrasenaInicioSesion;
        })
        if (datosCorrectos){
            console.log("Acceso correcto");
            Transacciones(usuarioInicioSesion)
            return usuarioInicioSesion
        }else{
            console.log(`Acceso denegado. Vuelva e intente. (intento ${contadorAccesoDenegado})`);
            contadorAccesoDenegado++
            if (contadorAccesoDenegado==3){
                console.log("Cuenta bloqueada por 24 horas, comunícate con tu banco. Hasta pronto.");
            }
        }
        //
        while(datosCorrectos==false && contadorAccesoDenegado!=3){
        contrasenaInicioSesion=prompt(`Contraseña incorrecta. Inténtalo nuevamente. (Intentos restantes ${3-contadorAccesoDenegado})`)
    let datosCorrectos=directorioUsuarios.some(datosUsuario=>{
            return datosUsuario.usuarioAlmLocal===usuarioInicioSesion && datosUsuario.claveAlmLocal===contrasenaInicioSesion;
        })
        
    if (datosCorrectos){
            console.log("Acceso correcto");
            Transacciones(usuarioInicioSesion)
            
            
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
    let cerrarSesion=false
    while(!cerrarSesion){
        const consultasYMovimientos=Number(prompt(`Consultas y movimientos:
        1. Retirar Dinero
        2. Consultar saldo
        3. Consignar
        4. Consultar movimientos
        5. Transferencia entre usuarios
        6. Regresar al inicio
        7. Salir`))
        switch(consultasYMovimientos){
            case 1: 
                RetirarDinero(usuarioActivo);
                break;
            case 2: 
                MostrarSaldo(usuarioActivo);
                break;
            case 3: 
                Consignar(usuarioActivo);
                break;
            case 4: 
                ConsultarMovimientos(usuarioActivo);
                break;
            case 5: 
                TransferenciaEntreUsuarios(usuarioActivo);
                break;
            case 6:
                console.log("Regresar al inicio");
                Autenticacion();
                break;
            case 7:
                console.log("Sesión cerrada correctamente. Hasta pronto.");
                cerrarSesion=true
                
                break;

            default:
                console.log("No seleccionó una opción válida");
        }
    
    }
}



function RetirarDinero(usuarioActivo){
    const usuarioInicioSesion=usuarioActivo
    //solicitar el valor retirar y se valida que sea mayor a cero
    let valorARetirar=Number(prompt("Digite el valor a retirar:"))
    while (valorARetirar<=0){
        valorARetirar=Number(prompt(`Debe diligenciar un valor positivo.
        Digite nuevamente el valor a retirar`))
    }
    let saldo=ConsultarSaldo(usuarioInicioSesion);
    if (saldo<valorARetirar){
        console.log("No tiene saldo disponible");
    } else{
        
    const transaccion={
        usuarioTransaccion: usuarioInicioSesion,
        tipoTransaccion:"Retiro",
        valor: -valorARetirar,
        fechaTransaccion: new Date()
    }
    
    const directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
        directorioTransacciones.push(transaccion);
        localStorage.setItem("TransaccionesRegistro",JSON.stringify(directorioTransacciones))
    
    let nuevoSaldo=ConsultarSaldo(usuarioActivo);

    console.log(`Transacción exitosa. Resumen de la transacción:
        Usuario:              ${usuarioActivo}
        Tipo de transacción:  "Retiro"
        Valor retirado:       ${valorARetirar.toLocaleString("en-US")}
        Fecha de transacción: ${transaccion.fechaTransaccion}
        Nuevo saldo:          ${(nuevoSaldo).toLocaleString("en-US")}`)

            
    }
}

function ConsultarSaldo(usuarioActivo){
    
    let saldo=0;
    const directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    for (let objeto of directorioTransacciones){
        if (objeto.usuarioTransaccion===usuarioActivo){
            saldo=saldo+objeto.valor
        }
    }
    return saldo;
}

function MostrarSaldo(usuarioActivo){
    let saldo=ConsultarSaldo(usuarioActivo);
    console.log(`Saldo actual: ${saldo.toLocaleString("en-US")}`);
}

function Consignar(usuarioActivo){
    
    //solicitar el valor consignar y se valida que sea mayor a cero
    const usuarioInicioSesion=usuarioActivo
    let valorAConsignar=Number(prompt("Digite el valor a consignar:"))
    while (valorAConsignar<=0){
        valorAConsignar=Number(prompt(`Debe diligenciar un valor positivo.
        Digite nuevamente el valor a consignar`))
    }
    
    
    const transaccion={
        usuarioTransaccion: usuarioInicioSesion,
        tipoTransaccion:"Consignación",
        valor: valorAConsignar,
        fechaTransaccion: new Date()
    }

    let directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    directorioTransacciones.push(transaccion);
    localStorage.setItem("TransaccionesRegistro",JSON.stringify(directorioTransacciones))

    let saldo = ConsultarSaldo(usuarioActivo)
    
    console.log(`Resumen de la transacción:
        Tipo de transacción: ${transaccion.tipoTransaccion}
        Valor consignado:    ${transaccion.valor.toLocaleString("en-US")}
        Fecha de transacción:${transaccion.fechaTransaccion}
        Nuevo saldo:         ${saldo.toLocaleString("en-US")}`);
    Transacciones(usuarioInicioSesion)
    
}

function ConsultarMovimientos(usuarioActivo){
    let directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    let saldo=0
    console.log("-----Informe de transacciones realizadas-----");
    const valoresFiltrados=directorioTransacciones.filter(transaccion=>transaccion.usuarioTransaccion===usuarioActivo)
    valoresFiltrados.forEach(transaccion => {
        console.log(`Fecha: ${transaccion.fechaTransaccion} | Tipo: ${transaccion.tipoTransaccion} | Valor: ${transaccion.valor.toLocaleString("en-US")} | Saldo: ${(saldo=saldo+transaccion.valor).toLocaleString("en-US")}`);    
    });
    
}

function TransferenciaEntreUsuarios(usuarioActivo){
    let directorioUsuarios=JSON.parse(localStorage.getItem("datosRegistro")) || [];
    const valorATransferir=Number(prompt("Digite el valor a transferir:"));
    let saldo=ConsultarSaldo(usuarioActivo)
    if(valorATransferir>saldo){
        console.log("No cuenta con saldo suficiente para realizar la transferencia");

    } else{
        let usuarioATransferir=prompt("Escriba el nombre de usuario a quén le va a transferir:")
        let usuarioCorrecto=directorioUsuarios.some(usuarioObjeto=>{
            return usuarioObjeto.usuarioAlmLocal===usuarioATransferir && usuarioObjeto.usuarioAlmLocal!=usuarioActivo
        })
        while(!usuarioCorrecto){
            usuarioATransferir=prompt("El usuario no existe. No se permite transferencia al mismo usuario.\nEscriba nuevamente el nombre de usuario a quén le va a transferir:");
            usuarioCorrecto=directorioUsuarios.some(usuarioObjeto=>{
            return usuarioObjeto.usuarioAlmLocal===usuarioATransferir && usuarioObjeto.usuarioAlmLocal!=usuarioActivo
            })
        }    
            const transferOrigen={
                usuarioTransaccion:usuarioActivo,
                tipoTransaccion:"Transferencia",
                valor:-valorATransferir,
                fechaTransaccion: new Date()
            };
            
             let directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
            directorioTransacciones.push(transferOrigen);
            localStorage.setItem("TransaccionesRegistro",JSON.stringify(directorioTransacciones))
            directorioTransacciones=JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
            const transferDestino={
                usuarioTransaccion:usuarioATransferir,
                tipoTransaccion:"Transferencia",
                valor:valorATransferir,
                fechaTransaccion: new Date()
                
            }
            directorioTransacciones.push(transferDestino);
            localStorage.setItem("TransaccionesRegistro",JSON.stringify(directorioTransacciones))
            console.log(`-----Resumen de la transacción-----
                Tipo de transacción:  Transferencia
                Valor:                ${valorATransferir.toLocaleString("en-US")}
                Usuario destino:      ${usuarioATransferir}
                Nuevo saldo:          ${(ConsultarSaldo(usuarioActivo)).toLocaleString("en-US")}
                Fecha de transacción: ${new Date()}`);
    }
}