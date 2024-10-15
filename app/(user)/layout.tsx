import { Navbar } from "../../components/navbar"

const ClientLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <Navbar/>
            <div className="flex h-full pt-20">
                {children}
            </div>
        </>
    );
};

export default ClientLayout;