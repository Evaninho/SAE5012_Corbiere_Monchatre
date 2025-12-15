import { Link } from "react-router-dom";
import avatarImage from "../image/avatar.png";

export function UserMenu(params) {
    const userMenu = {
        textDecorationLine : "none",
    }
    const userStyle = {
        margin: 0,
        padding: "8px 15px",
        fontWeight: "bold",
        color: "#1F2937",
        border:"2px solid #009F3D",
        borderRadius:"25px",
        fontStyle: "none",
    };
    const avatarStyle = {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginLeft: "10px",
    };

    const userName = null; // Replace with actual user name logic
      const getInitial = () => {
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return 'U';
  };

    return (
        <Link to="/login" className="user-menu" style={userMenu}>
            <p style={userStyle}>Se connecter</p>
            {/* <img src={avatarImage} alt="Avatar" style={avatarStyle} /> */}
        </Link>
    );
}