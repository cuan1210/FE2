import { ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

type Props = {
  children: ReactNode;
  requiredRole: boolean; // true: cần quyền admin
};

const PrivateRouter = ({ children, requiredRole }: Props) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const isNotified = useRef(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole: boolean = user.role === true || user.role === "true"; // ép về boolean

  useEffect(() => {
    if (!isLoggedIn && !isNotified.current) {
      isNotified.current = true;
      message.error("Bạn cần đăng nhập để tiếp tục");
      setTimeout(() => {
        // localStorage.removeItem("token");
        navigate("/login");
      }, 1000);
    } else if (isLoggedIn && requiredRole && !userRole) {
      message.error("Bạn không có quyền truy cập vào trang này");
      setTimeout(() => {
        // localStorage.removeItem("token");
        navigate("/");
      }, 1000);
    }
  }, [isLoggedIn, requiredRole, userRole, navigate]);

  return isLoggedIn && (requiredRole ? userRole === true : true) ? (
    <>{children}</>
  ) : null;
};

export default PrivateRouter;
