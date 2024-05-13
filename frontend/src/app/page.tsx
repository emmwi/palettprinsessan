import "./globals.css";
import "@fontsource/jaldi";
import "@fontsource/italianno";
import "@fontsource/alegreya-sans"; // Defaults to weight 400
import "@fontsource/alegreya-sans/400.css"; // Specify weight
import "@fontsource/alegreya-sans/400-italic.css";
import Projects from "../components/Start-page/Projects";
export default function Home() {
  return (
    <>
      <Projects />
    </>
  );
}
