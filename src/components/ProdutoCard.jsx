import { Link } from 'react-router'
import { produtoDisponivel } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const indisponivel = !produtoDisponivel(produto)
  const esgotado = Number(produto.estoque ?? 0) === 0
  const semPreco = !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && Number(produto.precoOriginal) > 0 && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{semPreco ? 'Preço a definir' : formatarPreco(produto.price)}</span>
      </div>

      <div className="card-selos">
        {Number(produto.price ?? 0) > 100 && <span className="selo selo-frete">Frete grátis</span>}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
        {semPreco && !esgotado && <span className="selo selo-alerta">Sem preço</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={indisponivel}>
        {esgotado ? 'Esgotado' : semPreco ? 'Sem preço' : 'Adicionar ao carrinho'}
      </button>
    </article>
  )
}
