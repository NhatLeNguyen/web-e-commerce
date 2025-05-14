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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../../../../redux/products/productsSlice";

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
    } else {
      setImagePreviews([]);
    }
  }, [initialProductData]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      const keys = name.split(".");
      if (keys.length === 2) {
        setProductData((prevData) => ({
          ...prevData,
          [keys[0]]: {
            ...(prevData[keys[0] as keyof Partial<Product>] as object),
            [keys[1]]: value,
          },
        }));
      } else {
        setProductData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
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
      <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
        Edit Product
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={productData.name || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Brand</InputLabel>
                <Select
                  label="Brand"
                  name="brand"
                  value={productData.brand || ""}
                  onChange={handleChange}
                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                >
                  <MenuItem value="Yonex">Yonex</MenuItem>
                  <MenuItem value="Victor">Victor</MenuItem>
                  <MenuItem value="Lining">Lining</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={productData.price || 0}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={productData.stock || 0}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  value={productData.category || ""}
                  onChange={handleChange}
                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                >
                  <MenuItem value="racket">Racket</MenuItem>
                  <MenuItem value="shoes">Shoes</MenuItem>
                  <MenuItem value="shorts">Shorts</MenuItem>
                  <MenuItem value="shirt">Shirt</MenuItem>
                  <MenuItem value="skirt">Skirt</MenuItem>
                  <MenuItem value="racket-bag">Racket Bag</MenuItem>
                  <MenuItem value="backpack">Backpack</MenuItem>
                  <MenuItem value="accessory">Accessory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {productData.category !== "racket" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Size"
                  name="size"
                  value={productData.size || ""}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>

          {productData.category === "racket" && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mt: 3, fontWeight: "medium" }}
              >
                Racket Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Flexibility"
                    name="racketDetails.flexibility"
                    value={productData.racketDetails?.flexibility || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Frame Material"
                    name="racketDetails.frameMaterial"
                    value={productData.racketDetails?.frameMaterial || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Shaft Material"
                    name="racketDetails.shaftMaterial"
                    value={productData.racketDetails?.shaftMaterial || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weight"
                    name="racketDetails.weight"
                    value={productData.racketDetails?.weight || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Grip Size"
                    name="racketDetails.gripSize"
                    value={productData.racketDetails?.gripSize || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Max Tension"
                    name="racketDetails.maxTension"
                    value={productData.racketDetails?.maxTension || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Balance Point"
                    name="racketDetails.balancePoint"
                    value={productData.racketDetails?.balancePoint || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Color"
                    name="racketDetails.color"
                    value={productData.racketDetails?.color || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Made In"
                    name="racketDetails.madeIn"
                    value={productData.racketDetails?.madeIn || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, fontWeight: "medium" }}
          >
            Images
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  mb: 2,
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#115293" },
                }}
              >
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {imagePreviews.map((preview, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Product ${index}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                        }}
                        onClick={() => handleDeleteImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductForm;
