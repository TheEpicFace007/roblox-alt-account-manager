import { Avatar, Button, Col, Container, Grid, Row, Spacer, Text } from "@nextui-org/react";
import React, { useEffect } from "react";
import { Delete, Play, Star } from "react-iconly";
import { getRobloxUserById, getRobloxUserHeadshot } from "../shared/roblox";

export type AltList = {
    alt: string,
    /**
     * This represent when the button `use alt` is clicked.
     */
    onUseAlt: (alt: string) => void,
    /**
     * This represent when the button `delete alt` is clicked.
    */
    onRemoveAlt: (alt: string) => void,
}

function detectSysTheme() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDark;
}

export const AltListItem: React.FC<AltList> = ({ alt, onUseAlt, onRemoveAlt }) => {
    const [favorite, setFavorite] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [altHeadshot, setAltHeadshot] = React.useState<string>("");
    const [deleteStage, setDeleteStage] = React.useState(0);
    const [altname, setAltname] = React.useState(alt);
    const [useButtonDisabled, setUseButtonDisabled] = React.useState(false);

    useEffect(() => {
        if (window.location.toString().includes("options")) {
            setUseButtonDisabled(true);
        }
    }, [])
    useEffect(() => {
        let active = true;
        load();
        return () => { active = false };
        async function load() {
            if (active) {
                try {
                    if (!isNaN(Number(alt))) {
                        const username = await getRobloxUserById(alt);
                        if (username.Username)
                            setAltname(username.Username);
                        else if (username.username)
                            setAltname(username.username);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, [alt]);


    const onClickUseAlt = () => {
        onUseAlt(alt);
    }

    const innerOnDelete = () => {
        setDeleteStage(() => deleteStage + 1);
        let timeout = setTimeout(() => {
            setDeleteStage(0);
            clearTimeout(timeout);
        }, 1000);
        if (deleteStage === 0) {
            setDeleteStage(1);
        } else if (deleteStage === 1) {
            setDeleteStage(2);
        } else if (deleteStage === 2) {
            onRemoveAlt(alt)
        } else {
            setDeleteStage(0);
        }
    }

    return (
        <div className="alt-list-item">
            <Container>
                <Row align="center">
                    <Col>
                        <Text h3 color={useButtonDisabled && detectSysTheme() ? 'white' : 'black'}>{altname}</Text>
                    </Col>
                    <Col>
                        <Button
                            auto
                            type='button'
                            icon={<Delete set='curved' filled={deleteStage === 2} />}
                            onClick={() => innerOnDelete() }
                            flat
                            color={deleteStage >= 1 ? 'error' : 'primary'}
                            size='xs'
                        />
                   </Col>
                    <Col>
                        <Button type='button' onClick={() => onUseAlt(alt)}
                            icon={<Play set='curved' />} color='success' shadow
                            size='sm' disabled={useButtonDisabled}
                        >Use</Button> 
                    </Col>
                </Row>
            </Container>
        </div>
    );
}