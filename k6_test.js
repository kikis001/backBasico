import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"
import { check } from 'k6'
import http from 'k6/http'

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000/api/v1/pizzas'

export const options = {
    vus: 1,
    iterations: 1,
}

export default function () {
    const pizzaId = Math.floor(Math.random() * 900000) + 100000
    const headers = { 'Content-Type': 'application/json' }

    // 1. POST - Crear pizza
    const payloadCrear = JSON.stringify({
        id: pizzaId,
        nombre: 'Pizza K6 Margarita'
    })
    const resCrear = http.post(baseUrl, payloadCrear, { headers })
    check(resCrear, {
        '1. POST Crear pizza status 201': (r) => r.status == 201
    })

    // 2. GET - Obtener todas las pizzas
    const resObtenerTodas = http.get(baseUrl)
    check(resObtenerTodas, {
        '2. GET Obtener todas las pizzas status 200': (r) => r.status == 200
    })

    // 3. GET - Obtener pizza por ID
    const resObtenerPorId = http.get(`${baseUrl}/${pizzaId}`)
    check(resObtenerPorId, {
        '3. GET Obtener pizza por ID status 200': (r) => r.status == 200
    })

    // 4. PUT - Actualizar pizza
    const payloadActualizar = JSON.stringify({
        nombre: 'Pizza K6 Cuatro Quesos'
    })
    const resActualizar = http.put(`${baseUrl}/${pizzaId}`, payloadActualizar, { headers })
    check(resActualizar, {
        '4. PUT Actualizar pizza status 200': (r) => r.status == 200
    })

    // 5. DELETE - Eliminar pizza
    const resEliminar = http.del(`${baseUrl}/${pizzaId}`)
    check(resEliminar, {
        '5. DELETE Eliminar pizza status 200': (r) => r.status == 200
    })
}

export function handleSummary(data) {
    return {
        "index.html": htmlReport(data)
    }
}
