import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useCallback, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const useStyles = makeStyles({
    hidden: {
        display: 'none',
    },
    root: {
        position: 'absolute',
        top: 68,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 2,
        padding: 14,
        background: '#fff',
    },
    terminal: {
        height: 344,
    },
});

const Console = ({
    output,
    running,
    show,
    onClose,
    onStop,
}) => {
    const classes = useStyles();
    const terminalRef = useRef(null);
    const attachTerminal = useCallback(node => {
        if (!node) {
            return;
        }

        const currentTerminal = terminalRef.current;

        if (currentTerminal) {
            if (currentTerminal.element === node) {
                return;
            }

            terminalRef.current.dispose();
            terminalRef.current = null;
        }

        const terminal = new Terminal({
            convertEol: true,
            disableStdin: true,
            rendererType: 'dom',
            cursorStyle: 'bar',
            cursorWidth: 0,
        });
        const fitAddon = new FitAddon();

        terminal.loadAddon(fitAddon);
        terminal.open(node);
        fitAddon.fit();

        terminalRef.current = terminal;
    }, []);

    useEffect(() => {
        const terminal = terminalRef.current;

        if (!terminal) {
            return;
        }

        if (typeof output !== 'string') {
            terminal.reset();
        } else {
            terminal.write(output);
        }
    }, [ output, terminalRef ]);

    return (
        <Slide in={show} direction="down">
            <div className={classes.root}>
                <Grid container={true} spacing={2}>
                    <Grid item={true} xs={12}>
                        <div className={classes.terminal} ref={attachTerminal} />
                    </Grid>

                    <Grid item={true} xs={12}>
                        <Button
                            color="secondary"
                            fullWidth={true}
                            size="large"
                            variant="contained"
                            onClick={onStop}
                            className={!running ? classes.hidden : null}
                        >
                            Stop
                        </Button>

                        <Button
                            color="primary"
                            fullWidth={true}
                            size="large"
                            variant="contained"
                            onClick={onClose}
                            className={running ? classes.hidden : null}
                        >
                            Close Log
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Slide>
    );
};

export default Console;
