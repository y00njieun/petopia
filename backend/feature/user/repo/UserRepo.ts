//db 연산 

//crud
// import { getRepository } from 'typeorm';
// import { Product } from './entities/Product';

// async function main() {
//   const productRepository = getRepository(Product);

//   // Create a new product
//   const newProduct = productRepository.create({
//     name: 'Product 1',
//     price: 19.99,
//     quantity: 10,
//   });

//   // Save the product
//   await productRepository.save(newProduct);

//   // Update the product
//   newProduct.price = 29.99;
//   await productRepository.save(newProduct);

//   // Find all products
//   const products = await productRepository.find();
//   console.log('All products:', products);

//   // Delete the product
//   await productRepository.delete(newProduct.id);
// }