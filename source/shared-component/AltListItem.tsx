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

export const AltListItem: React.FC<AltList> = ({ alt, onUseAlt, onRemoveAlt }) => {
    const [favorite, setFavorite] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [altHeadshot, setAltHeadshot] = React.useState<string>("");
    const [deleteStage, setDeleteStage] = React.useState(0);
    const [altname, setAltname] = React.useState(alt);
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
    const onClickFavorite = () => {
        //TODO: set the alt as favorite in browser storage using the extension 
        setFavorite(!favorite);
    }
    const [headshot, setHeadshot] = React.useState<string>("");
    React.useEffect(() => {
        let active = true;
        load();
        return () => { active = false };
        async function load() {
            if (active) {
                try {
                    const headshot = await getRobloxUserHeadshot({ usernameOrId: alt, res: 100 });
                    if (active) {
                        setHeadshot(headshot);
                    }
                } catch (e) {
                    setHeadshot("");
                }
            }
        }
    }, [alt]);

    const innerOnDelete = () => {
        setDeleteStage(() => deleteStage + 1);
        let timeout = setTimeout(() => {
            setDeleteStage(0);
            clearTimeout(timeout);
        }, 1000);
        console.log(deleteStage)
        if (deleteStage === 0) {
            setDeleteStage(1);
        } else if (deleteStage === 1) {
            setDeleteStage(2);
        } else if (deleteStage === 2) {
            // onDelete()
        } else {
            setDeleteStage(0);
        }
    }

    return (
        <div className="alt-list-item">
            <Container>
                <Row align="center">
                    <Col>
                        <Avatar size='md' src={headshot} />
                    </Col>
                    <Col>
                        <Text h3>{altname}</Text>
                    </Col>
                    <Col>
                        <Spacer y={0.4} />
                        <Button
                            auto
                            type="button"
                            icon={<Star set='curved' filled={favorite} />}
                            onClick={onClickFavorite}
                            color={favorite ? 'warning' : 'primary'}
                            flat
                            size='xs'
                        />
                        <Spacer y={0.4}/>
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
                            size='sm'
                        >Use</Button> 
                    </Col>
                </Row>
            </Container>
        </div>
    );
}