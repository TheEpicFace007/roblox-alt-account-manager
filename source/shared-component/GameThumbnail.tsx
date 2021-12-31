import {
   Card 
} from "@nextui-org/react"
import React from "react";
import { getThumbnail, getUniverseID } from "../shared/roblox";

export type GameThumbnailProps = {
    gameid: string;
}

export const GameThumbnail: React.FC<GameThumbnailProps> = ({ gameid }) => {
    const [thumburl, setThumburl] = React.useState<string>("");
    getUniverseID(gameid).then(gameid => getThumbnail([gameid], { size: "512x512", isCircular: true })).then(thumburl => {
            setThumburl(thumburl[0]);
    });
    return (
        <Card hoverable clickable>
            <Card.Body>
                <Card.Image
                    src={thumburl}
                    objectFit="cover"
                />
            </Card.Body>
        </Card>
    )
}