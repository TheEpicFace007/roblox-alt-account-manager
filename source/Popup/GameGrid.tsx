import React, { Props } from 'react';

/**
 * This is the GameGrid component.
 * It is responsibler for rendering an grid of cells containing the user favorites games.
 * 
 * @param props The props for the GameGrid component
 * @returns An HTML element containing the game grid containing the alt account favorite games.
 */
export default function GameGrid(props: { children: any[] | any; }) {
  return (
    <div className="game-grid">
      <h3>Favorites games: </h3>
      <div className="game-grid-container">
        {props.children}
      </div>
    </div>
  )
}
