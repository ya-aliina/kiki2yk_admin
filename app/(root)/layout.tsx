import {auth} from "@clerk/nextjs/server";

interface SetupLayoutProps {
    children: React.ReactNode;
}

const SetupLayout = ({ children }: SetupLayoutProps) => {
    const {userId} = auth()
    return (
        <div>
            {children}
        </div>
    );
};

export default SetupLayout;
