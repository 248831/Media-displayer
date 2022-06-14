import './menu.css';
import MindMap from './MindMap.js';
import Table from './Table.js';
import React, { useState } from 'react';
import Dane from '../dane.json';
import Return from '../assets/Return.jpg';
import MapIcon from '../assets/Map.jpg';
import TableIcon from '../assets/Table.jpg';

function MainMenu()
{
    const [selected, setSelected] = useState('');
    const body = document.getElementsByTagName('body')[0];
    const icon = selected === 'map' ? 
            TableIcon
            : selected === 'table' ?
                MapIcon
                : Return;
    
    const warnBackup = console.warn;
    const logBackup = console.log;

    console.warn = function filterWarnings(msg) {
        const supressedWarnings = [
            'THREE.WebGLRenderer: Texture marked for update but no image data found.',
            'WebGL context was lost.'
        ];

        if(typeof msg === 'string')
            if (supressedWarnings.some(entry => msg.includes(entry))) return;
        warnBackup.call(console, msg);
    };

    console.log = function filterLogs(msg) {
        const supressedLogs = [
            'THREE.WebGLRenderer: Context Lost.'
        ];

        if(typeof msg === 'string')
            if (supressedLogs.some(entry => msg.includes(entry))) return;
        logBackup.call(console, msg);
    };


    const select = (selectorName) => {
        body.className = selectorName === 'map' || selected === 'table' ? 'canvas' : '';

        if(selectorName !== 'table' && selectorName !== 'map')
        {
            const select = selected ?
                selected === 'table' ? 
                    'map'
                    : 'table'
                : '';

            setSelected(select);
            return;
        }
        
        setSelected(selectorName);
    };

    const built = selected ?
    <div className='selected-menu'>
        <img className='return-button' src={icon} alt='return button' onClick={ () => select()} />
        {
            selected === 'table' ?
                <Table mydata={Dane}/> 
                : <MindMap data={Dane} />
        }
    </div>
    :   
    <div className='menu'>
        <h1>Wybierz metodę wyświetlania danych:</h1>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <button onClick={() => select('table')}>Tabela</button>
            <button onClick={() => select('map')}>Mapa myśli</button>
        </div>
    </div>;

    return built;
}

export default MainMenu;
