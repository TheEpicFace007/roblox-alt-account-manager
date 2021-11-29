import React, { FC } from "react";
import { BsTrash, BsTrash2Fill, BsTrashFill } from "react-icons/bs"

/**
 * Create an Alt Account Card.
 * It show the profile picture of the alt and it display the alt username
 */
const AltItem: FC<{
  username: string;
  profilePicture: string;
  isCurrent: boolean;
  onClick: (username: string) => void;
  onDelete: (usenrame: string) => void;
}> = ({ username, profilePicture, isCurrent, onClick, onDelete }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <li className={`alt-item${isCurrent ? "-current" : ""}`} onClick={() => onClick(username)}>
      <h4>{username}</h4>
      <div className="alt-item-image-container" >
        <img src={profilePicture} alt={username} />
        <BsTrash2Fill size="20px" onClick={() => onDelete(username)}/>
      </div>
    </li>
  )
}

AltItem.displayName = "AltItem";
AltItem.defaultProps = {
  username: "Roblox",
  profilePicture: "https://www.roblox.com/Thumbs/Avatar.ashx?x=256&y=256&format=png&username=Roblox",
  isCurrent: false,
  onClick: () => { },
  onDelete: () => { }
}

export default AltItem;