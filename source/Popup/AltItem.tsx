import React, { FC } from "react";

/**
 * Create an Alt Account Card.
 * It show the profile picture of the alt and it display the alt username
 */
const AltItem: FC<{
  username?: string;
  profilePicture?: string;
  isCurrent?: boolean
}> = ({ username, profilePicture, isCurrent }) => {
  return (
    <li className={`alt-item${isCurrent ? "-current" : ""}`}>
      <h4>{username}</h4>
      <img src={profilePicture} alt={username} />
    </li>
  )
}

AltItem.displayName = "AltItem";
AltItem.defaultProps = {
  username: "Roblox",
  profilePicture: "https://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&format=png&username=Roblox",
  isCurrent: false
}

export default AltItem;