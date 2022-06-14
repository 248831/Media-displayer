
function getHighestAcc(data)
{
    let max = 0;
    data.forEach(element => {
        element.miasta.forEach(element => {
            element.tematy.forEach(element => {
                let topicAcc = 0;
                element.art.forEach(element=> {
                    topicAcc += parseFloat(element.trafnosc);
                })
                if(max < topicAcc) max = topicAcc;
            });
        });
    });
    return max;
}

function getTopicList(data)
{
    const list = [];
    data.forEach(element => {
        element.miasta.forEach(element => {
            element.tematy.forEach(element => {
                list.push(element.temat);
            });
        });
    });
    const set = [...new Set(list)];
    return set;
}

function getCountryAccuracies(data, topics, acc, accuracyFunction)
{
    const mainList = [];

    topics.forEach(topic=> {
        const list = [];
        list.push(topic);

        data.forEach(country => {
            let topicAcc= 0;

            country.miasta.forEach(city => {
                city.tematy.forEach(ctopic => {
                    if(ctopic.temat === topic)
                    {
                        ctopic.art.forEach(article=>{
                            topicAcc += parseFloat(article.trafnosc);
                        });
                    }
                });
            });
            list.push(accuracyFunction(acc, topicAcc));
        });
        mainList.push(list);
    });

    return mainList;
}

function getCityAccuracies(data, topics, acc, accuracyFunction)
{
    const mainList = [];

    topics.forEach(topic => {
        const list = [];
        list.push(topic);

        data.forEach(country => {
            country.miasta.forEach(city => {
                let topicAcc = 0;

                city.tematy.forEach(ctopic => {
                    if(ctopic.temat === topic)
                    {
                        ctopic.art.forEach(article => {
                            topicAcc += parseFloat(article.trafnosc);
                        });
                    }
                });
                list.push(accuracyFunction(acc, topicAcc));
            });
        });
        mainList.push(list);
    });

    return mainList;
}

export {
    getTopicList,
    getHighestAcc,
    getCityAccuracies,
    getCountryAccuracies,
}
