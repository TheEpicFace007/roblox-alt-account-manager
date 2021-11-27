import * as React from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';
import GameGrid from './GameGrid';
import GameGridItem, { GameCardID } from './GameGridItem';
import './style.scss'

const Popup: React.FC = () => {
  const addFavorite = async (_gameId: GameCardID) => {
  }

  const deleteFavorite = async (_gameId: GameCardID) => {
  }

  const joinGame = async (_gameId: GameCardID) => {
  }

  return (
    <section id="popup">
      <header>
        <h1>Roblox Alt Manager</h1>
        <section>
          <button onClick={() => browser.runtime.openOptionsPage()}>Options</button>
          <button>Manage alts</button>
        </section>
      </header>
      <main>
        <GameGrid>
          {/* Add 8 sample games */}
          <GameGridItem id={'game-card-item-1'} name="Game 1" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-2'} name="Game 2" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-3'} name="Game 3" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-4'} name="Game 4" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-5'} name="Game 5" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-6'} name="Game 6" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-7'} name="Game 7" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          <GameGridItem id={'game-card-item-8'} name="Game 8" onClick={joinGame} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
          {/* Add a favorite item */}
          <GameGridItem id="game-card-item-add-fav" name="Add favorite" onClick={addFavorite} onDelete={deleteFavorite} thumbnail="https://via.placeholder.com/64" />
        
        </GameGrid>
      </main>
    </section>
  );
}



export default Popup;
