import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/stores";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../../redux/products/productsThunk";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../../../../redux/products/productsSlice";
import EditProductForm from "./EditProdutcs";
import AddProductForm from "./AddProducts";
import * as XLSX from "xlsx";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
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

  const handleExportToExcel = () => {
    const exportData = products.map((product) => ({
      ID: product._id,
      Name: product.name,
      Price: product.price,
      Stock: product.stock,
      Category: product.category,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Products_Export.xlsx");
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "price", headerName: "Price", width: 200 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "category", headerName: "Category", width: 150 },
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
    <Box sx={{ height: 600, width: "98%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button onClick={() => setOpenAdd(true)} color="primary">
          Add Product
        </Button>
        <Button
          variant="contained"
          onClick={handleExportToExcel}
          sx={{
            backgroundColor: "#B8E5F63B",
            borderRadius: 2,
            color: "black",
            "&:hover": {
              backgroundColor: "#B8E5F6",
            },
          }}
        >
          Export to Excel
        </Button>
      </Box>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row._id}
        pagination
        paginationMode="client"
        rowCount={products.length}
        paginationModel={paginationModel}
        onPaginationModelChange={(newModel: GridPaginationModel) =>
          setPaginationModel(newModel)
        }
        pageSizeOptions={[5, 10, 20]}
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
