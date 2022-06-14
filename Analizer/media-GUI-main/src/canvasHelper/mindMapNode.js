import { renderToStaticMarkup } from 'react-dom/server';

async function mindMapNode(content, color) {
    const canvas = document.createElement('canvas');
    canvas.height = 100;
    canvas.width = 100;
    const context = canvas.getContext('2d');
    const url = `data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <style type="text/css">
            .node {
                height: 0;
                display: flex;
                min-width: 20px;
                min-height: 20px;
                padding: 38% 10px;
                text-align: center;
                align-items: center;
                border-radius: 100%;
                font: bold 14px Roboto;
                justify-content: center;
                border: 1px black solid;
            }
        </style>
        <foreignObject width="100px" height="100px">
            ${renderToStaticMarkup(<ReactNode content={content} color={color} />)}
        </foreignObject>
    </svg>`;
    
    const image = await loadImage(url);
    context.drawImage(image, 0, 0);
    return canvas;
}

function loadImage(url) {
    const image = new window.Image();
    return new Promise((resolve) => {
        image.onload = () => resolve(image);
        image.src = url;
    });
}

function ReactNode(props) {
    return <div
        xmlns='http://www.w3.org/1999/xhtml'
        className='node'
        style={{backgroundColor: props.color,}}>
            <div>{props.content}</div>
    </div>
}

export default mindMapNode;
