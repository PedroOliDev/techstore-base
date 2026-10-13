const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = String(codigo ?? '').trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false }
  }

  if (!cliente) {
    return { valido: false }
  }

  if (codigoNormalizado === 'PRIMEIRACOMPRA') {
    const pedidosAnteriores = Number(cliente?.pedidosAnteriores ?? 0)

    if (!Number.isFinite(pedidosAnteriores) || pedidosAnteriores > 0) {
      return { valido: false }
    }
  }

  return { valido: true, desconto }
}
