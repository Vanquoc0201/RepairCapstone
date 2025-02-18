import Header from "./Component/Header";
import Footer from "./Component/Footer"
import {Outlet} from "react-router-dom"
export default function HomeTemplate() {
  return (
    <div className="mx-auto container">
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}
