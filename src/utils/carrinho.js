// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function normalizarProdutoId(valor) {
  return String(valor ?? '').trim()
}

export function obterPrecoNumerico(produto) {
  const valor = Number(produto?.price ?? 0)
  return Number.isFinite(valor) ? valor : 0
}

export function produtoDisponivel(produto) {
  const estoque = Number(produto?.estoque ?? 0)
  const preco = Number(produto?.price ?? 0)

  return estoque > 0 && Number.isFinite(preco) && preco > 0
}

export function filtrarProdutosDisponiveis(produtos) {
  return produtos.filter((produto) => produtoDisponivel(produto))
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => total + obterPrecoNumerico(produto), 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const idProduto = normalizarProdutoId(produto.id)
    const existente = itens.find((item) => normalizarProdutoId(item.produto.id) === idProduto)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
