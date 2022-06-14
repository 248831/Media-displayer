import { Fragment, useMemo } from 'react';
import { Node, Connector } from './mindMapComponents';
import colorTable from './nodeColors';

function MapBuilder(props) {
    let colorIndex = 0;

    const calcCountryTopics = (data) => {
        return data.reduce((arr, kraj) => [...arr,
            kraj.miasta.reduce((miasta, miasto) => [...miasta, 
                ...miasto.tematy.reduce((tematy, temat) => {
                    const idx = miasta.findIndex((element) => element.temat === temat.temat);
                    if(idx === -1) return [...tematy, {
                        temat: temat.temat,
                        art: temat.art,
                    }];
                    
                    const temp = miasta[idx];
                    const articleList = temp.art;
                    temat.art.forEach((article) => {
                        if(articleList.findIndex(art => art.tytul === article.tytul) === -1)
                            articleList.push(article);
                    })

                    return tematy;
                }, [])
            ], [])],
        []);
    };
    
    const countryListTopics = useMemo(() => calcCountryTopics(props.data), [props.data]);

    return props.data.map((kraj, i) => {
        const cSA = kraj.pozycja.split(',');
        const countryCoords = [parseFloat(cSA[0].slice(1)), parseFloat(cSA[1])];
        

        const connectedNodes = kraj.miasta.map((miasto, ix) => {
            const mSA = miasto.pozycja.split(',');
            const cityCoords = [parseFloat(mSA[0].slice(1)), parseFloat(mSA[1])];

            const connectedTopics = miasto.tematy.map((temat, inx) => {
                const tooltipListCities = temat.art.map((art, idx) => {
                    return <li key={idx} >
                        <a href={art.url}>
                            {art.tytul}
                        </a>
                    </li>
                });
                
                const topic = countryListTopics[i].find(t => t.temat === temat.temat);
                const tooltipListCountries = topic.art.map((art, idx) => {
                    return <li key={idx} >
                        <a href={art.url}>
                            {art.tytul}
                        </a>
                    </li>
                });

                const tooltipContent = <ul>{props.focus ? tooltipListCities : tooltipListCountries}</ul>;

                const tSA = temat.pozycja.split(',');
                const topicCoords = [parseFloat(tSA[0].slice(1)), parseFloat(tSA[1])];
                const multiplier = props.focus ? temat.trafnoscMiasta : temat.trafnoscKraju;
                const lineThickness = 1 + 2.5 * multiplier;
                const topicColor = colorTable[colorIndex];
                colorIndex = (colorIndex + 1) % colorTable.length;

                return <Fragment key={inx}>
                    <Connector startPoint={props.focus ? cityCoords : countryCoords} endPoint={topicCoords}
                        tooltipContent={tooltipContent} callback={props.onEdgeHoverFunc} thickness={lineThickness} />
                    <Node position={topicCoords} nodeRadius={6} color={topicColor}
                        nodeContent={temat.temat} callback={props.onNodeHoverFunc} />
                </Fragment>
            });

            const cityColor = colorTable[colorIndex];
            colorIndex = (colorIndex + 1) % colorTable.length;

            const granulation = props.focus ?
                <Fragment key={ix}>
                    <Node position={cityCoords} nodeRadius={9} nodeContent={miasto.miasto}
                        callback={props.onNodeHoverFunc} color={cityColor} />
                    {connectedTopics}
                </Fragment>
                : connectedTopics;
            
            return granulation;
        });

        const subGraph = !props.focus ?
            <Fragment key={i}>
                <Node position={countryCoords} nodeRadius={15} nodeContent={kraj.kraj}
                    callback={props.onNodeHoverFunc} color='gray' />
                {connectedNodes}
            </Fragment>
            : connectedNodes;

        return subGraph;
    });
}

export default MapBuilder;
