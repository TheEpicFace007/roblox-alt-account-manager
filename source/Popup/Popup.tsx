import * as React from 'react';
import './style.scss'
import { Text, NextUIProvider, useTheme, createTheme, Container, Button, Row, Col, Spacer, Avatar, Grid, Input, Modal, FormElement } from "@nextui-org/react"
import useDarkMode from 'use-dark-mode';
import { IconlyProvider, Play, TwoUsers, VolumeUp } from 'react-iconly';
import { getRobloxUserHeadshot, getUniverseID } from '../shared/roblox';
import { AltListItem } from '../shared-component/AltListItem';
import '../shared-component/style.scss'
import { useList } from 'react-use';
import { GameThumbnail } from '../shared-component/GameThumbnail';

type ViewMode = "alt-list" | "game-list";

const Popup: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("game-list");
  const darkMode = useDarkMode();
  const { type, isDark } = useTheme();
  const darkTheme = createTheme(
    { type: isDark ? "dark" : "light" },
  )
  const [alt, setAlt] = React.useState<string>("JaneDoe"); // TODO: get from storage the current user
  const [altHeadshot, setAltHeadshot] = React.useState<string>("");
  React.useEffect(() => {
    let active = true;
    load();
    return () => { active = false };
    async function load() {
      if (active) {
        try {
          const headshot = await getRobloxUserHeadshot({ usernameOrId: alt, res: 100 });
          if (active) {
            setAltHeadshot(headshot);
          }
        } catch (e) {
          setAltHeadshot("");
        }
      }
    }

  }, [alt])
  const gameLinkRef = React.useRef<FormElement>(null);
  const [addGameShow, setAddGameShow] = React.useState(false);

  const useAlt = (alt: string) => {
  }
  const removeAlt = (alt: string) => {
  }
  const [gameLink, setGameLink] = React.useState("");

  return (
    <NextUIProvider><IconlyProvider set='curved'>
      <section id="popup">
        <Container sm gap={10} id='head'>
          <Row align='flex-start' justify='space-between'>
            <Col>
              <Text h2 b>Alt account manager</Text>
            </Col>
            <Col span={3} className="view-selection">
              <Button type="button" size='xs'
                icon={<TwoUsers set='curved' />}
                onClick={() => setViewMode("alt-list")}
                bordered={viewMode !== "alt-list"}
              >Alt list</Button>
              <Button type="button" size='xs'
                icon={<Play />}
                onClick={() => setViewMode("game-list")}
                bordered={viewMode !== "game-list"}
              >Game list</Button>
            </Col>
          </Row>
        </Container>

        {/* The following component is the list of alts. */}
        {viewMode === "alt-list" &&
          <Grid.Container gap={1}>
            <Grid xs={5}>
              <Spacer />
              <Text>Currently signed in alt: <Text b>{alt || 'None'}</Text></Text>
              <Spacer />
              <Avatar src={altHeadshot} color='gradient' bordered squared size='md' />
            </Grid>
            <Grid sm>
              <Button type="button" size='sm' onClick={() => addAlt()}
                color='gradient'
                about='Add an alt'
              >Add alt</Button>
            </Grid>
          </Grid.Container>
        }
        {/* The following component is the list of alt account. */}
        {viewMode === "alt-list" &&
          <Container gap={1} className='alt-account-list' alignContent='flex-start'>
            <Input placeholder="Filter alts..." onInput={_ => {
              // TODO: filter the list of alts based on the input dynamically
            }} width='100%' />
            <AltListItem alt={alt} onUseAlt={useAlt} onRemoveAlt={removeAlt} />
            <AltListItem alt='Roblox' onUseAlt={useAlt} onRemoveAlt={removeAlt} />
            <AltListItem alt='Builderman' onUseAlt={useAlt} onRemoveAlt={removeAlt} />
          </Container>
        }
        {/* The following is a component that descrbes what the game list is. */}
        {viewMode === "game-list" &&
          <Container gap={1}>
            <Text>
              This is a list of the favorites games of for the current signed-in alt account.
            </Text>
            <Button size='sm' type='button' onClick={() => setAddGameShow(true)}>Add game</Button>
          </Container>
        }
        {/* The following is a a modal that prompt the user for a game link to add it to the game list. */}
        {addGameShow &&
          <Modal
            closeButton
            onClose={() => setAddGameShow(false)}
            title='Add game'
            open={addGameShow}
          >
            <Modal.Header>
              <Text>Add a game to the list of favorites</Text>
            </Modal.Header>
            <Modal.Body>
              <Input placeholder="Game link" width='100%' onChange={(e) => {
                // parse the id from the game link (e.g. https://www.roblox.com/games/3233893879/My-Game-Name or https://web.roblox.com/games/3233893879)
                const regex = /(?:https?:\/\/)?(?:www\.)?(?:web\.)?roblox\.com\/games\/(\d+)/;
                const match = e.target.value.match(regex);
                if (match) {
                  setGameLink(match[1]);
                } else {
                  setGameLink("");
                }
              }} />
            </Modal.Body>
            <Modal.Footer>
              <Button type='button' auto color='default' onClick={() => {
                if (gameLink) {
                  setAddGameShow(false);
                }
              }}>Add game</Button>
              <Button type='button' flat color='error' onClick={() => setAddGameShow(false)}>Cancel</Button>
            </Modal.Footer>
          </Modal>
        }
        {/* The following component is the list of games. It is a grid of a game thumbnail */}
        {viewMode === "game-list" &&
          <Grid.Container gap={2} justify='flex-start'>
          </Grid.Container>
        }
      </section>
    </IconlyProvider></NextUIProvider>
  );
}

export default Popup;
function addAlt(): void {
  throw new Error('Function not implemented.');
}

