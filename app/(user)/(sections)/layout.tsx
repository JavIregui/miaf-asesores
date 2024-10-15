const SectionLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <h1>Section</h1>
            {children}
        </>
    );
};

export default SectionLayout;