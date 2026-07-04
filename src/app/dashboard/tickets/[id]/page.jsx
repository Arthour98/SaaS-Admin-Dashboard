import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";

export default function Page({ }) {

    return (<>
        <Header />
        <Main className="dashboardMain">
            <div className="dashboard-container">
                <div className="dashboard-nav">
                    <div className="pseudo40-col">
                    </div>
                    <NavBar />
                </div>
                <div className="dashboard-content-wrapper">

                </div>
            </div>
        </Main>
        <Footer />
    </>
    )
}