import "./App.css";
import Footer from "./components/footer";
import Hero from "./components/hero";
import  { WeatherProvider } from "./context/weatherContext";
import Display from "./components/display";

function App() {
  return (
    <WeatherProvider>
      <Hero />
      <Display />
      <Footer />
    </WeatherProvider>
  );
}

export default App;
