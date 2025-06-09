import React from "react";

interface ProductToggleProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const ProductToggle: React.FC<ProductToggleProps> = ({ sortOption, setSortOption }) => {
  return (
    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
      <option value="recommended">추천순</option>
      <option value="newest">신상품순</option>
      <option value="lowPrice">낮은 가격순</option>
      <option value="highPrice">높은 가격순</option>
    </select>
  );
};

export default ProductToggle;