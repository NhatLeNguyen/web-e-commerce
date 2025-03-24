import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./ImageSearchModal.scss";
import { fetchProducts } from "../../../redux/products/productsThunk";
import { AppDispatch, RootState } from "../../../redux/stores";

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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const products = useSelector(
    (state: RootState) => state.products.items as Product[]
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Dispatch fetchProducts khi component được mount (giống SearchBar)
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFilteredProducts([]); // Xóa kết quả cũ
      setError(null);
    }
  };

  // Xử lý điều hướng khi click vào sản phẩm
  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  // Gửi ảnh đến API tìm kiếm hình ảnh và lọc sản phẩm trên client-side
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
      }>("https://2c9e-34-91-150-91.ngrok-free.app/search", formData, {
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

        // Lọc sản phẩm trên client-side (so sánh giống SearchBar)
        const matchedProducts = Array.isArray(products)
          ? products.filter((product) =>
              productNames.some((searchName) =>
                product.name.toLowerCase().includes(searchName.toLowerCase())
              )
            )
          : [];

        // Loại bỏ sản phẩm trùng lặp (dựa trên _id)
        const uniqueProducts = Array.from(
          new Map(
            matchedProducts.map((product) => [product._id, product])
          ).values()
        );

        setFilteredProducts(uniqueProducts);
      } else {
        setError(
          imageSearchResponse.data.message || "Có lỗi xảy ra khi tìm kiếm!"
        );
      }
    } catch (err) {
      setError(
        "Không thể kết nối đến API tìm kiếm hình ảnh. Vui lòng kiểm tra lại!"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-search-page">
      <header className="hero">
        <h1>Image Search</h1>
        <p>Find products by uploading an image.</p>
      </header>
      <section className="search-content">
        <div className="search-container">
          <div className="upload-placeholder">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="image-preview" />
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

      {/* Hiển thị kết quả đã lọc dưới dạng lưới */}
      {filteredProducts.length > 0 && (
        <section className="results-content">
          <h2>Search Results</h2>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {product.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ImageSearchPage;
