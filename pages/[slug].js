import { getProductBySlug, getProductSlugs } from '../lib/api'
import styles from '../styles/Home.module.css'

export default function ProductPage({product}) {
    
    return (
       <div className={styles.container} >
           <h1>
           product name is {product.name}
       </h1>
       <div dangerouslySetInnerHTML={{ __html: product.description }} />
       <img src={product.productPhoto.url[0]} height={90} /> 
       </div>
    )
}

export async function getStaticProps({params: {slug}}) {
    const product = await getProductBySlug(slug) 
    return {
        props: {
            product
        }
    }
}

// // You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async (ctx) => {
    const slugs =  getProductSlugs() 
    const paths = slugs.map(slug => ({params: {slug}}))
    return {
        paths,
        fallback: false
    }
}