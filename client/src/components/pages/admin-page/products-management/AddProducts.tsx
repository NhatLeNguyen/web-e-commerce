import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Product } from "../../../../redux/products/productsSlice";
import DeleteIcon from "@mui/icons-material/Delete";

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>, imageFiles: File[]) => void;
}

const categories = [
  "racket",
  "shoes",
  "shorts",
  "shirt",
  "skirt",
  "racket-bag",
  "backpack",
  "accessory",
];

const AddProductForm: React.FC<AddProductFormProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [productData, setProductData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    brand: "",
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(prevData[keys[0] as keyof Product] as any),
            [keys[1]]: value,
          },
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      category: value,
      // Reset các trường không liên quan khi thay đổi category
      size: ["shoes", "shirt", "skirt"].includes(value) ? "" : undefined,
      racketDetails: value === "racket" ? prevData.racketDetails : undefined,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setProductData((prevData) => ({
            ...prevData,
            images: [...(prevData.images || []), base64String],
          }));
          setImagePreviews((prevPreviews) => [...prevPreviews, base64String]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setProductData((prevData) => ({
      ...prevData,
      images: (prevData.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(productData, imageFiles);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Product</DialogTitle>
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
              label="Brand"
              name="brand"
              value={productData.brand || ""}
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
              select
              label="Category"
              name="category"
              value={productData.category || ""}
              onChange={handleCategoryChange}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {["shoes", "shirt", "skirt"].includes(productData.category || "") && (
            <Grid item xs={12}>
              <TextField
                label="Size"
                name="size"
                value={productData.size || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          )}
          {productData.category === "racket" && (
            <>
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
            </>
          )}
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

export default AddProductForm;
