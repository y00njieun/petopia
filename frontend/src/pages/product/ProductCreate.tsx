import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CSS/ProductCreate.css";
import axiosInstance from "axios";
import {
  createProduct,
  uploadImages,
  updateProduct,
} from "../../features/product/api/Product";
import ProductImg from "./ProductImg";

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const [colorInput, setColorInput] = useState("");
  const [categories, setCategories] = useState<
  { category_id: number; category_name: string }[]
  >([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const { productId } = useParams<{ productId: string }>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  const [product, setProduct] = useState<{
    product_id: string;
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
    mainImage?: string;
    detailImages?: string[];
  }>({
    product_id: "",
    category_id: 0,
    product_code: "",
    product_name: "",
    description: "",
    origin_price: "",
    discount_price: "",
    final_price: "",
    stock_quantity: "",
    product_status: "",
    sizes: [] as string[],
    colors: [] as string[],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    mainImage: "",
    detailImages: [],
  });

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      final_price:
        prev.origin_price && prev.discount_price
          ? (
              parseInt(prev.origin_price) - parseInt(prev.discount_price)
            ).toString()
          : prev.origin_price,
    }));
  }, [product.origin_price, product.discount_price]);

  useEffect(() => {
    axiosInstance
      .get("/api/categories")
      .then((res) => {
        console.log("전체 API 응답 데이터:", res.data);
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("예상치 못한 데이터 형식:", res.data);
          setCategories([]);
        }
        console.log(" API 응답 데이터:", res.data);
      })
      .catch((err) => {
        console.error("카테고리 목록 불러오기 실패:", err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      axiosInstance
        .get(`/api/products/${productId}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => console.error("상품 정보 불러오기 실패:", err));
    }
  }, [productId]);

  const statusMap: { [key: string]: string } = {
    판매중: "PRS001",
    품절: "PRS002",
    숨김: "PRS003",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      let updatedValue: string | number = value;

      // 숫자만 입력만 가능
      if (["origin_price", "discount_price", "stock_quantity"].includes(name)) {
        updatedValue = value.replace(/[^0-9]/g, "");
      }

      if (name === "category_id") {
        updatedValue = parseInt(value, 10) || 0;
      }

      // product_status 변환 (한글 → status_code)
      if (name === "product_status") {
        updatedValue = statusMap[value] || value;
      }

      const updatedProduct = {
        ...prev,
        [name]: updatedValue,
      };

      // 판매 계산
      if (name === "origin_price" || name === "discount_price") {
        updatedProduct.final_price = (
          (parseInt(updatedProduct.origin_price) || 0) -
          (parseInt(updatedProduct.discount_price) || 0)
        ).toString();
      }

      return updatedProduct;
    });
  };

  const handleSizeChange = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorAdd = () => {
    if (colorInput.trim() && !product.colors.includes(colorInput.trim())) {
      setProduct((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleColorRemove = (color: string) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleImageUploadToMongoDB = async (productId: string) => {
    if (!mainImage || detailImages.length === 0) {
      alert("대표 이미지와 상세 이미지를 모두 업로드하세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("mainImage", mainImage);
      detailImages.forEach((file) => {
        formData.append("detailImage", file);
      });

      const response = await uploadImages(productId, mainImage, detailImages);
      console.log("이미지 업로드 성공:", response.data);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  };

  const handleImageUpload = (main: File | null, details: File[]) => {
    setMainImage(main);
    setDetailImages(details);
  };

  // 상품 수정/등록
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const {
      mainImage = "",
      detailImages = [],
      ...formattedProduct
    } = {
      ...product,
      origin_price: parseFloat(product.origin_price) || 0,
      discount_price: parseFloat(product.discount_price) || 0,
      final_price: parseFloat(product.final_price) || 0,
      stock_quantity: parseInt(product.stock_quantity, 10) || 0,
    };

    console.log("프론트 디버그 isEditMode:", isEditMode);
    console.log("프론트 디버그 product_id:", product.product_id);
    console.log("프론트 디버그 formattedProduct:", formattedProduct);

    try {
      let response;
      
      if (isEditMode && product.product_id) {
        console.log("-----프론트 디버깅 updateProduct API 호출");
        response = await updateProduct(product.product_id, formattedProduct);
      } else {
        response = await createProduct(formattedProduct);
      }

      // console.log("API 응답:", response);
      // console.log("API 응답 data:", response.data);

      // if (!response || !response.data) {
      //   console.error("서버 응답이 올바르지 않습니다.", response);
      //   throw new Error("서버 응답이 올바르지 않습니다.");
      // }

      const productId =
        response.product_id || product.product_id || response.data?.product_id;

      if (!productId) {
        throw new Error("상품 저장 실패: response.data.product_id가 없음");
      }

      console.log("저장된 상품 ID:", productId);

      if (!isEditMode || mainImage || detailImages.length > 0) {
        console.log("이미지 업로드 시작, 상품 ID:", productId);
        await handleImageUploadToMongoDB(productId);
        console.log("이미지 업로드 완료");
      }

      setTimeout(() => {
        navigate("/ProductList");
      }, 1000);
    } catch (error) {
      console.error("상품 저장 실패:", error);
      alert("상품 저장 중 오류가 발생했습니다.");
    }
};

  return (
    <div className="product-create-container">
      <form onSubmit={handleSubmit}>
        <div className="product-create">
          <div className="page-header">
          <h2>{isEditMode ? "상품 수정" : "새 상품 등록"}</h2>
            <button className="back-btn" onClick={() => navigate("/")}>
              ← 돌아가기
            </button>
          </div>

          <div className="form-group">
            <label>상품코드</label>
            <input
              type="text"
              name="product_code"
              value={product.product_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>상품명</label>
            <input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>카테고리</label>
            <select
              name="category_id"
              value={product.category_id}
              onChange={handleChange}
              required
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="price-stock-container">
            <div className="price-info">
              <h2>가격 정보</h2>
              <div className="price-form-group">
                <label>상품 원가</label>
                <input
                  type="text"
                  name="origin_price"
                  placeholder="₩"
                  value={product.origin_price ? `₩${product.origin_price}` : ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="price-form-group">
                <label>할인 가격</label>
                <input
                  type="text"
                  name="discount_price"
                  placeholder="₩"
                  value={
                    product.discount_price ? `₩${product.discount_price}` : ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="price-form-group">
                <label>상품 판매가</label>
                <input
                  type="text"
                  name="final_price"
                  placeholder="₩"
                  value={product.final_price ? `₩${product.final_price}` : ""}
                  readOnly
                />
              </div>
            </div>

            <div className="stock-info">
              <h2>상품 수량</h2>
              <div className="stock-form-group">
                <label>재고 수량</label>
                <input
                  type="text"
                  name="stock_quantity"
                  placeholder="1 개"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <h2>상품 옵션</h2>
          <label>사이즈</label>
          <div className="size-form-group">
            {["S", "M", "L", "XL"].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={product.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>

          <div className="status-form-group">
            <label>판매 상태</label>
            <div className="status-options">
              {["판매중", "품절", "숨김"].map((status) => (
                <label key={status}>
                  <input
                    type="radio"
                    name="product_status"
                    value={status}
                    checked={statusMap[status] === product.product_status}
                    onChange={handleChange}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="color-form-group">
          <h2>색상</h2>
          <div className="color-input">
            <input
              type="text"
              placeholder="색상 입력"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <button type="button" onClick={handleColorAdd}>
              +
            </button>
          </div>
          <div className="color-list">
            {product.colors.map((color, index) => (
              <div key={index} className="color-tag">
                <span>{color}</span>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleColorRemove(color)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <ProductImg onUpload={handleImageUpload} />
        <div className="img-container">
          <div className="description-section">
            <h2>상품 설명</h2>
            <textarea
              name="description"
              placeholder="상품 설명을 입력하세요"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="product-cancel-btn"
              onClick={() => navigate("/")}
            >
              취소
            </button>
            <button type="submit">
              {isEditMode ? "수정 완료" : "등록하기"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
