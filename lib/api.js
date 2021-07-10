import { join } from "path";
import markdownToHtml from "./markdownToHtml";
import fs from "fs";


const productsDirectory = join(process.cwd(), "content/products");




export function getProductSlugs() {
  return fs
    .readdirSync(productsDirectory)
    .map((name) => {
      return name.substring(0, name.length - 5)
    });
}


const convertDate = (date) => new Date(date).toString()

const reduceProduct = (product) => {
  return {
    ...product,
    date: convertDate(product.date),
    createdAt: convertDate(product.createdAt), 
    updatedAt: convertDate(product.updatedAt), 
    publishedAt: convertDate(product.publishedAt), 

  }
}

export async function getProductBySlug(slug) {
  const fullPath = join(productsDirectory, `${slug}.json`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const product = JSON.parse(fileContents)
  const result = reduceProduct(product)
  const description = await markdownToHtml(result.description)
  return { ...result, description ,slug};
}


export async function getProducts() {
  const slugs = getProductSlugs();
  const allProducts = await Promise.all(
    slugs.map(async (slug) => await getProductBySlug(slug))
  );

  return {
    products: allProducts
  };
}


