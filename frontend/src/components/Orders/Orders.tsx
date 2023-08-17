import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; // Update the import path
import Button from '@mui/material/Button';
import { Container, List, ListItem, ListItemText, Typography, Grid, AppBar, Toolbar, Box } from '@mui/material';

const OrderPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const userType = useSelector((state: RootState) => state.profile.userType);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/me', {
        headers: {
          'x-auth-token': token,
        },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleShipped = async (orderId: number) => {
    try {
      // Implement the logic to update the order status as "shipped"
      // You can use axios to send a PUT request to update the order status
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleReceived = async (orderId: number) => {
    try {
      // Implement the logic to update the order status as "received"
      // You can use axios to send a PUT request to update the order status
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleFilter = (status: string | null) => {
    if (status) {
      setFilteredOrders(orders.filter((order) => order.status === status));
    } else {
      setFilteredOrders(orders);
    }
    setFilterStatus(status);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Button onClick={() => handleFilter(null)}>All</Button>
          <Button onClick={() => handleFilter('pending')}>Pending</Button>
          <Button onClick={() => handleFilter('shipped')}>Shipped</Button>
          <Button onClick={() => handleFilter('received')}>Received</Button>
        </Toolbar>
      </AppBar>
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>
      </Box>
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <List>
          {filteredOrders.map((order) => (
            <ListItem
              key={order.id}
              style={{
                marginBottom: '15px',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <ListItemText primary={`Order ID: ${order.id}`} secondary={`Status: ${order.status}`} />
                  <ListItemText secondary={`Total Amount: Rs.${order.totalAmount}`} />
                  <ListItemText secondary={`Products:`} />
                  <ul>
                    {order.products.map((product: any) => (
                      <li key={product.id}>
                        <span>{product.title}</span> - <span>Rs.{product.price}</span> -{' '}
                        <span>Quantity: {product.orderProducts.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </Grid>
                <Grid item>
                  {userType === 'seller' && order.status === 'pending' ? (
                    <Button variant="contained" color="primary" onClick={() => handleShipped(order.id)}>
                      Mark as Shipped
                    </Button>
                  ) : null}
                  {userType === 'buyer' && order.status === 'shipped' ? (
                    <Button variant="contained" color="primary" onClick={() => handleReceived(order.id)}>
                      Mark as Received
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
};

export default OrderPage;
