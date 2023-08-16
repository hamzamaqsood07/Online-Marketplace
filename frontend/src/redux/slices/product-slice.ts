import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust the path

export interface Product {
    [key: string]: any;
    id: number;
    title: string;
    pictures: string[];
    description: string;
    price: number;
    quantity: number;
}

interface ProductsState {
    products: Product[];
}

const initialState: ProductsState = {
    products: [],
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },
        clearProducts: state => {
            state.products = [];
        }
    },
});

export const { fetchProducts, clearProducts } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;

export default productsSlice.reducer;
