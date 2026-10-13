import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularTotal, filtrarProdutosDisponiveis } from './carrinho.js'

test('calcularTotal soma preços mesmo quando vierem em string', () => {
    const carrinho = [
        { id: '1', price: '49.90' },
        { id: '2', price: '189.90' },
    ]

    assert.equal(calcularTotal(carrinho), 239.8)
})

test('filtrarProdutosDisponiveis remove todos os itens indisponíveis', () => {
    const produtos = [
        { id: '1', estoque: 6, price: 49.9 },
        { id: '2', estoque: 0, price: 189.9 },
        { id: '3', estoque: 3, price: '' },
        { id: '4', estoque: 7 },
    ]

    assert.deepEqual(
        filtrarProdutosDisponiveis(produtos).map((produto) => produto.id),
        ['1']
    )
})
