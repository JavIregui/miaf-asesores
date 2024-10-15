import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="w-full bg-miaf-gray-100 pt-12 pb-16 flex flex-col space-y-4 items-center px-12 sm:items-start md:px-20 lg:px-32 xl:px-48 2xl:px-56">
            <div className='flex space-x-8 sm:space-x-12'>
                <a href="/" className="flex items-center">
                    <div className="relative w-24 h-11 sm:w-32 sm:h-16">
                        <Image
                            fill
                            alt="Logo MIAF Asesores"
                            src="/logoDark.png"
                            priority
                        />
                    </div>
                </a>
                <a href="https://isde.es" className="flex items-center">
                    <div className="relative w-28 h-14 sm:w-48 sm:h-24">
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