import { join } from "path";
import matter from "gray-matter";
import markdownToHtml from "./markdownToHtml";
import fs from "fs";

const postsDirectory = join(process.cwd(), "content/posts");
const productsDirectory = join(process.cwd(), "content/products");
const pagesDirectory = join(process.cwd(), "content/pages");

export function getPageSlugs() {
  return fs
    .readdirSync(pagesDirectory)
    .map((name) => name.substring(0, name.length - 3));
}

export function getProductSlugs() {
  return fs
    .readdirSync(productsDirectory)
    .map((name) => {
      console.log(name)
      return name.substring(0, name.length - 5)
    });
}

export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .map((name) => name.substring(0, name.length - 3));
}

// export async function getPageBySlug(slug) {
//   const fullPath = join(pagesDirectory, `${slug}.md`);
//   const fileContents = fs.readFileSync(fullPath, "utf8");
//   const { data, content } = matter(fileContents);
//   const html = await markdownToHtml(content);

//   return { data, html, slug };
// }

// export function getPageDataBySlug(slug) {
//   const fullPath = join(pagesDirectory, `${slug}.md`);
//   const fileContents = fs.readFileSync(fullPath, "utf8");
//   const { data } = matter(fileContents);
//   return { attributes: data };
// }

export async function getPostBySlug(slug) {
  const fullPath = join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const html = await markdownToHtml(content);
  return { data: { ...data, date: data.date.toString() }, html, slug };
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

export async function getPosts() {

  const slugs = getPostSlugs();
  const allPosts = await Promise.all(
    slugs.map(async (slug) => await getPostBySlug(slug))
  );

  return {
    posts: allPosts
  };
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

// export async function getPages() {
//   const slugs = getPageSlugs();
//   const allPages = await Promise.all(
//     slugs.map(async (slug) => getPageDataBySlug(slug))
//   );

//   //   const sortedAndFilteredPosts = allPosts
//   //     .sort(function (a, b) {
//   //       return new Date(b.attributes.date) - new Date(a.attributes.date);
//   //     })
//   //     .filter((x, index) => index >= indexMin && index < indexMax);
//   console.log({ allPages });
//   return allPages;
// }
