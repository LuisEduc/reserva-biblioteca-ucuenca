
// Creador por:
// Luis González (luis.gonzaleza@ucuenca.edu.ec) 
// Roger Aguirre (roger.aguirre@ucuenca.edu.ec)

const intervalo = 3000 // milisegundos
const credenciales = {
    username: "biblioteca@ucuenca.edu.ec",
    password: "biblioteca2020"
}
const campus = "campus central"
const servidor = "http://10.22.114.5"
const reservas = 5


const autenticarUsusario = async (credenciales) => {
    try {
        console.log("autenticarUsusario......")
        const res = await fetch(`${servidor}/booked/Web/Services/index.php/Authentication/Authenticate`, {
            method: "POST",
            body: JSON.stringify(credenciales),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        const data = await res.json()
        localStorage.setItem("sessionToken", data.sessionToken)
        localStorage.setItem("userId", data.userId)
        return data
    } catch (error) {
        console.log(error)
    }
}

autenticarUsusario(credenciales)

const getCubiculos = async () => {
    try {
        console.log("getCubiculos....")
            const res = await fetch(`${servidor}/booked/Web/Services/index.php/Resources`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Booked-SessionToken": localStorage.getItem("sessionToken"),
                "X-Booked-UserId": localStorage.getItem("userId")
            }
        })
        res.status === 401 ? window.location.reload() : ''
        const data = await res.json()
        return data
    } catch (error) {
        console.log("Error", error)
    }
}

getCubiculos()

const getReservaciones = async () => {
    try {
        console.log("getReservaciones....")
            const res = await fetch(`${servidor}/booked/Web/Services/index.php/Reservations`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Booked-SessionToken": localStorage.getItem("sessionToken"),
                "X-Booked-UserId": localStorage.getItem("userId")
            }
        })
        res.status === 401 ? window.location.reload() : ''
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}


const mostrarCubiculos = async () => {
    const data = await getCubiculos()
    let cubiculos = ''
    let index = 0
    data.resources.map(cubiculo => {
        if (cubiculo.location != null && cubiculo.location.toLowerCase().includes(campus.toLowerCase())) {
            ++index
            cubiculos += `
                <li id="nombre_cubiculo_${cubiculo.name}">${cubiculo.name}</li>
			`;
        }
    });
    document.getElementById('nombres_cubiculos').innerHTML = cubiculos
    return index
}

mostrarCubiculos()

const cambiarFecha = (e) => {
    const date = new Date(e)
    const dia = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"]
    const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const fecha = `${dia[date.getDay()]} ${date.getDate()} ${mes[date.getMonth()]} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
    return fecha
}

const mostrarReservaciones = (cubiculo, data_reservaciones) => {
    let reservaciones = ''
    let index = 0
    data_reservaciones.reservations.map(reservacion => {
        if (reservacion.resourceName === cubiculo && index < reservas) {
            ++index
            reservaciones += `
                <tr>
                    <td class="text-center" id="date_start_${index}">${cambiarFecha(reservacion.startDate)}</td>
                    <td class="text-center" id="date_end_${index}">${cambiarFecha(reservacion.endDate)}</td>
                </tr>
        	`
        }
    })

    if (index === 0) {
        reservaciones += `
                <tr>
                    <td class="font-weight-bold text-center cl-libre" >NINGUNA</td>
                    <td class="font-weight-bold text-center cl-libre" >NINGUNA</td>
                </tr>
        	`
    }

    document.getElementById('body_table').innerHTML = reservaciones;
}

const mostrarInfoCubiculos = (cubiculo, data_reservaciones) => {
    let estado = 'LIBRE'
    let _estado = 'OCUPADO'
    let reservacion
    let indice = 0
    for (let index = 0; index < data_reservaciones.reservations.length; index++) {
        reservacion = data_reservaciones.reservations[index]
        if (reservacion.resourceName === `${cubiculo.name}`) {
            ++indice
            const date = new Date()
            const startDate = new Date(reservacion.startDate)
            const endDate = new Date(reservacion.endDate)
            if (startDate.getTime() <= date.getTime() && date.getTime() <= endDate.getTime()) {
                estado = 'OCUPADO'
                _estado = 'LIBRE'
                document.getElementById(`date_start_${indice}`).classList.add(`cl-${estado.toLowerCase()}`, 'font-weight-bold')
                document.getElementById(`date_end_${indice}`).classList.add(`cl-${estado.toLowerCase()}`, 'font-weight-bold')
                break
            } else {
                estado = 'LIBRE'
                _estado = 'OCUPADO'
            }
        }
    }
    let infoCubiculo = `
    <h1>${cubiculo.name}</h1>
    <h2>${cubiculo.location}</h2>
    <div class="div-estado">
        <h3>${estado}</h3>
    </div>
    `
    document.getElementById('info_cubiculo').innerHTML = infoCubiculo
    document.getElementById('hero_area').classList.add(`grad-${estado.toLowerCase()}`)
    document.getElementById('hero_area').classList.remove(`grad-${_estado.toLowerCase()}`)
    document.getElementById('carousel_control_prev').classList.add(`bg-${estado.toLowerCase()}`)
    document.getElementById('carousel_control_prev').classList.remove(`bg-${_estado.toLowerCase()}`)

    return estado
}

const cambioDeCubiculo = (cubiculos, reservaciones, index) => {
    cubiculos.resources.map(cubiculo => {
        if (cubiculo.location != null && cubiculo.location.toLowerCase().includes(campus.toLowerCase())) {
            setTimeout(() => {
                mostrarReservaciones(`${cubiculo.name}`, reservaciones)
                const estado = mostrarInfoCubiculos(cubiculo, reservaciones)
                document.getElementById(`nombre_cubiculo_${cubiculo.name}`).classList.add(`bg-${estado.toLowerCase()}`)
                setTimeout(() => document.getElementById(`nombre_cubiculo_${cubiculo.name}`).classList.remove(`bg-${estado.toLowerCase()}`), intervalo)
            }
                , intervalo * (++index))
        }
    })
}

const loopCubiculos = async () => {
    let index = 0
    const cubiculos = await getCubiculos()
    const total_cubiculos = await mostrarCubiculos()
    const reservaciones = await getReservaciones()
    setInterval(async () => {
        const reservaciones = await getReservaciones()
        setInterval(() => {
            cubiculos.resources.map(cubiculo => {
                if (cubiculo.location != null && cubiculo.location.toLowerCase().includes(campus.toLowerCase())) {
                    setTimeout(() => {
                        mostrarReservaciones(`${cubiculo.name}`, reservaciones)
                        const estado = mostrarInfoCubiculos(cubiculo, reservaciones)
                        document.getElementById(`nombre_cubiculo_${cubiculo.name}`).classList.add(`bg-${estado.toLowerCase()}`)
                        setTimeout(() => document.getElementById(`nombre_cubiculo_${cubiculo.name}`).classList.remove(`bg-${estado.toLowerCase()}`), intervalo)
                    }
                        , intervalo * (++index))
                }
            })
        }, 10)
    }, intervalo * total_cubiculos)

    cubiculos.resources.map(cubiculo => {
        if (cubiculo.location != null && cubiculo.location.toLowerCase().includes(campus.toLowerCase())) {
            setTimeout(() => {
                mostrarReservaciones(`${cubiculo.name}`, reservaciones)
                const estado = mostrarInfoCubiculos(cubiculo, reservaciones)
                document.getElementById(`nombre_cubiculo_${cubiculo.name}`).classList.add(`bg-${estado.toLowerCase()}`)
                setTimeout(() => document.getElementById(`nombre_cubiculo_${cubiculo.name}`).classList.remove(`bg-${estado.toLowerCase()}`), intervalo)
            }
                , intervalo * (++index))
        }
    })
}

loopCubiculos()