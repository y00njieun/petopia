import pool from "../../../config/dbConfig";

interface Product {
  product_code: string;
  category_id: number;
  product_name: string;
  description: string;
  origin_price: number;
  discount_price: number; 
  final_price: number;
  stock_quantity: number;
  product_status: string;
  sizes: string[];
  colors: string[];
}

class ProductService {
  static async createProduct(product: Product) {
    try {
      const {
        product_code,
        category_id,
        product_name,
        description,
        origin_price,
        discount_price,
        final_price,
        stock_quantity,
        product_status,
        sizes,
        colors,
      } = product;

      const query = `
        INSERT INTO Products
        (product_code, category_id, product_name, description, origin_price, discount_price, final_price, stock_quantity, product_status, sizes, colors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        product_code,
        category_id,
        product_name,
        description,
        origin_price,
        discount_price,
        final_price,
        stock_quantity,
        product_status,
        JSON.stringify(sizes),
        JSON.stringify(colors),
      ];

      const [result]: any = await pool.promise().query(query, values);
      console.log("MySQL Insert 결과:", result);

      const newProduct = { ...product, product_id: result.insertId };
      console.log("생성된 상품 정보:", newProduct);
      return newProduct;

    } catch (error) {
      console.error("상품 등록 실패:", error);
      throw new Error("상품 등록 실패");
    }
  }
}

export default ProductService;
