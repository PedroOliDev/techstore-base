import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { filtrarProdutosDisponiveis, normalizarProdutoId } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse, listaEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => normalizarProdutoId(item.id) === normalizarProdutoId(id))
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const indisponivel = !filtrarProdutosDisponiveis([produto]).length
  const semPreco = !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0
  const esgotado = Number(produto.estoque ?? 0) === 0

  const relacionados = filtrarProdutosDisponiveis(produtos)
    .filter(
      (item) =>
        item.category === produto.category &&
        normalizarProdutoId(item.id) !== normalizarProdutoId(produto.id)
    )
    .slice(0, 4)

  function registrarEspera(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarInteresse({ produtoId: normalizarProdutoId(produto.id), nome: nome.trim(), email: email.trim() })
    setMensagem('Você foi cadastrado para receber aviso quando o produto voltar.')
    setNome('')
    setEmail('')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {semPreco ? 'Preço a definir' : formatarPreco(produto.price)}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {esgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          {!esgotado && !semPreco && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={indisponivel}
            >
              Adicionar ao carrinho
            </button>
          )}

          {esgotado && (
            <form onSubmit={registrarEspera} className="cupom" style={{ marginTop: '1rem' }}>
              <label className="rotulo">Receber aviso quando voltar</label>
              <div className="cupom-campo" style={{ display: 'grid', gap: '0.5rem' }}>
                <label>
                  <span className="rotulo">Nome</span>
                  <input
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    placeholder="Seu nome"
                    aria-label="Seu nome"
                  />
                </label>
                <label>
                  <span className="rotulo">E-mail</span>
                  <input
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    type="email"
                    placeholder="Seu e-mail"
                    aria-label="Seu e-mail"
                  />
                </label>
                <button className="botao botao-secundario" type="submit">
                  Me avisem
                </button>
              </div>
              {mensagem && <p className="mensagem-cupom">{mensagem}</p>}
            </form>
          )}

          {semPreco && !esgotado && (
            <p className="aviso">Este produto está aguardando definição de preço e não pode ser vendido no momento.</p>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">{formatarPreco(item.price)}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={!filtrarProdutosDisponiveis([item]).length}>
              {Number(item.estoque ?? 0) === 0 ? 'Esgotado' : 'Adicionar ao carrinho'}
            </button>
          </article>
        ))}
      </div>

      {listaEspera.filter((registro) => normalizarProdutoId(registro.produtoId) === normalizarProdutoId(produto.id)).length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <p className="sobretitulo">Lista de espera</p>
          <ul>
            {listaEspera
              .filter((registro) => normalizarProdutoId(registro.produtoId) === normalizarProdutoId(produto.id))
              .map((registro) => (
                <li key={registro.id}>
                  {registro.nome} — {registro.email}
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  )
}
