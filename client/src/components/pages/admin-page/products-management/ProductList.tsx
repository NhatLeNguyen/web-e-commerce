import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/stores";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "../../../../redux/products/productsThunk";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../../../../redux/products/productsSlice";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product: Product) => {
    // Implement edit functionality
  };

  const handleDelete = (productId: string) => {
    dispatch(deleteProduct(productId));
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 300 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "price", headerName: "Price", width: 200 },
    { field: "stock", headerName: "Stock", width: 150 },
    { field: "category", headerName: "Category", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize: React.SetStateAction<number>) =>
          setPageSize(newPageSize)
        }
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        checkboxSelection
      />
    </Box>
  );
};

export default ProductList;
