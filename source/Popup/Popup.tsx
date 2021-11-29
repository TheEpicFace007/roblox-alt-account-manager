import * as React from 'react';
import { browser, Tabs } from 'webextension-polyfill-ts';
import AltItem from './AltItem';
import GameGrid from './GameGrid';
import GameGridItem, { GameCardID } from './GameGridItem';
import './style.scss'
import MessageBox from '../shared-component/MessageBox';
import { iAltAccount } from "../shared/storage"


type GamePage = "alt-list" | "game-list";

const Popup: React.FC = () => {
  const [gamePage, setGamePage] = React.useState<GamePage>("game-list");

  return (
    <section id="popup">
      <header>
        <section id="top-bar">
          <h1>Roblox Alt Manager</h1>
          <button onClick={() => browser.runtime.openOptionsPage()}>Options</button>
          <button
            style={{ textDecoration: gamePage === "alt-list" ? "underline" : "none" }}
            onClick={() => {
              setGamePage(gamePage === "alt-list" ? "game-list" : "alt-list")
            }}>Manage alts</button>
        </section>
      </header>
      <main>
        {
          gamePage === "alt-list" ? <AltManager /> : <AltFavoriteGames />
        }
      </main>
    </section>
  );
}


/**
 * This component is used to display an lists of alts and the selcted alts.
 */
const AltManager: React.FC = () => {
  const [alts, setAlts] = React.useState<[iAltAccount, boolean][]>([]);
  const [altToRemove, setAltToRemove] = React.useState<string | null>(null);
  const [mboxHidden, setMboxHidden] = React.useState(true);

  const onDelPress = (altUsername: string) => {
    setMboxHidden(false);
    setAltToRemove(altUsername);
  }

  return (
    <section id="alt-manager">
      <header>
        <h1>Manage alts</h1>
      </header>
      <main>
        <section id="alt-buttons">
          <button>Add Alt account</button>
          <input type="text" name="Filter Alts" id="" placeholder="Filter list..." aria-placeholder="Filter-list..." />
        </section>
        {/* Add a button to quickly add an alt */}
        {/* Display the list of alts */}

        <section id="alt-list">
          <ul>
            <AltItem onDelete={onDelPress} />
            <AltItem onDelete={onDelPress} />
            <AltItem onDelete={onDelPress} />
            <AltItem onDelete={onDelPress} />
          </ul>
        </section>

        <MessageBox
          buttons="yesno"
          title="Remove alt?"
          message={`Are you sure you wanna remove ${altToRemove}?`}
          onClose={(result) => {
            if (result === "yes") {
              // Remove the alt from the list
              console.warn("Not implemented yet")
            }
            setMboxHidden(true);
          }}
          hidden={mboxHidden} />

      </main>
    </section>
  )
}

/**
 * This is the component that will be used to render the controls to an alt favorite games.
 * @returns {React.FC}
 */
const AltFavoriteGames: React.FC = () => {
  const addFavorite = async (_gameId: GameCardID) => {
  }

  const deleteFavorite = async (_gameId: GameCardID) => {
  }

  const joinGame = async (_gameId: GameCardID) => {
  }
  return (
    <div className="game-grid">
      <h1>Favorite games</h1>
      <section>
        <button>Add favorite game</button>
        <input type="text" name="Filter games" id="" placeholder="Filter games..." aria-placeholder="Filter the favorites games" />
      </section>

      <div className="game-grid-container">
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
      </div>
    </div>
  )
}


export default Popup;
