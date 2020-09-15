import React, { useState, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FiShoppingBag } from 'react-icons/fi'

import * as CartActions from '../../store/modules/cart/actions'
import Search from '../../components/Search'

import './styles.css'

import api from '../../services/api'

const initialState = {
    loading: true,
    stores: [],
    errorMessage: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SEARCH_STORE_REQUEST":
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case "SEARCH_STORE_SUCCESS":
            return {
                ...state,
                loading: false,
                stores: action.payload
            }
        case "SEARCH_STORE_FAILURE":
            return {
                ...state,
                loading: false,
                errorMessage: action.error
            }
        default:
            return state
    }
}

const Home = () => {
    const [products, setProducts] = useState([])
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        api.get('store')
            .then(response => response.json())
            .then(jsonResponse => {
                dispatch({
                    type: "SEARCH_STORES_SUCCESS",
                    payload: jsonResponse.Search
                })
            })
    }, [])

    const search = searchValue => {
        dispatch({
            type: "SEARCH_STORES_REQUEST"
        })
        api.get()
    }

    const amount = useSelector(state =>
        state.cart.reduce((sumAmount, product) => {
            sumAmount[product.id] = product.amount

            return sumAmount
        }, {})
    )

    const Dispatch = useDispatch()

    useEffect(() => {
        async function loadProduct() {
            const response = await api.get('products')

            setProducts(response.data)
        }

        loadProduct()
    }, [])

    function handleAddProduct(products) {
        Dispatch(CartActions.addToCart(products))
    }

    const { stores, productItem, errorMessage, loading } = state
    return (
        <main className="container">
            <Search search={search} />
            <ul className="book-catalog">
                {products.map(product => (
                    <li key={product.id} className="book-container">
                        <img src={product.avatar} alt={product.name} />
                        <strong>{product.name}</strong>
                        <span>R$ {product.priceUnit}</span>

                        <button type="button" onClick={() => handleAddProduct(product)}>
                            <div>
                                <FiShoppingBag size={16} color="#33BFCB" />{' '}
                                {amount[product.id] || 0}
                            </div>

                            <span>Adiocionar</span>
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default Home