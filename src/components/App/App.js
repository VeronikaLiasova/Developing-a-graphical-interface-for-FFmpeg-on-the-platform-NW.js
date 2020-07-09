import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import makeStyles from '@material-ui/styles/makeStyles';
import Console from 'components/Console';
import ControlPanel from 'components/ControlPanel';
import React, { useEffect, useState } from 'react';
import Worker from 'Worker';
import { ReactComponent as AppIcon } from './ffmpeg-logo.svg';

const useStyles = makeStyles({
    '@global': {
         html: {
             height: '100%',
             border: [ [ 1, 'solid', '#000' ] ],
             overflow: 'hidden',
             WebkitUserSelect: 'none',
         },
         body: {
             margin: 0,
             padding: [ [ 68, 0, 0 ] ],
         },
    },
    header: {
        WebkitAppRegion: 'drag',
    },
    toolbar: {
        boxSizing: 'border-box',
        padding: [ [ 14, 0 ] ],
    },
    icon: {
        width: 28,
        height: 28,
    },
    iconAvatar: {
        margin: [ [ 0, 14 ] ],
    },
    button: {
        minWidth: 0,
        marginRight: 14,
        padding: [ [ 6, 10 ] ],
        WebkitAppRegion: 'no-drag',
    },
    filler: {
        flexGrow: 1,
    },
});

const App = () => {
    const classes = useStyles();
    const [ settings, setSettings ] = useState(null);
    const [ showConsole, setShowConsole ] = useState(false);
    const [ output, setOutput ] = useState(null);

    useEffect(() => {
        if (!settings) {
            return;
        }

        const worker = new Worker(
            setOutput,
            () => setSettings(null),
        );

        worker.start(settings);
        setShowConsole(true);

        return () => {
            worker.stop();
        };
    }, [ settings ]);

    return (
        <>
            <AppBar className={classes.header}>
                <Toolbar className={classes.toolbar} disableGutters={true}>
                    <Avatar className={classes.iconAvatar} >
                        <AppIcon className={classes.icon} />
                    </Avatar>
                    <Typography variant="h5">FFmpeg GUI</Typography>

                    <div className={classes.filler} />

                    <Button className={classes.button} color="default" variant="contained">
                        <MinimizeIcon onClick={minimizeWindow} />
                    </Button>
                    <Button className={classes.button} color="secondary" variant="contained">
                        <CloseIcon onClick={closeWindow} />
                    </Button>
                </Toolbar>
            </AppBar>

            <ControlPanel onStart={(settings) => setSettings(settings)} />

            <Console
                output={output}
                running={!!settings}
                show={showConsole}
                onClose={() => setShowConsole(false)}
                onStop={() => setSettings(null)}
            />
        </>
    );
}

export default App;

/* global nw */

const closeWindow = () => {
    nw.App.quit();
};

const minimizeWindow = () => {
  nw.Window.get(window).minimize();
};
