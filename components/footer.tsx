import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="w-full bg-miaf-gray-100 pt-12 pb-16 px-12 md:px-20 lg:px-32 xl:px-48 2xl:px-56">
            <div className='flex space-x-12'>
            <a href="/" className="flex items-center">
                <div className="relative w-32 h-16">
                    <Image
                        fill
                        alt="Logo MIAF Asesores"
                        src="/logoDark.png"
                        priority
                    />
                </div>
            </a>
            <a href="/" className="flex items-center">
                <div className="relative w-48 h-24">
                    <Image
                        fill
                        alt="Logo MIAF Asesores"
                        src="/uniLogo.png"
                        priority
                    />
                </div>
            </a>
            </div>
        </footer>
    );
};