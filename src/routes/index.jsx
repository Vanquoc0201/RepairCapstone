import { Route } from "react-router-dom";
import HomeTemplate from "../pages/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";
import AboutPage from "../pages/HomeTemplate/AboutPage"
import AdminTemplate from "../pages/AdminTemplate";
import AddUserPage from "../pages/AdminTemplate/AddUserPage"
import DashBoardPage from "../pages/AdminTemplate/DashboardPage";
import UserPage from "../pages/AdminTemplate/UserPage";
import AddMoviePage from "../pages/AdminTemplate/AddMovie"
import AuthPage from "../pages/AdminTemplate/AuthPage"
import PageNotFound from "../pages/PageNotFound"
import DetaiMovie from "../pages/HomeTemplate/DetailMovie";
import Register from "../pages/HomeTemplate/Register";
import Login from "../pages/HomeTemplate/Login";
import BookingTicket from "../pages/HomeTemplate/BookingTicket";
const routes = [
    {
        path: "",
        element: HomeTemplate,
        children : [
            {
                path: "",
                element: HomePage,
            },
            {
                path: "about",
                element: AboutPage,
            },
            {
                path: "detail/:id",
                element: DetaiMovie,
            },
            {
                path: "register",
                element: Register,
            },
            {
                path: "login",
                element: Login,
            },
            {
                path: "booking/:id",
                element: BookingTicket,
            }
        ],
    },
    {
        path:"admin",
        element: AdminTemplate,
        children : [
            {
                path: "add-user",
                element: AddUserPage,
            },
            {
                path: "dashboard",
                element: DashBoardPage,
            },
            {
                path: "userpage",
                element: UserPage,
            },
            {
                path: "add-user",
                element: AddUserPage,
            },
            {
                path: "add-movie",
                element: AddMoviePage,
            },
        ]
    },
    {
        path: "auth",
        element: AuthPage,
    },
    {
        path: "*",
        element: PageNotFound,
    }
]
export const renderRoutes = () =>{
    return routes.map((route)=>{
        if(route.children){
            return (
                <Route key={route.path} path={route.path} element={<route.element />}>
                  {route.children.map((item) => (
                    <Route
                      key={item.path}
                      path={item.path}
                      element={<item.element />}
                    />
                  ))}
                </Route>
              );
        } else {
            return (
                <Route key={route.path} path={route.path} element={<route.element />} />
              );
        }
    })
}