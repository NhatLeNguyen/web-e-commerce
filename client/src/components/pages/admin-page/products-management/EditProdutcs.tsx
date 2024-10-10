import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { Product } from "../../../../redux/products/productsSlice";
import DeleteIcon from "@mui/icons-material/Delete";

interface EditProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>, imageFiles: File[]) => void;
  initialProductData: Partial<Product>;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  open,
  onClose,
  onSave,
  initialProductData,
}) => {
  const [productData, setProductData] =
    useState<Partial<Product>>(initialProductData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setProductData(initialProductData);
    if (initialProductData.images) {
      setImagePreviews(initialProductData.images);
    }
  }, [initialProductData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prevData) => {
      const keys = name.split(".");
      if (keys.length === 2) {
        return {
          ...prevData,
          [keys[0]]: {
            ...(prevData[keys[0] as keyof Partial<Product>] as any),
            [keys[1]]: value,
          },
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(productData, imageFiles);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={productData.name || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={productData.price || 0}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={productData.stock || 0}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Category"
              name="category"
              value={productData.category || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Size"
              name="size"
              value={productData.size || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Flexibility"
              name="racketDetails.flexibility"
              value={productData.racketDetails?.flexibility || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Frame Material"
              name="racketDetails.frameMaterial"
              value={productData.racketDetails?.frameMaterial || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Shaft Material"
              name="racketDetails.shaftMaterial"
              value={productData.racketDetails?.shaftMaterial || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Weight"
              name="racketDetails.weight"
              value={productData.racketDetails?.weight || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Grip Size"
              name="racketDetails.gripSize"
              value={productData.racketDetails?.gripSize || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Max Tension"
              name="racketDetails.maxTension"
              value={productData.racketDetails?.maxTension || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Balance Point"
              name="racketDetails.balancePoint"
              value={productData.racketDetails?.balancePoint || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Color"
              name="racketDetails.color"
              value={productData.racketDetails?.color || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Made In"
              name="racketDetails.madeIn"
              value={productData.racketDetails?.madeIn || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {imagePreviews.map((preview, index) => (
                <Grid item xs={3} key={index}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={preview}
                      alt={`Product ${index}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <IconButton
                      style={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => handleDeleteImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductForm;
