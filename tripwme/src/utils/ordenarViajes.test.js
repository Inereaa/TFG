
// PRUEBA UNITARIA

import { ordenarViajes } from "./ordenarViajes";

const mockViajes = [
  { presupuestoMinimo: 200, fechaInicio: "2025-06-20" },
  { presupuestoMinimo: 100, fechaInicio: "2025-06-15" },
  { presupuestoMinimo: 300, fechaInicio: "2025-07-01" },
];

describe("ordenarViajes", () => {
  it("ordena por 'Precio (más caro primero)'", () => {
    const result = ordenarViajes(mockViajes, "Precio (más caro primero)");
    expect(result[0].presupuestoMinimo).toBe(300);
  });

  it("ordena por 'Precio (más bajo primero)'", () => {
    const result = ordenarViajes(mockViajes, "Precio (más bajo primero)");
    expect(result[0].presupuestoMinimo).toBe(100);
  });

  it("ordena por 'Fecha (más próxima primero)'", () => {
    const result = ordenarViajes(mockViajes, "Fecha (más próxima primero)");
    expect(result[0].fechaInicio).toBe("2025-06-15");
  });

  it("ordena por 'Fecha (más lejana primero)'", () => {
    const result = ordenarViajes(mockViajes, "Fecha (más lejana primero)");
    expect(result[0].fechaInicio).toBe("2025-07-01");
  });
});
