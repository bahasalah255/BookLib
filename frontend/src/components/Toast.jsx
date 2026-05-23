import toast from "react-hot-toast";

export const toastSuccess = (msg) =>
  toast.success(msg, {
    style: { background: "#22c55e", color: "#fff" },
    iconTheme: { primary: "#fff", secondary: "#22c55e" },
  });

export const toastError = (msg) =>
  toast.error(msg, {
    style: { background: "#ef4444", color: "#fff" },
    iconTheme: { primary: "#fff", secondary: "#ef4444" },
  });
