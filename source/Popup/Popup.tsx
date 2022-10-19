import * as React from 'react';
import './style.scss'
import { Text, NextUIProvider, useTheme, createTheme, Container, Button, Row, Col, Spacer, Avatar, Grid, Input, Modal, FormElement } from "@nextui-org/react"
import useDarkMode from 'use-dark-mode';
import { IconlyProvider, Play, TwoUsers, VolumeUp } from 'react-iconly';
import { getRobloxUserFromCookies, getRobloxUserHeadshot } from '../shared/roblox';
import { AltListItem } from '../shared-component/AltListItem';
import '../shared-component/style.scss'
import { useList } from 'react-use';
import { GameThumbnail } from '../shared-component/GameThumbnail';
import { AltAccount } from '../shared/storage';
import { browser } from 'webextension-polyfill-ts';
import CookieJar from '../shared/cookiejar';
import { ThemeProvider } from 'next-themes'

const Popup: React.FC = () => {
  const darkMode = useDarkMode();
  const { type, isDark } = useTheme();
  const lightTheme = createTheme({ type: 'light' });
  const darkTheme = createTheme({ type: 'dark' });
  
  async function addAlt() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab.url !== undefined && tab.url.includes("roblox.com") && tab.id !== undefined) {
      const cookies = await CookieJar.fromTab(tab.id)
      // find the alt account roblox id
      const rbxUser = await getRobloxUserFromCookies(cookies)
      if ((!rbxUser.Id && !rbxUser.id) && (!rbxUser.Name && !rbxUser.name))
        return

      if (rbxUser) {
        const altAccount: AltAccount = new AltAccount(rbxUser.id as string || rbxUser.Id as string, cookies)

        altAccount.username = rbxUser.name as string ?? rbxUser.Name as string
        altAccount.save()
        console.log("Saved alt account", altAccount)
        // reload the popup
        window.location.reload()
      }
    }
  }

  const [currentAlt, setCurrentAlt] = React.useState<string>(""); // TODO: get from storage the current user

  const useAlt = (alt: string) => {
    // find the alt account roblox id
    AltAccount.getWithUsername(alt).then(altAccount => {
      console.log("Using alt account", altAccount)
      if (altAccount !== null && altAccount !== undefined) {
        AltAccount.use(altAccount.id)
        console.log("Using alt account", altAccount)
      } 
    })
  }
  const removeAlt = (alt: string) => {
    AltAccount.getWithUsername(alt).then(altAccount => {
      if (altAccount !== null) {
        AltAccount.remove(altAccount.id)
        window.location.reload()
      } 
    })
  }
  const [alts, { push, removeAt, filter }] = useList<AltAccount>([]);
  React.useEffect(() => {
    load()
    async function load() {
      const alts = await AltAccount.getAll();
      alts.forEach(alt => push(alt));
    }
  }, [])

  return (
    <NextUIProvider><IconlyProvider set='curved'>
      <section id="popup">
        <Container id='head'>
          <Text h2 b>Alt account manager</Text>
        </Container>

        {/* The following component is the menu of the list of alts. */}
        {
          <Grid.Container gap={1} style={{'justifyContent': 'center', width: '500px'}}>
            <Grid xs={6}>
              <Button type="button" size='sm' color='warning' onClick={async() => {
                const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
                if (tab.url !== undefined && tab.url.includes("roblox.com") && tab.id !== undefined) {
                  if (!tab) 
                    throw new Error("No active tab");
                  await browser.cookies.set({
                    url: "https://www.roblox.com",
                    name: ".ROBLOSECURITY",
                    value: '',
                    domain: ".roblox.com",
                    path: "/",
                    storeId: tab.cookieStoreId,
                  });
                  await browser.tabs.reload(tab.id);
                }
              }}>Logout</Button>
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
            {
              alts.map((alt, index) => {
                return <AltListItem alt={alt.username} key={index} onUseAlt={useAlt} onRemoveAlt={removeAlt} />
              })
            }
          </Container>
        }
      </section>
    </IconlyProvider></NextUIProvider>
  );
}

export default Popup;

