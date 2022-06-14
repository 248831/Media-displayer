import { MOUSE } from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getHighestAcc, getTopicList, getCityAccuracies, getCountryAccuracies } from '../dataHelper/accuracyCalculator';
import MapBuilder from '../canvasHelper/MapBuilder';
import Tooltip from './Tooltip';
import './MindMap.css';

extend({ OrbitControls });

function MindMap(props)
{   
    const [cursorPosition, changeCursorPosition] = useState([0, 0]);
    const [showNodeCloseUp, changeShowNodeCloseUp] = useState(false);
    const [showTooltip, changeTooltipVisibility] = useState(false);
    const [tooltipText, changeTooltipText] = useState('');
    const [nodeColor, changeNodeColor] = useState('gray');
    const [nodeText, changeNodeText] = useState('');
    const [dynamic, setDynamic] = useState(true);
    const [focus, setFocus] = useState(false);
    
    const dataDisplay = (event, data) => {
        if(data === false)
        {
            changeTooltipVisibility(false);
            return;
        }

        changeCursorPosition([event.clientX, event.clientY]);
        changeTooltipVisibility(true);
        changeTooltipText(data);
    }

    const nodeCloseUp = (event, data, color) => {
        if(data === false)
        {
            changeShowNodeCloseUp(false);
            return;
        }

        changeCursorPosition([event.clientX, event.clientY]);
        changeShowNodeCloseUp(true);
        changeNodeColor(color);
        changeNodeText(data);
    }

    const onRadioChange = (event) => {
        const value = event.target.value;
        if(value === 'D') setDynamic(true);
        else
        {
            setDynamic(false);
            setTimeout(() => setFocus(value === 'M'), 200);
        }
    };

    const topicAccuracy = (highestAcc, topicAccuracy) => {
        return topicAccuracy / highestAcc;
    }

    const topicList = getTopicList(props.data);
    const highest_acc = getHighestAcc(props.data);
    const cityAccuracies = getCityAccuracies(props.data, topicList, highest_acc, topicAccuracy);
    const countryAccuracies = getCountryAccuracies(props.data, topicList, highest_acc, topicAccuracy);
    
    props.data.forEach(kraj => 
        kraj.miasta.forEach((miasto, index) => {
            miasto.tematy.forEach((temat) => {
                const topicIndex = cityAccuracies.findIndex((topicSet) => topicSet[0] === temat.temat);
                temat.trafnoscMiasta = cityAccuracies[topicIndex][index + 1];
            });
        }));

    props.data.forEach((kraj, index) => {
        kraj.miasta.forEach(miasto => {
                miasto.tematy.forEach((temat) => {
                    const topicIndex = countryAccuracies.findIndex((topicSet) => topicSet[0] === temat.temat);
                    temat.trafnoscKraju = countryAccuracies[topicIndex][index + 1];
                });
            });
    });

    return <>
            <div className='wrapper'>
                <div className='choose-display' onChange={onRadioChange}>
                    <div className='display-wrapper'>
                    Wyswietlanie danych:
                        <div><input type='radio' value='D' name='display' defaultChecked={dynamic} /> Dynamiczne</div>
                        <div><input type='radio' value='K' name='display' defaultChecked={!dynamic && !focus} /> Kraje</div>
                        <div><input type='radio' value='M' name='display' defaultChecked={!dynamic && focus} /> Miasta</div>
                    </div>
                </div>
            </div>
            <Tooltip visible={showTooltip} tooltipContent={tooltipText} cursorPosition={cursorPosition} />
            <NodeCloseUp visible={showNodeCloseUp} nodeText={nodeText} cursorPosition={cursorPosition} color={nodeColor} />
            <Canvas camera={{position: [0, 0, 200]}}>
                <CameraControls update={dynamic} callback={setFocus} />
                <MapBuilder data={props.data} onEdgeHoverFunc={dataDisplay} onNodeHoverFunc={nodeCloseUp} focus={focus} />
            </Canvas>
        </>;
};

function CameraControls(props) {
    const { camera, gl: { domElement }, } = useThree();  
    const controls = useRef();
    useFrame((state) => {
        controls.current.update();
        if(props.update)
            props.callback(camera.position.z < 100)
        });

    const mouseButtons = {
        LEFT: MOUSE.PAN,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.ROTATE
    }

    return <orbitControls ref={controls} args={[camera, domElement]}
            mouseButtons={mouseButtons} enableRotate={false} />;
};

function NodeCloseUp(props) {
    const className = props.visible ? 'node' : 'node hide';

    return <div className={className}
                style={{left: props.cursorPosition[0], top: props.cursorPosition[1], backgroundColor: props.color}}>
                    <div>{props.nodeText}</div>
            </div>;
}

export default MindMap;