function formatoNumerico(numero: string | number): string {
    // Convertir el número de string a número si es una cadena
    const numeroParseado = typeof numero === 'string' ? parseFloat(numero) : numero;

    // Formatear números con separador de miles, separador decimal y símbolo de peso
    return numeroParseado.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
    });
}

export default formatoNumerico;
