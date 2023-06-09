import React, {FC} from 'react';
import {Card, CardActions, CardContent, CardMedia, Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";
import {TeamInfo} from "../types";
import "../styles/team.css"

interface TeamProps {
    id: string,
    team: TeamInfo,
    callback: (id: string) => void
}

const TeamDisplay: FC<TeamProps> = ({ id, team, callback }) => {
    return (
        <Grid item xs={3} md={1}>
            <Card className="team">
                <CardMedia
                    component="img"
                    height="auto"
                    image={"../logo/" + team.logo}
                    alt={team.name}
                />
                <CardContent>
                    <Typography variant="body2">
                        {team.name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <FormControlLabel
                        control={<Checkbox checked={team.show} onChange={() => callback(id)}/>}
                        label={<Typography variant="body2">Show</Typography>}
                        labelPlacement="bottom"
                    />
                </CardActions>
            </Card>
        </Grid>
    );
};

export default TeamDisplay;