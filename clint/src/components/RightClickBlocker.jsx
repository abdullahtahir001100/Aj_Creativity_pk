import { useEffect } from "react";

export default function RightClickBlocker({ message = "🚫 رائٹ کلک بلاک ہے" }) {
  useEffect(() => {
    const onContextMenu = (e) => {
      e.preventDefault();
      alert(message); // optional
    };

    document.addEventListener("contextmenu", onContextMenu);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, [message]);

  return null;
}
