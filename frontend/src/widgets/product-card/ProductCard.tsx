import React from "react";
import "./ProductCard.css";

type ProductCardProps = {
  image: string;
  title: string;
  price: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ image, title, price }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  );
};

export default ProductCard;
