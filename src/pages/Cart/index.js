import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { FiPlusCircle, FiMinusCircle, FiXCircle } from 'react-icons/fi'

import whatsappIcon from '../../assets/whatsapp.svg'

import * as CartActions from '../../store/modules/cart/actions'
import './styles.css'

import api from '../../services/api'

export default function Cart() {
    const [store, setStore] = useState([])

    useEffect(() => {
        async function loadStore() {
            const response = await api.get('loja')

            setStore(response.data)
        }

        loadStore()
    }, [])

    const cart = useSelector(state =>
        state.cart.map(product => ({
            ...product,
            subtotal: product.priceUnit * product.amount
        })))

    const total = useSelector(state =>
        state.cart.reduce((totalSum, product) => {
            return totalSum + product.priceUnit * product.amount
        }, 0)
    )

    const dispatch = useDispatch()

    function increment(product) {
        dispatch(CartActions.updateAmount({
            id: product.id,
            amount: product.amount + 1
        }))
    }

    function decrement(product) {
        dispatch(CartActions.updateAmount({
            id: product.id,
            amount: product.amount - 1
        }))
    }

    return (
        <main className="container">
            <div className="bag-container">
                <table className="book-table">
                    <thead>
                        <tr>
                            <th />
                            <th>Livro</th>
                            <th>Quantidade</th>
                            <th>Subtotal</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.avatar} alt={product.name} />
                                </td>
                                <td>
                                    <strong>{product.name}</strong>
                                    <span>R$ {product.priceUnit}</span>
                                </td>
                                <td>
                                    <div>
                                        <button type="button" onClick={() => decrement(product)}>
                                            <FiMinusCircle size={20} color="#33BFCB" />
                                        </button>
                                        <input type="number" readOnly value={product.amount} />
                                        <button type="button" onClick={() => increment(product)}>
                                            <FiPlusCircle size={20} color="#33BFCB" />
                                        </button>
                                    </div>
                                    
                                    <p style={{ fontSize:10, marginTop: 8 }}>{product.unitsInStock} disponíveis</p>
                                </td>
                                <td>
                                    <strong>R$ {product.subtotal.toFixed(3).slice(0, -1)}</strong>
                                </td>
                                <td>
                                    <button type="button" onClick={() => dispatch(CartActions.removeFromCart(product.id))}>
                                        <FiXCircle size={20} color="#33BFCB" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <footer>
                    {store.map(loja => (
                        <a key={loja.id} target="_blank" href={`https://wa.me/+55${loja.whatsapp}?text=
                        Pedido+%24%7Bnome+da+empresa%7D+%23%24%7BcodidoPedido%7D+-+Cerveja+Artesanal+Panka%0D%0A---------------------------------------%0D%0A++++++++++++++++++++++++%0D%0A%24%7BquantidadeProduto%7D+%24%7BnomeProduto%7D+R%24+%24%7BvalorProduto%7D%0D%0A++++++++++++++++++++++++%0D%0ASubtotal%3A+R%24+%24%7B%7D%0D%0ADesconto+para+retirar%2810%25%29%3A+R%24+%24%7B%7D%0D%0ATotal+com+desconto%3A+R%24+%24%7B%7D%0D%0A++++++++++++++++++++++++%0D%0A---------------------------------------%0D%0A++++++++++++++++++++++++%0D%0A%24%7BnomeCliente%7D%0D%0A%24%7BnumeroCliente%7D%0D%0A++++++++++++++++++++++++%0D%0A%24%7BtipoRetirada%7D%0D%0A++++++++++++++++++++++++%0D%0APagamento%3A+%24%7BtipoPagamento%7D%0D%0ATroco+para%3A+R%24+%24%7Bcaso+seja+dinheiro%7D%0D%0A++++++++++++++++++++++++%0D%0ACPF%3A+%24%7BnumeroCPF%7D%0D%0A++++++++++++++++++++++++%0D%0APedido+gerado+pelo+%24%7BnomeEmpresa%7D+%C3%A0s+%24%7BhoraAtual%7D
                        `} >
                            <img src={whatsappIcon} alt="Whatsapp" />
                        Fazer pedido
                        </a>
                    ))}

                    <div className="total">
                        <span>Total</span>
                        <strong>R$ {total.toFixed(3).slice(0, -1)}</strong>
                    </div>
                </footer>
            </div>
        </main>
    )
}