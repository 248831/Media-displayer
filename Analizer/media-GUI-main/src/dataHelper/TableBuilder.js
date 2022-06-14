
function TableBuilder(props)
{
    const red = [255, 0, 0];
    const green = [0, 255, 0];
    const yellow = [255, 255, 0];
    const white = [255, 255, 255];
    let number = 0;

    const getColour = (between, colour1, colour2) => {
        return colour1.map((_ , idx) => Math.floor(colour1[idx] + Math.min(between, 1) * (colour2[idx] - colour1[idx])))
    }

    const insides = props.accuracies.map((subList)=>{
        let count = 0;
        
        const subLista = subList.map((element)=>{
            let color;
            let colorArray;

            if (element >= 0 && element <= 33)
            {
                colorArray = getColour(element / 33, white, green);
                color = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`
            }
            else if(element > 33 && element <= 66)
            {
                colorArray = getColour((element - 33) / 33, green, yellow);
                color = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`
            }
            else if(element > 66)
            {
                colorArray = getColour((element - 66) / 33, yellow, red);
                color = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`
            }

            const articleList = [];

            if(count !== 0)
            {
                if(element !== 0)
                {
                    if(props.isCountry === true)
                    {
                        props.data.forEach(country => {
                            if(country.kraj === props.places[count])
                            {
                                country.miasta.forEach(city => {
                                    city.tematy.forEach(topic => {
                                        if(topic.temat === subList[0])
                                        {
                                            topic.art.forEach(article => {
                                                const nestedList = [];
                                                nestedList.push(article.tytul);
                                                nestedList.push(article.url);
                                                articleList.push(nestedList);
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    }
                    else
                    {
                        props.data.forEach(country => {
                            country.miasta.forEach(city => {
                                if(city.miasto === props.places[count])
                                {
                                    city.tematy.forEach(topic => {
                                        if(topic.temat === subList[0])
                                        {
                                            topic.art.forEach(article => {
                                                let nestedList = [];
                                                nestedList.push(article.tytul);
                                                nestedList.push(article.url);
                                                articleList.push(nestedList);
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    }
                }
                element = ''
            }
            
            const set = [...new Map(articleList)]

            if(count === 0) color = 'lightgray';
            count++;

            const artLista = <ul key={number++}>
                    {set.map((art) => {
                        return <li key={number++}>
                            <a href={art[1]} target='_blank' rel='noreferrer'>{art[0]}</a>
                        </li>;
                    })}
                </ul>

            return <td key={number++} className="table-inside" style={{backgroundColor: color}}
                onMouseOver={e => {if(color!==`rgb(255, 255, 255)` && color!== 'lightgray') props.callback(e, artLista)}}
                onMouseOut={e => props.callback(e,false)}>{element}</td>
        });

        return <tr key = {number++}>
                {subLista}
            </tr>;
        
    })

    const headerRow = !props.places
        ? null
        : props.places.map((header)=>{
            let hcolor = 'lightgray';
            if(header === 0)
            {
                hcolor = 'grey';
                header = ''
            }
            return <th className="table-header" key={number++} style={{backgroundColor: hcolor}}>{header}</th>
        });

    return (!props.places) ? null : (
        <tbody style={{borderWidth:"1px", borderColor:"black", borderStyle:"solid"}}>
            <tr key={number++}>{headerRow}</tr>
            {insides}
        </tbody>
    )
}

export default TableBuilder;