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
import { Product } from "../../../../redux/products/productsSlice";
import EditProductForm from "./EditProdutcs";
import AddProductForm from "./AddProducts";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [pageSize, setPageSize] = useState<number>(5);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
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
  const [, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product: Product) => {
    setProductData(product);
    setOpenEdit(true);
  };

  const handleDelete = (productId: string) => {
    dispatch(deleteProduct(productId));
  };

  const handleSaveEdit = async (
    product: Partial<Product>,
    imageFiles: File[]
  ) => {
    const updatedProduct = { ...product };

    if (imageFiles && imageFiles.length > 0) {
      const base64Images = await Promise.all(
        imageFiles.map(async (file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      updatedProduct.images = [
        ...(updatedProduct.images || []),
        ...base64Images,
      ];
    }

    if (updatedProduct._id) {
      try {
        await dispatch(updateProduct(updatedProduct as Product)).unwrap();
        console.log("Product updated successfully:", updatedProduct);
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    }
    setOpenEdit(false);
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
    setImageFiles([]);
  };

  const handleSaveAdd = async (
    product: Partial<Product>,
    imageFiles: File[]
  ) => {
    const newProduct = { ...product };

    if (imageFiles && imageFiles.length > 0) {
      const base64Images = await Promise.all(
        imageFiles.map(async (file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      newProduct.images = [...(newProduct.images || []), ...base64Images];
    }

    try {
      await dispatch(createProduct(newProduct as Product)).unwrap();
      console.log("Product created successfully:", newProduct);
    } catch (error) {
      console.error("Failed to create product:", error);
    }

    setOpenAdd(false);
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
    setImageFiles([]);
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
      <Button onClick={() => setOpenAdd(true)} color="primary">
        Add Product
      </Button>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row._id}
        paginationModel={{ pageSize, page: 0 }}
        onPaginationModelChange={(model) => setPageSize(model.pageSize)}
        pageSizeOptions={[5, 10, 20]}
        pagination
        checkboxSelection
      />
      <EditProductForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={handleSaveEdit}
        initialProductData={productData}
      />
      <AddProductForm
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleSaveAdd}
      />
    </Box>
  );
};

export default ProductList;
