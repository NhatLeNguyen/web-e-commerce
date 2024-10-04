import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/stores";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../../redux/products/productsThunk";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "../../../../redux/products/productsSlice";
import AddProductForm from "./AddProduct";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [pageSize, setPageSize] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);
  const [productData, setProductData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    size: "",
    images: [],
    racketDetails: {
      flexibility: "",
      frameMaterial: "",
      shaftMaterial: "",
      weight: "",
      gripSize: "",
      maxTension: "",
      balancePoint: "",
      color: "",
      madeIn: "",
    },
  });
  const [, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product: Product) => {
    setProductData(product);
    setOpen(true);
  };

  const handleDelete = (productId: string) => {
    dispatch(deleteProduct(productId));
  };

  const handleSave = async (
    product: Partial<Product>,
    imageFile: File | null
  ) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "your_upload_preset");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      product.images = [data.secure_url];
    }

    if (product._id) {
      dispatch(updateProduct(product as Product));
    } else {
      dispatch(createProduct(product as Product));
    }
    setOpen(false);
    setProductData({
      name: "",
      price: 0,
      stock: 0,
      category: "",
      size: "",
      images: [],
      racketDetails: {
        flexibility: "",
        frameMaterial: "",
        shaftMaterial: "",
        weight: "",
        gripSize: "",
        maxTension: "",
        balancePoint: "",
        color: "",
        madeIn: "",
      },
    });
    setImageFile(null);
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
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Add Product
      </Button>
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
      <AddProductForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialProductData={productData}
      />
    </Box>
  );
};

export default ProductList;
