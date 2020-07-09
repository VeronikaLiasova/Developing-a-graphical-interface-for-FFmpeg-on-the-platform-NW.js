import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { createRef, useCallback, useState } from 'react';

const useStyles = makeStyles({
    root: {
        padding: 14,
    },
});

const ControlPanel = ({ onStart }) => {
    const classes = useStyles();
    const [ ffmpegExecutable, setFfmpegExecutable ] = useState('');
    const [ inputFile, setInputFile ] = useState('');
    const [ outputDir, setOutputDir ] = useState('');
    const [ container, setContainer ] = useState('avi');
    const [ videoCodec, setVideoCodec ] = useState('copy');
    const [ outputVideo, setOutputVideo ] = useState(true);
    const [ audioCodec, setAudioCodec ] = useState('copy');
    const [ outputAudio, setOutputAudio ] = useState(true);
    const [ startTime, setStartTime ] = useState('');
    const [ endTime, setEndTime ] = useState('');

    const handleStart = () => onStart({
        ffmpegExecutable,
        inputFile,
        outputDir,
        container,
        videoCodec,
        outputVideo,
        audioCodec,
        outputAudio,
        startTime,
        endTime,
    });

    return (
        <div className={classes.root}>
            <Grid container={true} spacing={2}>
                <FileInput
                    label="FFmpeg Executable"
                    value={ffmpegExecutable}
                    onChange={setFfmpegExecutable}
                    onSelect={setFfmpegExecutable}
                />

                <FileInput
                    label="Input File"
                    value={inputFile}
                    onChange={setInputFile}
                    onSelect={setInputFile}
                />

                <FileInput
                    label="Output Directory"
                    value={outputDir}
                    directory={true}
                    onChange={setOutputDir}
                    onSelect={setOutputDir}
                />

                <Input
                    label="Container"
                    value={container}
                    onChange={setContainer}
                    select={true}
                    colSpan={4}
                >
                    <MenuItem value="aac">AAC</MenuItem>
                    <MenuItem value="avi">AVI</MenuItem>
                    <MenuItem value="mkv">MKV</MenuItem>
                    <MenuItem value="mp4">MP4</MenuItem>
                    <MenuItem value="mxf">MXF</MenuItem>
                    <MenuItem value="ts">TS</MenuItem>
                </Input>

                <SwitchableInput
                    label="Video Codec"
                    value={videoCodec}
                    enabled={outputVideo}
                    onEnabled={setOutputVideo}
                    onChange={setVideoCodec}
                    colSpan={4}
                />

                <SwitchableInput
                    label="Audio Codec"
                    value={audioCodec}
                    enabled={outputAudio}
                    onEnabled={setOutputAudio}
                    onChange={setAudioCodec}
                    colSpan={4}
                />

                <Input
                    label="Start Time"
                    value={startTime}
                    onChange={setStartTime}
                    colSpan={6}
                />

                <Input
                    label="End Time"
                    value={endTime}
                    onChange={setEndTime}
                    colSpan={6}
                />

                <Grid item={true} xs={12}>
                    <Button
                        color="primary"
                        fullWidth={true}
                        size="large"
                        variant="contained"
                        onClick={handleStart}
                    >
                        Start
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ControlPanel;

const Input = ({
    label,
    value,
    onChange,
    colSpan = 12,
    ...props
}) => (
    <Grid item={true} xs={colSpan}>
        <TextField
            label={label}
            value={value}
            fullWidth={true}
            variant="filled"
            onChange={({ target: { value } }) => onChange(value)}
            {...props}
        />
    </Grid>
);

const FileInput = ({
    directory = false,
    onSelect,
    ...props
}) => {
    const inputRef = createRef();

    const handleSelect = useCallback(() => {
        const [ file ] = inputRef.current.files || [];

        if (!file) {
            return;
        }

        onSelect(file.path);
    }, [ inputRef, onSelect ]);

    const handleOpenDialog = useCallback(() => {
        const input = inputRef.current;

        input.value = '';
        input.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true })
        );
    }, [ inputRef ]);

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                onChange={handleSelect}
                nwdirectory={directory ? "" : undefined}
                style={{ display: 'none' }}
            />

            <Input
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleOpenDialog}>
                                <MoreHorizIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                {...props}
            />
        </>
    );
};

const SwitchableInput = ({
    enabled = true,
    onEnabled,
    ...props
}) => (
    <Input
        disabled={!enabled}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <Switch
                        checked={enabled}
                        color="primary"
                        onChange={({ target: { checked } }) => onEnabled(checked)}
                    />
                </InputAdornment>
            ),
        }}
        {...props}
    />
);
