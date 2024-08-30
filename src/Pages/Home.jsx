import NavbarMenu from "./NavBar";
import Page from "./Page";
import Footer from "./Footer";

function Home() {
  return (
    <div className="d-flex flex-column background-image-banner">
      <NavbarMenu />
      <Page />
      <Footer />
    </div>
  );
}

export default Home;
