import { useState } from "react";
import axios from "axios";
import "./ImageSearchModal.scss";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";

// Định nghĩa kiểu cho kết quả từ API tìm kiếm hình ảnh
interface SearchResult {
  path: string;
  product_name: string;
  similarity: number;
}

// Định nghĩa kiểu cho sản phẩm từ MongoDB
interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
}

const ImageSearchPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProducts([]); // Xóa kết quả cũ
      setError(null);
    }
  };

  // Gửi ảnh đến API tìm kiếm hình ảnh và lấy sản phẩm từ MongoDB
  const handleSearch = async () => {
    if (!selectedImage) {
      setError("Vui lòng chọn một ảnh trước khi tìm kiếm!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // Gọi API tìm kiếm hình ảnh
      const imageSearchResponse = await axios.post<{
        success: boolean;
        results: SearchResult[];
        message?: string;
      }>("https://43a6-35-247-145-36.ngrok-free.app/search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (imageSearchResponse.data.success) {
        const searchResults = imageSearchResponse.data.results;

        // Lấy danh sách product_name duy nhất (tránh trùng lặp)
        const productNames = Array.from(
          new Set(searchResults.map((result) => result.product_name))
        );

        // Gọi API MongoDB để tìm kiếm sản phẩm dựa trên product_name
        const productPromises = productNames.map(async (name) => {
          try {
            const response = await axios.get<Product[]>(
              `http://localhost:5000/api/products/search?name=${encodeURIComponent(
                name
              )}`
            );
            return response.data;
          } catch (err) {
            console.error(`Lỗi khi tìm kiếm sản phẩm ${name}:`, err);
            return [];
          }
        });

        // Chờ tất cả các yêu cầu hoàn tất
        const productResults = await Promise.all(productPromises);
        const allProducts = productResults.flat(); // Gộp tất cả sản phẩm vào một mảng

        // Loại bỏ sản phẩm trùng lặp (dựa trên _id)
        const uniqueProducts = Array.from(
          new Map(allProducts.map((product) => [product._id, product])).values()
        );

        setProducts(uniqueProducts);
      } else {
        setError(
          imageSearchResponse.data.message || "Có lỗi xảy ra khi tìm kiếm!"
        );
      }
    } catch (err) {
      setError("Không thể kết nối đến API. Vui lòng kiểm tra lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-search-page">
      <header className="hero">
        <h1>Image Search</h1>
        <p>Find products by uploading an image</p>
      </header>
      <section className="search-content">
        <div className="search-container">
          <div className="upload-placeholder">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: "15px" }}
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="image-preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            ) : (
              <div className="image-preview">Image Preview Area</div>
            )}
          </div>
          <button onClick={handleSearch} disabled={loading || !selectedImage}>
            {loading ? "Searching..." : "Search"}
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </section>

      {/* Hiển thị kết quả từ MongoDB */}
      {products.length > 0 && (
        <section className="results-content">
          <h2>Search Results</h2>
          <div className="results-grid">
            {products.map((product) => (
              <ListItem key={product._id} style={{ cursor: "pointer" }}>
                <ListItemAvatar>
                  <Avatar src={product.images[0]} alt={product.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.name}
                  secondary={`Price: $${product.price}`}
                />
              </ListItem>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ImageSearchPage;
