export interface ICart{
    carts:ICartProduct[],
    isOpenSidebar:boolean
}

export interface ICartProduct {
    productId: ProductId;
    quantity: number;
}
export interface ProductId {
    id: number;
    name: string;
    image: string;
    AblumImage?: string[];
    price: number;
    rating:number;
    size:string;
    coler:string;
    quantity:number;
    status:true;
    description:string;
    category:number;
}
export enum TypeCart {
    "openSidebar",
    "updateCart"
}