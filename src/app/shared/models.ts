export interface SingleProduct {    
    id:number,
    title:string,
    price:string,
    category:string,
    description:string,
    image:string,
    addedToCart?: boolean,
    rating?: {
        rate: number,
        count: number
    },
}

export interface CartList {
    product: SingleProduct,
    quantity:number
}