import "./ImageSearchModal.scss";

export default function ImageSearchPage() {
  return (
    <div className="image-search-page">
      <header className="hero">
        <h1>Image Search</h1>
        <p>Find products by uploading an image </p>
      </header>
      <section className="search-content">
        <div className="search-container">
          <div className="upload-placeholder">
            <p>Drag and drop an image here or click to upload (placeholder).</p>
            <div className="image-preview">Image Preview Area</div>
          </div>
          <button disabled>Search</button>
        </div>
      </section>
    </div>
  );
}
