import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./CSS/ProductCard.css"
interface Product {
  product_id: number;
  product_name: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  main_image: string;
  small_image: string;
}

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  toggleWishlist?: (productId: number, productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  toggleWishlist,
}) => {
  console.log(
    "ProductCard 렌더링:",
    product.product_id,
    "isWishlisted:",
    isWishlisted
  );
  console.log("Product Data:", product);
  console.log("상품 이미지 URL (main_image):", product.main_image);
  console.log("상품 이미지 URL (small_image):", product.small_image);

  return (
    <div key={product.product_id} className="product-card">
      {toggleWishlist && (
        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.product_id, product.product_name);
          }}
        >
          <Heart className="heart-icon" fill={isWishlisted ? "red" : "none"} />
        </button>
      )}

      <Link to={`/products/${product.product_id}`} className="product-link">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/${product.small_image}`}
          alt={product.product_name}
        />
        <div className="product-info">
          <h3>{product.product_name}</h3>
          {/* <p className="rating">별점 4.2</p> */}
          <div className="price-container">
            <p className="price">
              {Math.floor(product.origin_price).toLocaleString()}원
            </p>
            {product.discount_price > 0 && (
              <p className="discount">
                ₩{Math.floor(product.final_price).toLocaleString()}원
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
