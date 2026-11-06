// Ejemplo didáctico de una regla insuficiente, NO usada por la aplicación final.
function isValidProduct(p) { return !!p && !!p.name && !!p.price && !!p.stock; }
module.exports = { isValidProduct };
