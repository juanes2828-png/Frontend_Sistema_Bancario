// Iniciar la aplicación
Autenticacion();

function Autenticacion() {
    let salir = false;
    
    // Se utiliza un ciclo while para mantener el menú principal activo sin recursividad
    while (!salir) {
        console.log("<--| REGISTRO Y AUTENTICACIÓN |-->");
        let seleccionInicioSesion = Number(prompt("<--<< Inicio de Sesión >>-->\n1. Iniciar sesión \n2. Registrarse\n3. Salir"));

        switch (seleccionInicioSesion) {
            case 1:
                iniciarSesion();
                break;
            case 2:
                registro();
                break;
            case 3:
                console.log("Muchas gracias por utilizar nuestro servicio. Hasta pronto.");
                salir = true;
                break;
            default:
                console.log("No ha seleccionado una opción válida. Intente de nuevo.");
                break;
        }
    }
}

// Función Registro de usuario
function registro() {
    let identificacion = Number(prompt("Identificación:"));
    while (!identificacion || identificacion <= 0) {
        identificacion = Number(prompt("Identificación no válida. Ingrese su número de identificación:"));
    }

    const usuariosRegistrados = JSON.parse(localStorage.getItem("datosRegistro")) || [];
    
    // Validar si el usuario ya existe
    const buscarId = usuariosRegistrados.find(usuario => usuario.idAlmLocal === identificacion);
    if (buscarId) {
        console.log("El usuario con esta identificación ya existe. Por favor inicie sesión.");
        return;
    } 

    let usuario = prompt("Usuario:");
    while (usuario === null || usuario.trim() === "") {
        usuario = prompt("El campo no debe quedar vacío.\nEscribe un nombre de usuario:");
    }

    // Validar que el nombre de usuario sea único
    const buscarNombre = usuariosRegistrados.find(u => u.usuarioAlmLocal === usuario);
    if (buscarNombre) {
        console.log("El nombre de usuario ya está en uso. Intente registrarse nuevamente con otro nombre.");
        return;
    }

    let correo = prompt("Correo:");
    while (correo === null || correo.trim() === "") {
        correo = prompt("Correo:");
    }

    let clave = prompt("Digite una clave. Debe tener entre 8 y 16 caracteres:");
    while (clave === null || clave.length < 8 || clave.length > 16) {
        clave = prompt("No cumpliste con los requisitos.\nDigita nuevamente clave (entre 8 y 16 caracteres):");
    }

    let repetirClave = prompt("Repita la clave:");
    while (clave !== repetirClave) {
        repetirClave = prompt("La clave no coincide con la anterior. Vuelva a intentarlo:");
    }

    // Almacenamiento local
    const datosUsuario = {
        idAlmLocal: identificacion,
        usuarioAlmLocal: usuario,
        correoAlmLocal: correo,
        claveAlmLocal: clave,
        bloqueadoHasta: null // Para manejar el bloqueo de 24 horas
    };

    usuariosRegistrados.push(datosUsuario);
    localStorage.setItem("datosRegistro", JSON.stringify(usuariosRegistrados));

    let ultimoRegistro = usuariosRegistrados.at(-1);

    console.log(`Se ha registrado el siguiente usuario:
        Identificación: ${ultimoRegistro.idAlmLocal}
        Usuario:        ${ultimoRegistro.usuarioAlmLocal}
        Correo:         ${ultimoRegistro.correoAlmLocal}
        Contraseña:     ********`);
    
    console.log("\nUsuario registrado con éxito. Vuelva e inicie sesión.");
}

function iniciarSesion() {
    const usuariosArray = JSON.parse(localStorage.getItem("datosRegistro")) || [];
    
    const usuarioInicioSesion = prompt("Usuario:");
    const usuarioEncontrado = usuariosArray.find(u => u.usuarioAlmLocal === usuarioInicioSesion);

    if (!usuarioEncontrado) {
        console.log("El usuario no existe. Verifique sus datos o regístrese.");
        return;
    }

    // Validar si la cuenta está bloqueada (24 horas = 86400000 milisegundos)
    if (usuarioEncontrado.bloqueadoHasta && new Date().getTime() < usuarioEncontrado.bloqueadoHasta) {
        console.log("Cuenta bloqueada. Inténtelo de nuevo pasadas 24 horas.");
        return;
    }

    let datosCorrectos = false;
    let contadorAccesoDenegado = 0;
    let contrasenaInicioSesion = prompt("Contraseña:");

    while (!datosCorrectos && contadorAccesoDenegado < 3) {
        if (usuarioEncontrado.claveAlmLocal === contrasenaInicioSesion) {
            datosCorrectos = true;
            console.log(`Acceso correcto. Bienvenido, ${usuarioInicioSesion}.`);
            
            // Restablecer el bloqueo si entra con éxito
            usuarioEncontrado.bloqueadoHasta = null;
            actualizarUsuarioStorage(usuariosArray, usuarioEncontrado);

            Transacciones(usuarioInicioSesion);
        } else {
            contadorAccesoDenegado++;
            if (contadorAccesoDenegado < 3) {
                contrasenaInicioSesion = prompt(`Contraseña incorrecta. Intento ${contadorAccesoDenegado} de 3. Ingrese nuevamente:`);
            }
        }
    }

    // Bloquear la cuenta si falla 3 veces
    if (contadorAccesoDenegado === 3) {
        console.log("Cuenta bloqueada por 24 horas tras 3 intentos fallidos.");
        usuarioEncontrado.bloqueadoHasta = new Date().getTime() + 86400000; // Bloqueo de 24h
        actualizarUsuarioStorage(usuariosArray, usuarioEncontrado);
    }
}

// Función auxiliar para actualizar los datos de un usuario en el localStorage
function actualizarUsuarioStorage(arrayUsuarios, usuarioActualizado) {
    const indice = arrayUsuarios.findIndex(u => u.idAlmLocal === usuarioActualizado.idAlmLocal);
    if (indice !== -1) {
        arrayUsuarios[indice] = usuarioActualizado;
        localStorage.setItem("datosRegistro", JSON.stringify(arrayUsuarios));
    }
}

function Transacciones(usuarioActivo) {
    let cerrarSesion = false;
    
    // Bucle para mantener la sesión abierta hasta que el usuario decida salir
    while (!cerrarSesion) {
        const seleccion = Number(prompt(`--- Menú Transacciones (${usuarioActivo}) ---
        1. Retirar Dinero
        2. Consultar saldo
        3. Consignar
        4. Consultar movimientos
        5. Transferencia entre usuarios
        6. Salir`));

        switch (seleccion) {
            case 1: 
                RetirarDinero(usuarioActivo);
                break;
            case 2: 
                ConsultarSaldo(usuarioActivo);
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
                console.log("Sesión cerrada. Hasta pronto.");
                cerrarSesion = true;
                break;
            default:
                console.log("No seleccionó una opción válida.");
        }
    }
}

// Función auxiliar para calcular el saldo leyendo el historial de transacciones
function obtenerSaldoActual(usuarioActivo) {
    let saldo = 0;
    const directorioTransacciones = JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    
    for (let objeto of directorioTransacciones) {
        if (objeto.usuarioTransaccion === usuarioActivo) {
            saldo += objeto.valor; // Los retiros se guardan en negativo, las consignaciones en positivo
        }
    }
    return saldo;
}

function ConsultarSaldo(usuarioActivo) {
    let saldo = obtenerSaldoActual(usuarioActivo);
    console.log(`Tu saldo actual es: $${saldo.toLocaleString("en-US")}`);
}

function RetirarDinero(usuarioActivo) {
    let saldoActual = obtenerSaldoActual(usuarioActivo);
    
    if (saldoActual <= 0) {
        console.log("No tienes fondos suficientes para realizar un retiro.");
        return;
    }

    let valorARetirar = Number(prompt(`Saldo disponible: $${saldoActual.toLocaleString("en-US")}\nDigite el valor a retirar:`));
    
    while (isNaN(valorARetirar) || valorARetirar <= 0) {
        valorARetirar = Number(prompt("Debe diligenciar un valor positivo. Digite nuevamente el valor a retirar:"));
    }

    if (valorARetirar > saldoActual) {
        console.log(`Fondos insuficientes. Intentaste retirar $${valorARetirar}, pero tu saldo es $${saldoActual}.`);
        return;
    }

    const transaccion = {
        usuarioTransaccion: usuarioActivo,
        tipoTransaccion: "Retiro",
        valor: -valorARetirar, // Se guarda como negativo para que reste al calcular el saldo
        fechaTransaccion: new Date().toLocaleString()
    };

    let directorioTransacciones = JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    directorioTransacciones.push(transaccion);
    localStorage.setItem("TransaccionesRegistro", JSON.stringify(directorioTransacciones));

    console.log(`Retiro exitoso.\nValor retirado: $${valorARetirar.toLocaleString("en-US")}\nNuevo saldo: $${(saldoActual - valorARetirar).toLocaleString("en-US")}`);
}

function Consignar(usuarioActivo) {
    let valorAConsignar = Number(prompt("Digite el valor a consignar:"));
    
    while (isNaN(valorAConsignar) || valorAConsignar <= 0) {
        valorAConsignar = Number(prompt("Debe diligenciar un valor positivo. Digite nuevamente el valor a consignar:"));
    }
    
    const transaccion = {
        usuarioTransaccion: usuarioActivo,
        tipoTransaccion: "Consignación",
        valor: valorAConsignar,
        fechaTransaccion: new Date().toLocaleString()
    };

    let directorioTransacciones = JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    directorioTransacciones.push(transaccion);
    localStorage.setItem("TransaccionesRegistro", JSON.stringify(directorioTransacciones));

    console.log(`Resumen de la transacción:
        Tipo: ${transaccion.tipoTransaccion}
        Valor: $${transaccion.valor.toLocaleString("en-US")}
        Fecha: ${transaccion.fechaTransaccion}`);
}

function ConsultarMovimientos(usuarioActivo) {
    const directorioTransacciones = JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];
    
    // Se utiliza el método filter (arreglos) para traer solo las transacciones del usuario logueado
    const misMovimientos = directorioTransacciones.filter(t => t.usuarioTransaccion === usuarioActivo);

    if (misMovimientos.length === 0) {
        console.log("No tienes movimientos registrados.");
        return;
    }

    console.log(`--- Movimientos de ${usuarioActivo} ---`);
    misMovimientos.forEach((movimiento, index) => {
        let signo = movimiento.valor > 0 ? "+" : "";
        console.log(`${index + 1}. [${movimiento.fechaTransaccion}] ${movimiento.tipoTransaccion}: ${signo}$${movimiento.valor.toLocaleString("en-US")}`);
    });
}

function TransferenciaEntreUsuarios(usuarioActivo) {
    let usuarioDestino = prompt("Ingrese el nombre de usuario al que desea transferir:");
    
    if (usuarioDestino === usuarioActivo) {
        console.log("No puedes transferir dinero a tu propia cuenta por este medio. Usa la opción 'Consignar'.");
        return;
    }

    const usuariosRegistrados = JSON.parse(localStorage.getItem("datosRegistro")) || [];
    const existeDestino = usuariosRegistrados.find(u => u.usuarioAlmLocal === usuarioDestino);

    if (!existeDestino) {
        console.log("El usuario destino no existe. Verifique el nombre.");
        return;
    }

    let saldoActual = obtenerSaldoActual(usuarioActivo);
    if (saldoActual <= 0) {
        console.log("No tienes fondos para realizar transferencias.");
        return;
    }

    let valorTransferir = Number(prompt(`Saldo disponible: $${saldoActual.toLocaleString("en-US")}\n¿Cuánto dinero deseas transferir a ${usuarioDestino}?`));

    while (isNaN(valorTransferir) || valorTransferir <= 0) {
        valorTransferir = Number(prompt("Debe diligenciar un valor positivo válido. Digite nuevamente:"));
    }

    if (valorTransferir > saldoActual) {
        console.log("Fondos insuficientes para realizar esta transferencia.");
        return;
    }

    let directorioTransacciones = JSON.parse(localStorage.getItem("TransaccionesRegistro")) || [];

    // 1. Crear el movimiento de salida (retiro) para el usuario activo
    directorioTransacciones.push({
        usuarioTransaccion: usuarioActivo,
        tipoTransaccion: `Transferencia enviada a ${usuarioDestino}`,
        valor: -valorTransferir,
        fechaTransaccion: new Date().toLocaleString()
    });

    // 2. Crear el movimiento de entrada (consignación) para el usuario destino
    directorioTransacciones.push({
        usuarioTransaccion: usuarioDestino,
        tipoTransaccion: `Transferencia recibida de ${usuarioActivo}`,
        valor: valorTransferir,
        fechaTransaccion: new Date().toLocaleString()
    });

    localStorage.setItem("TransaccionesRegistro", JSON.stringify(directorioTransacciones));
    console.log(`Transferencia exitosa. Has enviado $${valorTransferir.toLocaleString("en-US")} a ${usuarioDestino}.`);
}