import { ICart, TypeCart } from "../inface/cart"; 

export const cartReducer = (state: ICart, action: { type: TypeCart, payload: any }) => {
    switch (action.type) {
        case TypeCart.updateCart:
            return { ...state, carts: action.payload }; 
        case TypeCart.openSidebar:
            return { ...state, isOpenSidebar: action.payload }; 
        default:
            return state;
    }
}
