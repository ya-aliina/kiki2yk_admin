import { UserButton } from '@clerk/nextjs';
import MainNav from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';

const Navbar = () => {
    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={[]} />
                {/* routes */}
                <MainNav />
                {/* userProfile */}
                <div className="ml-auto">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
