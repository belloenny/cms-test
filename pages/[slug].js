import { getProductBySlug, getProductSlugs } from '../lib/api'
import styles from '../styles/Home.module.css'
import { useRavePayment } from "react-ravepayment";


export default function ProductPage({ product }) {

    const config = {
        txref: "rave-123456",
        customer_email: "belloenny@gmail.com",
        customer_phone: "0796886427",
        currency: "KES",
        amount: product.price.value/10,
        PBFPubKey: "FLWPUBK_TEST-4c6de7505c84935661d460156dc9f594-X",
        production: false,
        
    };
    const { initializePayment } = useRavePayment(config);

    return (
        <div className={styles.container} >
            <h1>
                product name is {product.name}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            <p>price: {product.price.value}</p>
            <img src={product.productPhoto.url[0]} height={90} />
            <button onClick={() => initializePayment((data) => console.log(JSON.stringify(data)))}>Order </button>
        </div>
    )
}

export async function getStaticProps({ params: { slug } }) {
    const product = await getProductBySlug(slug)
    return {
        props: {
            product
        }
    }
}

// // You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async (ctx) => {
    const slugs = getProductSlugs()
    const paths = slugs.map(slug => ({ params: { slug } }))
    return {
        paths,
        fallback: false
    }
}