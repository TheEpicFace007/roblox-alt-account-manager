import { Avatar, Button, Col, Container, Grid, Row, Text } from "@nextui-org/react";
import React from "react";
import { Play, Star } from "react-iconly";
import { getRobloxUserHeadshot } from "../shared/roblox";

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

    const onClickUseAlt = () => {
        onUseAlt(alt);
    }
    const onClickRemoveAlt = () => {
        onRemoveAlt(alt);
    }
    const onClickFavorite = () => {
        //TODO: set the alt as favorite in browser storage using the extension 
        setFavorite(!favorite);
    }

    const [headshot, setHeadshot] = React.useState<string>("");
    getRobloxUserHeadshot({ usernameOrId: alt, res: 100 }).then(headshot => {
        if (headshot) {
            setHeadshot(headshot);
        }
    });
    return (
        <div className="alt-list-item">
            <Container>
                <Row align="center">
                    <Col>
                        <Avatar size='md' src={headshot} />
                    </Col>
                    <Col>
                        <Text h3>{alt}</Text>
                    </Col>
                    <Col>
                        <Button
                            auto
                            type="button"
                            icon={<Star set='curved' filled={favorite} />}
                            onClick={onClickFavorite}
                            color={favorite ? 'warning' : 'primary'}
                            size='xs'
                            flat
                         />
                    </Col>
                    <Col>
                        <Button type='button' onClick={() => onUseAlt(alt)} size='sm'
                            icon={<Play set='curved' />}
                            color='success' shadow
                        >Use</Button> 
                    </Col>
                </Row>
            </Container>
        </div>
    );
}