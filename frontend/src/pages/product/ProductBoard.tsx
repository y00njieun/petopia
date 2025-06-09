import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/axios/axios";

interface Product {
  product_id: number;
    category_id: number;
    product_code: string;
    product_name: string;
    description: string;
    origin_price: string;
    discount_price: string;
    final_price: string;
    stock_quantity: string;
    product_status: string;
    sizes: string[];
    colors: string[];
    created_at: string;
    updated_at: string;
}

const ProductBoard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/api/productImages").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleDelete = async (productId: number) => {
  console.log("삭제 요청 productId:", productId);
  if (window.confirm("정말 삭제하시겠습니까?")) {
    try {
      const response = await axiosInstance.delete(`/api/products/${productId}`);
      console.log("삭제 응답:", response);

      if (response.status === 200) {
        setProducts(products.filter((p) => p.product_id !== productId));
        alert("상품이 삭제되었습니다.");
      }
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  }
};

  return (
    <div className="product-board-container">
      <h2>전체 상품 목록</h2>
      <button onClick={() => navigate("/ProductCreate")}>+ 새 상품 등록</button>

      <table className="product-table">
        <thead>
          <tr>
            <th>상품코드</th>
            <th>상품명</th>
            <th>카테고리</th>
            <th>판매가</th>
            <th>재고</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.product_name}</td>
              <td>{product.category_id}</td>
              <td>₩{product.final_price.toLocaleString()}</td>
              <td>{product.stock_quantity}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/product-create/${product.product_id}`, {
                      state: { product },
                    })
                  }
                >
                  수정
                </button>
                <button className="delete-btn" onClick={() => handleDelete(product.product_id)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductBoard;