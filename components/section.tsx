interface SectionProps {
    name: string;
    icon: string;
    text: string;
    link: string;
}

export const Section = ({ name, icon, text, link }: SectionProps) => {
    return (
        <a href={link} className="w-full space-y-4 px-8 py-6 lg:w-3/12 border-2 border-white hover:bg-miaf-blue-100">
            <img className="h-12" src={icon} alt={name} />
            <div className="space-y-1">
                <h3 className="font-playfair font-bold text-xl text-white">{name}</h3>
                <p className="text-miaf-gray-200 font-roboto">{text}</p>
            </div>
        </a>
    );
};