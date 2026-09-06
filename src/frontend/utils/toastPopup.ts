import { toast, Slide } from "react-toastify";

type ToastType = "info" | "error" | "success" | "warning";

export function toastPopup(message: string, type: ToastType = "warning") {
  toast[type](message, {
    position: "bottom-right",
    theme: "dark",
    autoClose: 2000,
    transition: Slide,
    closeButton: false,
    closeOnClick: true,
    onClick: () => {},
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    toastId: btoa(message),
    style: { userSelect: "none" },
  });
}
