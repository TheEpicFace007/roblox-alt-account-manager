import React from 'react';

export type GameCardID = `game-card-item-${string}`

/**
 * This is the GameGridItem component. 
 * It is responsible for rendering the game grid item which is a rounded square. 
 * It give information on the game. 
 * It also has a event handler for when the user on the full sqare is clicked.
 * It has another event to know when the user click on a trash icon located on the top left corner. (delete favorite) (optional feature) 
 * @param props The game id, the game name, the game thumnail.
 */
export default function GameGridItem(props: {
  id: GameCardID,
  name: string,
  thumbnail: string,
  onClick: (id: GameCardID) => void,
  onDelete: (id: GameCardID) => void
}) {
  return (
    <div className="game-grid-item">
      <div className="game-grid-item-inner" onClick={() => props.onClick(props.id)}>
        <img src={props.thumbnail} alt={props.name} />
        <div>{props.name}</div>
      </div>
      <div className="game-grid-item-delete" onClick={() => props.onDelete(props.id)}>
        <img src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png" />
      </div>
    </div>
  )
}