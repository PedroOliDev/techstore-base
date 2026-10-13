import test from 'node:test'
import assert from 'node:assert/strict'

import { validarCupom } from './cupons.js'

test('PRIMEIRACOMPRA vale para cliente sem pedidos anteriores', () => {
    assert.deepEqual(validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 0 }), {
        valido: true,
        desconto: 0.1,
    })
})

test('PRIMEIRACOMPRA ignora clientes com pedidos anteriores', () => {
    assert.deepEqual(validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 3 }), {
        valido: false,
    })
})

test('PRIMEIRACOMPRA rejeita dados inválidos do cliente', () => {
    assert.deepEqual(validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 'invalido' }), {
        valido: false,
    })
})
