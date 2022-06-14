import React, { useState } from 'react';
import { getHighestAcc, getTopicList, getCityAccuracies, getCountryAccuracies } from '../dataHelper/accuracyCalculator';
import Tooltip from './Tooltip';
import './Table.css';
import TableBuilder from '../dataHelper/TableBuilder';

function Table(props) 
{
    const [isChecked, changeIsChecked]  = useState(true);
    const [showTooltip, changeTooltipVisibility]  = useState(false);
    const [artTitle, changeArtTitle]  = useState("tytul");
    const [mouse, changeMouse]  = useState([0,0]);
    const mydata = props.mydata;

    const dataDisplay = (event, data) => {
        if(data === false) {changeTooltipVisibility(false); return;}
        changeTooltipVisibility(true);
        changeMouse([event.pageX, event.pageY]);
        changeArtTitle(data);
    }

    const countryList = mydata.reduce((array, country) => [...array, country.kraj], [0]);

    const cityList = mydata.reduce((array, country) => 
        country.miasta.reduce((list, city) => [...list, city.miasto], array), [0]);
    
    const topicAccuracyPerc = (highestAcc, topicAcc) => {
        return 100 * topicAcc / highestAcc;
    }

    const topicList = getTopicList(mydata)
    const highest_acc = getHighestAcc(mydata);
    const cityAccuracies = getCityAccuracies(mydata, topicList, highest_acc, topicAccuracyPerc);
    const countryAccuracies = getCountryAccuracies(mydata, topicList, highest_acc, topicAccuracyPerc);
    const cityTable = <TableBuilder places={cityList} accuracies={cityAccuracies} isCountry={false} data={mydata} callback={dataDisplay} />;
    const countryTable = <TableBuilder places={countryList} accuracies={countryAccuracies} isCountry={true} data={mydata} callback={dataDisplay} />;
    const finalTable = isChecked ? countryTable : cityTable;


    return <>
        <div className='wrapper'>
            <div className='choose-display'>
                <div className='display-wrapper'>
                    <label>
                        <input
                        type="checkBox"
                        name="placeChange"
                        defaultChecked={isChecked}
                        onChange={(e)=>{changeIsChecked(!isChecked)}}
                        />
                        Zmiana dokładności miejsca
                    </label>
                </div>
            </div>
        </div>
        <Tooltip visible={showTooltip} tooltipContent={artTitle} cursorPosition={mouse} />
        <div style={{top:'2px',left:'2px'}}>
            <div>
                <table>
                    {finalTable}
                </table>
            </div>
        </div>
    </>;
    
}

export default Table;