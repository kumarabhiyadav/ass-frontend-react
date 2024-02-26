import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { NavBar } from './components/widgets/NavBar';
import  EmiCalculator  from './components/pages/emicalculator';
import EmiRange from './components/pages/emirange';
import { Home } from './components/pages/home';
import Products from './components/pages/products';
function App() {
  const Layout = () => {
    return (
      <div className="main">

        <NavBar/>
        
        <div className="contentContainer">
          <Outlet />
        </div>
      
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/emicalculator",
          element: <EmiCalculator />,
        },
        {
          path: "/emirange",
          element: <EmiRange />,
        },
        // {
        //   path: "/gallery",
        //   element: <Gallery />,
        // },
        // {
        //   path: "/contact",
        //   element: <ContactUs />,
        // },
        // {
        //   path: "/product/:productId",
        //   element: <ProductPage />,
        // },
        // {
        //   path: "/carts",
        //   element: <AllCarts />,
        // },
        // {
        //   path: "/checkout",
        //   element: <BillingPage />,
        // },
        // {
        //   path: "/yourorder",
        //   element: <Order />,
        // },
      ],
    },
    
    // {
    //   path: "/signup",
    //   element: <SignupPage />,
    // },
    // {
    //   path: "/forgotpassword",
    //   element: <ForgotPasswordPage />,
    // },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
