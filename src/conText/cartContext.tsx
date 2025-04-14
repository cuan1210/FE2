import { createContext, ReactNode, useContext, useReducer } from 'react'
import { ICart } from '../inface/cart'
import { cartReducer } from '../renducer/cart'
import ProductCartSidebar from '../pages/client/cart/sidebarCart'

 type Props = {
     children:ReactNode
 }
 export const cartContext = createContext({} as any)
 
 const CartContext = ({children}: Props) => {
    const cartInit:ICart = {
      carts:[],
      isOpenSidebar:false
    }
    const [cartstate,dispatch] = useReducer(cartReducer,cartInit)   
    return (
    <cartContext.Provider value={{cartstate,dispatch}}>
         {children}
         {(cartstate.isOpenSidebar)&&<ProductCartSidebar/>}
     </cartContext.Provider>
   )
 }
 export default CartContext

export const useCartContext = () => {
  return useContext(cartContext);
};