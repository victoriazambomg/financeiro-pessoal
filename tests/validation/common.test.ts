import { isDataValida, isMesValido, temNoMaximoDuasCasas } from '../../src/validation/common';

describe('validação comum', () => {
  it.each(['2026-11-05', '2024-02-29', '2026-12-31'])('aceita data válida %s', (data) => {
    expect(isDataValida(data)).toBe(true);
  });

  it.each(['2026-02-30', '2025-02-29', '2026-13-01', '05/11/2026', '2026-1-5', '', 20261105, null])(
    'rejeita data inválida %p',
    (data) => {
      expect(isDataValida(data)).toBe(false);
    },
  );

  it.each(['2026-01', '2026-12'])('aceita mês válido %s', (mes) => {
    expect(isMesValido(mes)).toBe(true);
  });

  it.each(['2026-00', '2026-13', '11-2026', '2026-1', undefined])('rejeita mês inválido %p', (mes) => {
    expect(isMesValido(mes)).toBe(false);
  });

  it.each([10, 10.5, 150.75, 0.01, 1234567.89])('aceita %p com até 2 casas', (valor) => {
    expect(temNoMaximoDuasCasas(valor)).toBe(true);
  });

  it.each([10.999, 0.001, 1.234])('rejeita %p com mais de 2 casas', (valor) => {
    expect(temNoMaximoDuasCasas(valor)).toBe(false);
  });
});
