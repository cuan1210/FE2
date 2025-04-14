import './App.css'
import { useRoutes } from 'react-router-dom';
import ClientLayout from './layout/client';
import AdminLayout from './layout/admin';
import HomePage from './pages/client/home';
import Category from './pages/client/category';
import DetailProduct from './pages/client/detailProduct';
import NotFound from './pages/client/notFound';
import ProductClient from './pages/client/product';
import CartClient from './pages/client/cart/cart';
import BlogC from './pages/client/blog';
import ContactC from './pages/client/contact';
import AddP from './pages/admin/product/add';
import EditP from './pages/admin/product/edit';
import ListP from './pages/admin/product/list';
import ListDanhMuc from './pages/admin/category/listDanhMuc';
import AddDanhMuc from './pages/admin/category/addDanhMuc';
import EditDanhMuc from './pages/admin/category/editDanhMuc';
import Detail from './pages/admin/product/detail';
import Search from './pages/client/search';
import PrivateRouter from './privaterouter';
import ThongKe from './pages/admin/thongke';
import Login from './pages/client/user/login';
import Register from './pages/client/user/register';
import OrderClient from './pages/client/order/order';
import OrderHistory from './pages/client/order/orderhistory';

function App() {
  const routes = useRoutes([
    {
      path: '',
      element: <ClientLayout />,
      children:[
        {
          path: '',
          element: <HomePage/>
        },
        {
          path: 'product',
          element: <ProductClient/>
        },
        {
          path: 'blog',
          element: <BlogC/>
        },
        {
          path: 'contact',
          element: <ContactC/>
        },
        {
          path: 'cart',
          element: <CartClient/>
        },
        {
          path: 'checkout',
          element: <OrderClient/>
        },
        {
          path: 'order',
          element: <OrderHistory/>
        },
        {
          path: 'search',
          element: <Search/>
        },
        {
          path: 'category/:id',
          element: <Category/>
        },
        {
          path: 'detail/:id',
          element: <DetailProduct/>
        },
        {
          path: 'login',
          element: <Login/>
        },
        {
          path: 'register',
          element: <Register/>
        },
        {
          path: '*',
          element: <NotFound/>
        },
      ]
    },
    
    // Admin routes
    {
      path: '/admin',
      element: <PrivateRouter requiredRole={true}><AdminLayout/></PrivateRouter>,
      children:[
        {
          path: '/admin',
          element: <ThongKe/>
        },
        {
          path: 'add',
          element: <AddP/>
        },
        {
          path: 'edit/:id',
          element: <EditP/>
        },
        {
          path: 'list',
          element: <ListP/>
        },
        {
          path: 'detail/:id',
          element: <Detail/>
        },
        {
          path: 'listDanhMuc',
          element: <ListDanhMuc/>
        },
        {
          path: 'addDanhMuc',
          element: <AddDanhMuc/>
        },
        {
          path: 'editDanhMuc/:id',
          element: <EditDanhMuc/>
        },
      ]
    },
  ])

  return routes
}

export default App
