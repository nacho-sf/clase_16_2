// Suma
// Resta
// Multiplicación
// División

const calculator = {
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => a / b
}

module.exports = calculator; // Esto es para exportar este módulo a mi proyecto
// Para importarlo en el destino se declara "require("./utils/calculator.js")" en el archivo destino

// Pruebas:
// console.log("suma: "+calculator.add (2, 2));
// Para probar un script se escribe la declaración en la terminal "node utils/calculator.js"

