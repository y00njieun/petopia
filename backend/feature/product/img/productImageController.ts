import { Request, Response } from "express";
import multer from "multer";
import ProductImage from "../img/ProductImage";
import pool from "../../../config/dbConfig";
import sharp from "sharp";
import path from "path";

// // Multer 설정 (이미지 저장 디렉토리 지정)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// 상품 이미지 업로드 (MongoDB 저장)
export const uploadImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("[요청 도착] 이미지 업로드 요청 받음");
    console.log("[요청 데이터] req.body:", req.body);
    console.log("[업로드된 파일] req.files:", req.files);

    const { product_id } = req.body;

    if (!product_id) {
      res.status(400).json({ message: "상품 ID가 없습니다." });
      return;
    }

    if (!req.files || typeof req.files !== "object") {
      res.status(400).json({ message: "업로드된 파일이 없습니다." });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // 대표 이미지 처리 (리사이징 적용)
    const mainImageFile = files["mainImage"]?.[0];

    if (!mainImageFile) {
      res
        .status(400)
        .json({ message: "대표 이미지는 필수 업로드해야 합니다." });
    }

    const originalMainImage = files["mainImage"][0].path;
    const filename = path.basename(originalMainImage);

    const resized500Path = `uploads/resized_500x500_${filename}`;
    const resized300Path = `uploads/resized_300x250_${filename}`;

    await sharp(originalMainImage)
      .resize(500, 500, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFile(resized500Path);
    await sharp(originalMainImage)
      .resize(300, 250, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFile(resized300Path);

    let detailImages = files["detailImage"]
      ? files["detailImage"].map((file) => file.path)
      : [];

    if (detailImages.length > 5) {
      res
        .status(400)
        .json({
          message: "상세 이미지는 최대 5개까지만 업로드할 수 있습니다.",
        });
    }

    const newProductImage = new ProductImage({
      product_id: String(product_id),
      main_image: resized500Path,
      small_image: resized300Path,
      detail_images: detailImages,
    });

    await newProductImage.save();

    console.log("이미지 업로드 완료:", newProductImage);
    res
      .status(201)
      .json({ message: "이미지 업로드 성공", data: newProductImage });
    return;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    res
      .status(500)
      .json({ message: "서버 오류: 이미지를 업로드할 수 없습니다." });
    return;
  }
};

export const getProductsWithImages = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM Products";
    const [rows] = await pool.promise().query(query);

    console.log("MySQL에서 조회된 상품 데이터:", rows);

    const productList = await Promise.all(
      (rows as any[]).map(async (product) => {
        const productImage = await ProductImage.findOne({
          product_id: String(product.product_id),
        });

        console.log(
          `MongoDB에서 조회된 이미지 상품 ID: ${product.product_id}:`,
          productImage
        );

        return {
          ...product,
          main_image: productImage ? productImage.main_image : null,
          small_image: productImage ? productImage.small_image : null,
          detail_images: productImage ? productImage.detail_images : [],
        };
      })
    );

    console.log("최종 상품 리스트:", productList);
    res.status(200).json(productList);
  } catch (error) {
    console.error("상품 목록 조회 실패:", error);
    res
      .status(500)
      .json({ message: "서버 오류: 상품 목록을 불러올 수 없습니다." });
  }
};

// 특정 상품의 이미지 조회
// export const getProductImages = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     console.log("특정 상품 이미지 조회 요청");

//     const { productId } = req.params;
//     if (!productId) {
//       res.status(400).json({ message: "상품 ID가 필요합니다." });
//     }

//     const productImages = await ProductImage.findOne({ product_id: productId });

//     if (!productImages) {
//       res.status(404).json({ message: "상품 이미지를 찾을 수 없습니다." });
//     }

//     console.log("조회된 이미지 데이터:", productImages);
//     res.status(200).json(productImages);
//   } catch (error) {
//     console.error(" 이미지 조회 실패:", error);
//     res
//       .status(500)
//       .json({ message: "서버 오류: 이미지를 조회할 수 없습니다." });
//   }
// };

// 특정 상품 상세
export const getProductImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    // console.log("[백엔드] 상품 ID", productId, "에 대한 이미지 조회 요청");

    const productImage = await ProductImage.findOne({ product_id: productId });

    if (!productImage) {
      // console.log("[백엔드] 상품 ID", productId, "에 대한 이미지 없음");
      res
        .status(404)
        .json({ message: "해당 상품의 이미지를 찾을 수 없습니다." });
      return;
    }

    // console.log("[백엔드] 조회된 상품 이미지 데이터:", productImage);
    res.json(productImage);
  } catch (error) {
    console.error("이미지 조회 실패:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "서버 오류: 이미지를 불러올 수 없습니다." });
    }
  }
};
