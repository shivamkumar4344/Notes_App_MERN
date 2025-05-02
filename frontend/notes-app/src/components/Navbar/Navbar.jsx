import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import { MdNotes } from "react-icons/md";

export default function Navbar({userInfo}) {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return(
        <div className="bg-white flex items-center justify-between px-6 py-3 drop-shadow">
            <div className="flex items-center">
                <MdNotes className="text-2xl text-primary mr-2" />
                <h2 className="text-xl font-medium text-gray-800">Notes App</h2>
            </div>
            <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
        </div>
    )
};