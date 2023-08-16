import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, clearProducts} from '../redux/slices/product-slice'
import axios from 'axios';
import { RootState } from '../redux/store';
import { useEffect } from 'react';

const baseImageUrl = 'images/products/';

const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'pictures', label: 'Picture', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 100 },
    {
        id: 'price',
        label: 'Price',
        minWidth: 100,
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 100,
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

export default function ItemBox(){
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/me', {
                headers: {
                    'x-auth-token': token,
                },
            });
            const responseData = response.data;
            dispatch(fetchProducts(responseData));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
        
        </>
    )
}