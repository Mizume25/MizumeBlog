import { useEffect, useRef, useState } from "react";
import { Book } from "@/types";
const getCarrusel = async (): Promise<Book[]> => {
    const answer = await fetch('/data/Carrusel.json');
    if (!answer.ok) throw new Error('No se ha podido cargar el Carrusel');
    return answer.json();
}

export default function HomeFooter() {
    const trackRef = useRef<HTMLDivElement>(null);

     const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        getCarrusel()
            .then(setBooks)
            .catch(e => console.log("Error en el carrusel", e));
    }, []);

    // Duplicamos para loop infinito
    const doubled = [...books, ...books];

    return (
        <footer className="w-full mt-8 overflow-hidden rounded-xl" style={{ background: "#0d0804" }}>

            {/* ── Carrusel ── */}
            <div className="py-6 overflow-hidden" style={{ borderBottom: "0.5px solid rgba(201,168,124,0.15)" }}>
                <p style={{
                    color: "#c9a87c",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    paddingLeft: "1.5rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}>
                    <span style={{ display: "inline-block", width: 16, height: 1, background: "#c9a87c" }} />
                    Obras favoritas
                </p>

                <div ref={trackRef} style={{ overflow: "hidden", width: "100%" }}>
                    <div style={{
                        display: "flex",
                        width: "max-content",
                        animation: "carouselScroll 55s linear infinite",
                        gap: 48,
                    }}
                        onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
                        onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
                    >
                        {doubled.map((book, i) => (
                            <div
                                key={i}
                                style={{
                                    flexShrink: 0,
                                    width: 110,
                                    height: 155,
                                    position: "relative",
                                    opacity: 1,
                                    transition: "transform 0.3s",
                                    cursor: "pointer",
                                    backgroundImage:`url(/IMG/Carrusel/${book.image})`,
                                    backgroundSize: "contain"
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.transform = "scale(1.08) translateY(-6px)";
                                    el.style.zIndex = "10";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.transform = "none";
                                    el.style.zIndex = "auto";
                                }}
                            >
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 6,
                                    overflow: "hidden",
                                    borderLeft: `4px solid ${book.accent}`,
                                    
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    padding: "8px 6px",
                                }}>
                                    <span style={{
                                        fontSize: 9,
                                        fontWeight: 500,
                                        color: "#fff",
                                        textAlign: "center",
                                        lineHeight: 1.3,
                                        textShadow: "0 1px 4px rgba(0,0,0,0.95)",
                                        background: "rgba(0,0,0,0.5)",
                                        borderRadius: 3,
                                        padding: "3px 5px",
                                        display: "block",
                                    }}>{book.title}</span>
                                    <span style={{
                                        fontSize: 8,
                                        color: "rgba(255,255,255,0.65)",
                                        textAlign: "center",
                                        marginTop: 2,
                                        textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                                        display: "block",
                                    }}>{book.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Footer 3 columnas ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 0.5px 1fr 0.5px 1fr",
                gap: "1.5rem",
                padding: "1.5rem 2rem 1rem",
                alignItems: "start",
            }}>
                {/* Cita */}
                <div>
                    <div style={{ color: "#c9a87c", fontSize: 13, textAlign: "center", opacity: 0.5, marginBottom: 6 }}>✦</div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: "#c9a87c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                        Cita del mes
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>
                        "La vida es sueño, y los sueños, sueños son."
                        <cite style={{ display: "block", fontStyle: "normal", fontSize: 10, color: "rgba(201,168,124,0.55)", marginTop: 4 }}>
                            — Calderón de la Barca
                        </cite>
                    </p>
                </div>

                {/* Divider */}
                <div style={{ background: "rgba(201,168,124,0.18)", height: 60, alignSelf: "center" }} />

                {/* Secciones */}
                <div>
                    <div style={{ color: "#c9a87c", fontSize: 13, textAlign: "center", opacity: 0.5, marginBottom: 6 }}>✦</div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: "#c9a87c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                        Secciones
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                        {["Sobre Autores", "Archivador", "Post Destacados", "Panel Admin"].map(s => (
                            <li key={s}>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", cursor: "default" }}>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider */}
                <div style={{ background: "rgba(201,168,124,0.18)", height: 60, alignSelf: "center" }} />

                {/* Sígueme */}
                <div>
                    <div style={{ color: "#c9a87c", fontSize: 13, textAlign: "center", opacity: 0.5, marginBottom: 6 }}>✦</div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: "#c9a87c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                        Sígueme
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                        {["LinkedIn", "Instagram", "GitHub"].map(s => (
                            <li key={s}>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", cursor: "default" }}>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                textAlign: "center",
                padding: "0.6rem 2rem 0.8rem",
                borderTop: "0.5px solid rgba(255,255,255,0.05)",
                letterSpacing: "0.06em",
            }}>
                © {new Date().getFullYear()} · Tu biblioteca personal · Hecho con amor literario
            </div>

            {/* Keyframe de animación */}
            <style>{`
                @keyframes carouselScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </footer>
    );
}