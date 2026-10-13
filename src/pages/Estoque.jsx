import { normalizarProdutoId } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => Number(a.estoque ?? 0) - Number(b.estoque ?? 0))
  const categorias = ['roupas', 'eletronicos', 'acessorios', 'casa']

  const clientesEspera = listaEspera.reduce((acumulador, registro) => {
    const chave = normalizarProdutoId(registro.produtoId)
    acumulador[chave] = acumulador[chave] ? [...acumulador[chave], registro] : [registro]
    return acumulador
  }, {})

  const valorEmEstoquePorCategoria = categorias.map((categoria) => {
    const itens = produtos.filter((produto) => produto.category === categoria)
    const valor = itens.reduce(
      (total, produto) => total + Number(produto.price ?? 0) * Number(produto.estoque ?? 0),
      0
    )
    const margem = itens.reduce((total, produto) => {
      const preco = Number(produto.price ?? 0)
      const margemUnitaria = Number(produto.precoOriginal ?? 0)
        ? Number(produto.precoOriginal) - preco
        : preco * 0.25
      return total + margemUnitaria * Number(produto.estoque ?? 0)
    }, 0)

    return {
      categoria,
      valor,
      margem,
      esperandoPreco: itens.filter((produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0).length,
    }
  })

  const totalEmEstoque = valorEmEstoquePorCategoria.reduce((total, categoria) => total + categoria.valor, 0)
  const totalLucroEstimado = valorEmEstoquePorCategoria.reduce((total, categoria) => total + categoria.margem, 0)
  const aguardandoPreco = produtos.filter(
    (produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0
  )

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Painel do lojista</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', margin: '1rem 0 1.5rem' }}>
        <div className="resumo">
          <h2>Valor em estoque</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatarPreco(totalEmEstoque)}</p>
        </div>
        <div className="resumo">
          <h2>Lucro estimado</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatarPreco(totalLucroEstimado)}</p>
        </div>
        <div className="resumo">
          <h2>Aguardando preço</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{aguardandoPreco.length}</p>
        </div>
        <div className="resumo">
          <h2>Clientes na fila</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{listaEspera.length}</p>
        </div>
      </div>

      <div className="tabela-moldura" style={{ marginBottom: '1.5rem' }}>
        <table className="tabela">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Valor em estoque</th>
              <th>Lucro estimado</th>
              <th>Aguardando preço</th>
            </tr>
          </thead>
          <tbody>
            {valorEmEstoquePorCategoria.map((item) => (
              <tr key={item.categoria}>
                <td>{item.categoria}</td>
                <td>{formatarPreco(item.valor)}</td>
                <td>{formatarPreco(item.margem)}</td>
                <td>{item.esperandoPreco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {!Number.isFinite(Number(produto.price)) && (
                    <span className="selo selo-alerta">Aguardando preço</span>
                  )}
                  {produto.estoque > 0 && produto.estoque < 5 && Number.isFinite(Number(produto.price)) && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && Number.isFinite(Number(produto.price)) && (
                    <span className="selo selo-ok">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(clientesEspera).length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Clientes esperando produto voltar</h2>
          <div className="tabela-moldura">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(clientesEspera).map(([produtoId, registros]) => {
                  const produto = produtos.find(
                    (item) => normalizarProdutoId(item.id) === normalizarProdutoId(produtoId)
                  )

                  return registros.map((registro) => (
                    <tr key={registro.id}>
                      <td>{produto ? produto.title : 'Produto removido'}</td>
                      <td>{registro.nome}</td>
                      <td>{registro.email}</td>
                    </tr>
                  ))
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
