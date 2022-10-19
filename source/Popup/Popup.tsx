import * as React from 'react';
import './style.scss'
import { Text, NextUIProvider, useTheme, createTheme, Container, Button, Row, Col, Spacer, Avatar, Grid, Input, Modal, FormElement } from "@nextui-org/react"
import useDarkMode from 'use-dark-mode';
import { IconlyProvider, Play, TwoUsers, VolumeUp } from 'react-iconly';
import { getRobloxUserHeadshot } from '../shared/roblox';
import { AltListItem } from '../shared-component/AltListItem';
import '../shared-component/style.scss'
import { useList } from 'react-use';
import { GameThumbnail } from '../shared-component/GameThumbnail';
import { getAllAltAccountsFromStorageb } from '../shared/storage';

const Popup: React.FC = () => {
  const darkMode = useDarkMode();
  const { type, isDark } = useTheme();
  const darkTheme = createTheme(
    { type: isDark ? "dark" : "light" },
  )

  function addAlt() {

  }

  const [currentAlt, setCurrentAlt] = React.useState<string>("JaneDoe"); // TODO: get from storage the current user
  const [altHeadshot, setAltHeadshot] = React.useState<string>("");
  const [alts, setAlts] = React.useState<string[]>([]);
  // This hook get the headshot for the current alt
  React.useEffect(() => {
    let active = true;
    load();
    return () => { active = false };
    async function load() {
      if (active) {
        try {
          const headshot = await getRobloxUserHeadshot({ usernameOrId: currentAlt, res: 100 });
          console.log(headshot);
          if (active) {
            setAltHeadshot(headshot);
          }
        } catch (e) {
          setAltHeadshot("");
        }
      }
    }

  }, [currentAlt])

  const useAlt = (_alt: string) => {
  }
  const removeAlt = (_alt: string) => {
  }

  return (
    <NextUIProvider><IconlyProvider set='curved'>
      <section id="popup">
        <Container id='head'>
          <Text h2 b>Alt account manager</Text>
        </Container>

        {/* The following component is the menu of the list of alts. */}
        {
          <Grid.Container gap={1} style={{'justifyContent': 'center'}}>
            <Grid xs={6}>
              <Spacer />
              <Text>Currently signed in alt: <Text b>{currentAlt || 'None'}</Text></Text>
              <Spacer />
            </Grid>
            <Grid>
              <Button type="button" size='sm' onClick={() => addAlt()}
                color='gradient'
                about='Add an alt'
              >Add alt</Button>
            </Grid>
          </Grid.Container>
        }
        {/* The following component is the list of alt account. */}
        {
          <Container gap={1} className='alt-account-list' alignContent='flex-start'>
            <Input placeholder="Filter alts..." onInput={_ => {
              // TODO: filter the list of alts based on the input dynamically
            }} width='100%' />
            <AltListItem alt={currentAlt} onUseAlt={useAlt} onRemoveAlt={removeAlt} />
          </Container>
        }
      </section>
    </IconlyProvider></NextUIProvider>
  );
}

export default Popup;

