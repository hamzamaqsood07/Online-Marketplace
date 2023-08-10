import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddItem from './AddItem';
import EditItem from './EditItem';
import img1 from './images/img1.jpg'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import img2 from './images/img2.jpg'
import { IconButton } from '@mui/material';
const columns = [
    { id: 'title', label: 'title', minWidth: 170 },
    { id: 'image', label: 'Picture', minWidth: 100 },
    { id: 'desc', label: 'Description', minWidth: 100 },
    {
        id: 'price',
        label: 'Price',
        minWidth: 100,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 100,
        format: (value) => value.toLocaleString('en-US'),
    },


];

function createData(title, image, desc, price, quantity) {

    return { title, image, desc, price, quantity };

}

const rows = [
    createData('Product 1', [img1, img2, img1, img2, img1, img1, img1], 'This is an iphone', 300000, 5),
    createData('Product 2', [img1, img2], 'This is an iphone', 300000, 5),
    createData('Product 3', [img1, img2], 'This is an iphone', 300000, 5),
    createData('Product 4', [img1, img2], 'This is an iphone', 300000, 5),
    createData('Product 5', [img1, img2], 'This is an iphone', 300000, 5),


];

export default function BuyerDashboard() {
    

    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const handleClose = () => setOpen(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currRow, setCurrRow] = useState(null)
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleEdit = (row) => {
        setCurrRow(row)
        setOpenEdit(true);
    }


    const handleDelete = (row) => {
        //Write the APIs for delete here
        console.log(row)

    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <div>
                {/* Add Product Page */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <AddItem closeEvent={handleClose} />
                    </Box>
                </Modal>

                {/* Edit Product Page */}
                <Modal
                    open={openEdit}
                    onClose={handleCloseEdit}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <EditItem closeEvent={handleCloseEdit} row={currRow} />
                    </Box>
                </Modal>

            </div>
            <Paper>
                <Box sx={{ textAlign: "right", marginRight: "100px", marginTop: "10px" }}>
                    <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen}>
                        Add
                    </Button>
                </Box>

                <TableContainer sx={{ margin: "10px" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                rows.map((row) =>
                                (
                                    <TableRow key={row.title}>
                                        {
                                            columns.map((column) => {
                                                return (
                                                    <TableCell key={column.id} >
                                                        {column.id === 'image' && Array.isArray(row[column.id]) ? (
                                                            <div>
                                                                {row[column.id].map((imageUrl, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={imageUrl}
                                                                        alt={`${row.title} - Image ${index + 1}`}
                                                                        style={{ maxWidth: '250px', marginRight: '5px' }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : column.format ? (
                                                            column.format(row[column.id])
                                                        ) : (
                                                            row[column.id]
                                                        )}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                        <TableCell align="center">

                                            <IconButton onClick={() => handleEdit(row)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(row)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper >
        </>

    );
}