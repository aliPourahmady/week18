import Contacts from "./components/Contacts";
import Header from "./components/Header";
import ContactProvider from "./context/ContactContext";

function App() {
  return (
    <div>
      <ContactProvider>
        <Header />
        <Contacts />
      </ContactProvider>
    </div>
  );
}

export default App;
