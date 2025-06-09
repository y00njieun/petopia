import React, { useState, useEffect } from "react";
import MHeader from "../../widgets/M-header/M-header";
import MSidebar from "../../widgets/M-sidebar/M-sidebar";
import axiosInstance from "../../shared/axios/axios";
import "./MProduct.css";
import { useNavigate } from "react-router-dom";

// 상품 데이터 인터페이스
interface Product {
  product_id: number;
  product_code: string;
  product_name: string;
  category_id: number;
  final_price: string;
  stock_quantity: string;
  product_status: string;
  small_image: string;
}

interface Category {
  category_id: number;
  category_name: string;
}
const statusMap: Record<string, string> = {
  PRS001: "판매중",
  PRS002: "품절",
  PRS003: "숨김",
};

const MProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("전체");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/productImages");
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (product: Product) => {
    navigate(`/product-create/${product.product_id}`, {
      state: { product },
    });
  };

  // 상품 삭제 기능
  const handleDelete = async (productId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const response = await axiosInstance.delete(
          `/api/products/${productId}`
        );
        if (response.status === 200) {
          setProducts((prev) =>
            prev.filter((product) => product.product_id !== productId)
          );
          alert("상품이 삭제되었습니다.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "삭제 중 오류 발생");
      }
    }
  };

  // 필터링된 상품 목록
  const filteredProducts = products
    .filter((p) => category === "전체" || p.category_id.toString() === category)
    .filter((p) => p.product_name?.includes(searchTerm));

  const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewProduct = () => {
    navigate("/ProductCreate");
  };

  return (
    <div className="product-wrapper">
      <MHeader title="관리자 상품관리" />
      <div className="product-layout">
        <MSidebar />
        <div className="product-container">
          <div className="product-header">
            <h2 className="product-title">전체 상품 목록</h2>
            <button className="new-product-button" onClick={handleNewProduct}>
              + 새 상품 등록
            </button>
          </div>

          <div className="product-content-box">
            {loading ? (
              <p className="loading-message">상품 데이터를 불러오는 중...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
                <div className="product-search">
                  <input
                    type="text"
                    placeholder="상품명 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="product-input"
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="product-select"
                  >
                    <option value="전체">전체 카테고리</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.category_id}
                        value={cat.category_id.toString()}
                      >
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <table className="product-table">
                  <thead>
                    <tr>
                      <th>상품코드</th>
                      <th>상품명</th>
                      <th>카테고리</th>
                      <th>판매가</th>
                      <th>재고</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProducts.map((product) => (
                      <tr key={product.product_id}>
                        <td>{product.product_code}</td>

                        <td className="M-titleName">
                          <img
                            className="M-img"
                            src={`VITE_API_BASE_URL/${product.small_image}`}
                            alt={product.product_name}
                          />
                          {product.product_name}
                        </td>
                        <td>
                          {categories.find(
                            (cat) => cat.category_id === product.category_id
                          )?.category_name || "없음"}
                        </td>
                        <td>
                          ₩{parseInt(product.final_price).toLocaleString()}
                        </td>
                        <td>{product.stock_quantity}</td>
                        <td>
                          <span
                            className={
                              product.product_status === "PRS001"
                                ? "status-green"
                                : product.product_status === "PRS002"
                                ? "status-orange"
                                : "status-red"
                            }
                          >
                            {statusMap[product.product_status] || "알 수 없음"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="mproduct-edit-button"
                            onClick={() => handleEdit(product)}
                          >
                            수정
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(product.product_id)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="pagination-button"
                  >
                    이전
                  </button>
                  {Array.from({ length: maxPage }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-button ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, maxPage))
                    }
                    className="pagination-button"
                  >
                    다음
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MProduct;
