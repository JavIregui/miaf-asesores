import { Navbar } from "../../components/navbar"
import { Footer } from "../../components/footer"

const ClientLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <Navbar/>
            <div className="flex h-full">
                {children}
            </div>
            <Footer/>
        </>
    );
};

export default ClientLayout;