import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../feature/wishlist/controller/WishlistController";

const router = express.Router();

router.get("/wishlist", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router;
