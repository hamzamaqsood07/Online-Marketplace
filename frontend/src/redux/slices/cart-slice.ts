import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust the path

export interface Product {
    id: number;
    title: string;
    price: number;
    quantity: number;
}

interface CartState {
    products: Product[];
}

const initialState: CartState = {
    products: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        incrementToCart: (state, action: PayloadAction<Product>) => {
            const productToAdd = action.payload;
            const existingProduct = state.products.find(product => product.id === productToAdd.id);

            if (existingProduct) {
                // Product is already in the cart, increment its quantity
                existingProduct.quantity += 1;
            } else {
                // Product is not in the cart, add it with quantity 1
                state.products.push({ ...productToAdd, quantity: 1 });
            }
        },
        decrementFromCart: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            const existingProduct = state.products.find(product => product.id === productId);
            
            if (existingProduct) {
                // Reduce the quantity of the existing product
                existingProduct.quantity -= 1;
                
                // If quantity becomes zero, remove the product from the cart
                if (existingProduct.quantity === 0) {
                    state.products = state.products.filter(product => product.id !== productId);
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            const existingProduct = state.products.find(product => product.id === productId);
    
            if (existingProduct) {
                state.products = state.products.filter(product => product.id !== productId);
            }
        },
        clearCart: (state) => {
            state.products = [];
        }
    }
});

export const { incrementToCart, decrementFromCart, removeFromCart, clearCart } = cartSlice.actions;

export const selectProducts = (state: RootState) => state.cart.products;

export default cartSlice.reducer;
