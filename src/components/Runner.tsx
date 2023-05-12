import React, {FC, RefObject, useEffect, useState} from 'react';
import {Station, TeamInfo, TeamPosition} from "../types";

interface RunnerProps {
    teamPositions: RefObject<TeamPosition>,
    teamId: number,
    team: TeamInfo,
    stations: Station,
    path: SVGPathElement
}

/**
 * Animation style 2
 * Difference with previous version is that it keeps running, doesn't matter what data comes in.
 * When new data comes in it checks if the runner reached the station sooner or later.
 * Based on that it'll adjust the next average time and add the offset it accumulated in the last segment
 */
const Runner: FC<RunnerProps> = ({ teamPositions, teamId, team, stations, path }) => {

    // TODO: Change next station id to using mod
    const [position, setPosition] = useState<DOMPoint>(path.getPointAtLength(0));

    useEffect(() => {
        let animationFrameId: number;

        const moveRunner = () => {
            if (teamPositions.current && teamId in teamPositions.current) {
                const teamPosition = teamPositions.current[teamId];
                const currentTime = Date.now();

                // Check if runner arrived to the next station
                if (currentTime > teamPosition.end) {
                    // Update information
                    teamPosition.stationId = stations[teamPosition.stationId].nextStationId;
                    teamPosition.stationTimes[teamPosition.stationId] = teamPosition.end;
                    teamPosition.begin = currentTime;
                    teamPosition.end = team.averageTimes[teamPosition.stationId] + teamPosition.offset;
                    teamPosition.offset = 0;
                    teamPosition.stationDistance = stations[teamPosition.stationId].distanceFromStart;
                    teamPosition.nextStationDistance = stations[stations[teamPosition.stationId].nextStationId].distanceFromStart;
                    if (teamPosition.stationDistance > teamPosition.nextStationDistance) {
                        teamPosition.stationDistance = 0;
                    }
                }
                // Calculate new position based on time passed
                const timeProgress = teamPosition.end / (currentTime - teamPosition.begin);
                const offset = (teamPosition.nextStationDistance - teamPosition.stationDistance) / timeProgress;
                const distance = teamPosition.stationDistance + offset;

                // TODO: Different way for lengthFactor
                const stationsSorted = Object.values(stations).sort((station1, station2) => station1.distanceFromStart - station2.distanceFromStart);
                const lengthFactor = path.getTotalLength() / stationsSorted[stationsSorted.length - 1].distanceFromStart;
                const newPos = distance * lengthFactor;
                setPosition(path.getPointAtLength(newPos));
            }

            animationFrameId = requestAnimationFrame(moveRunner);
        }

        animationFrameId = requestAnimationFrame(moveRunner);

        return () => cancelAnimationFrame(animationFrameId);
    });

    return (
        <image
            href={team.logo}
            x={position.x}
            y={position.y}
            width="5"
            height="5"
        />
    );
};

export default Runner;