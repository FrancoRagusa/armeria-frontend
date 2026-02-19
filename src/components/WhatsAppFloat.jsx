import logoWpp from "../assets/logowpp.png";
const WHATSAPP_NUM = "5491122483958"; // <-- poné el número real



export default function WhatsAppFloat() {
  const msg = encodeURIComponent("Hola! Quiero hacer una consulta.");
  const waLink = `https://wa.me/${WHATSAPP_NUM}?text=${msg}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-[60] w-16 h-16 rounded-full bg-[#25D366] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-[1.05] active:scale-[0.98] transition"
    >
      <img
        src={logoWpp}
        alt="WhatsApp"
        className="w-8 h-8 object-contain"
      />
    </a>
  );
}