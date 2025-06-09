
// PRUEBA UNITARIA

/**
 * Ordena una lista de viajes según el criterio dado.
 *
 * @param {Array} viajes - Lista de objetos de viaje.
 * @param {string} orden - Criterio de ordenación.
 * @returns {Array} Lista ordenada de viajes.
 */
export function ordenarViajes(viajes, orden) {
  switch (orden) {
    case "Precio (más caro primero)":
      return [...viajes].sort((a, b) => b.presupuestoMinimo - a.presupuestoMinimo);
    case "Precio (más bajo primero)":
      return [...viajes].sort((a, b) => a.presupuestoMinimo - b.presupuestoMinimo);
    case "Fecha (más próxima primero)":
      return [...viajes].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    case "Fecha (más lejana primero)":
      return [...viajes].sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
    default:
      return viajes;
  }
}
