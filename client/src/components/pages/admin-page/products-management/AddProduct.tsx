import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { Product } from "../../../../redux/products/productsSlice";

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>, imageFile: File | null) => void;
  initialProductData: Partial<Product>;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  open,
  onClose,
  onSave,
  initialProductData,
}) => {
  const [productData, setProductData] =
    useState<Partial<Product>>(initialProductData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCategoryChange = (category: string) => {
    setProductData({
      ...productData,
      category,
      size: "",
      racketDetails: {
        flexibility: productData.racketDetails?.flexibility || "",
        frameMaterial: productData.racketDetails?.frameMaterial || "",
        shaftMaterial: productData.racketDetails?.shaftMaterial || "",
        weight: productData.racketDetails?.weight || "",
        gripSize: productData.racketDetails?.gripSize || "",
        maxTension: productData.racketDetails?.maxTension || "",
        balancePoint: productData.racketDetails?.balancePoint || "",
        color: productData.racketDetails?.color || "",
        madeIn: productData.racketDetails?.madeIn || "",
      },
    });
  };

  const handleSave = () => {
    onSave(productData, imageFile);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 4,
          backgroundColor: "white",
          margin: "auto",
          marginTop: "5%",
          width: "60%",
          maxHeight: "80%",
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {productData._id ? "Edit Product" : "Add Product"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              type="number"
              value={productData.price}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  price: Number(e.target.value),
                })
              }
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock"
              type="number"
              value={productData.stock}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  stock: Number(e.target.value),
                })
              }
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={productData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
          {productData.category === "shoes" && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Size</InputLabel>
                <Select
                  value={productData.size}
                  onChange={(e) =>
                    setProductData({ ...productData, size: e.target.value })
                  }
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i} value={34 + i}>
                      {34 + i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {productData.category &&
            ["shorts", "shirt", "skirt"].includes(productData.category) && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={productData.size}
                    onChange={(e) =>
                      setProductData({ ...productData, size: e.target.value })
                    }
                  >
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                    <MenuItem value="XXL">XXL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          {productData.category === "racket" && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Flexibility"
                  value={productData.racketDetails?.flexibility || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        flexibility: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Frame Material"
                  value={productData.racketDetails?.frameMaterial || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        frameMaterial: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Shaft Material"
                  value={productData.racketDetails?.shaftMaterial || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        shaftMaterial: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight"
                  value={productData.racketDetails?.weight || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        weight: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Grip Size"
                  value={productData.racketDetails?.gripSize || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        gripSize: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Max Tension"
                  value={productData.racketDetails?.maxTension || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        maxTension: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Balance Point"
                  value={productData.racketDetails?.balancePoint || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        balancePoint: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Color"
                  value={productData.racketDetails?.color || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        color: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Made In"
                  value={productData.racketDetails?.madeIn || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      racketDetails: {
                        ...productData.racketDetails,
                        madeIn: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSave}
              sx={{ marginTop: 2 }}
              variant="contained"
              color="primary"
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddProductForm;
