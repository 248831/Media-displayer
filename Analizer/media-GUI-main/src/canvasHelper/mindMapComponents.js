import mindMapNode from '../canvasHelper/mindMapNode';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { extend, useThree } from '@react-three/fiber';
import { LineCurve3, Vector3 } from 'three';

extend({Line2, LineMaterial, LineGeometry})

function Node(props) {
    const ref = useRef();
    const [nodeCanvas, setCanvas] = useState(null);

    useEffect(() => {        
        (async () => {
            if(!nodeCanvas)
            {
                const canvas = await mindMapNode(
                    props.nodeContent, props.color);
                setCanvas(canvas);
            }
        })();
        
        return () => {};
    }, [nodeCanvas, props.nodeContent, props.color]);

    const meshProps = {
        ref: ref,
        position: new Vector3(...props.position, 0),
        onPointerOver: event => props.callback(event, props.nodeContent, props.color),
        onPointerOut: event => props.callback(event, false),
    };

    return <mesh {...meshProps}>
                <circleGeometry args={[props.nodeRadius, 32]} />
                <meshBasicMaterial>
                    <canvasTexture attach='map' image={nodeCanvas} />
                </meshBasicMaterial>
        </mesh>;
};

function Connector(props) {
    const { size } = useThree();
    const ref = useRef();
    const meshProps = {
        onPointerOver: (event) => props.callback(event, props.tooltipContent),
        onPointerOut: (event) => props.callback(event, false),
    }

    useLayoutEffect(() => {
        const curve = new LineCurve3(new Vector3().fromArray(props.startPoint.concat(-0.1)), new Vector3().fromArray(props.endPoint.concat(-0.1)));
        const curvePoints = curve.getPoints().reduce((acc, { x, y, z }) => [...acc, x, y, z], [], []);
        ref.current.setPositions(curvePoints);
      }, [props.startPoint, props.endPoint])

    return <line2 {...meshProps}>
            <lineGeometry ref={ref} />
            <lineMaterial color={'#333'} linewidth={props.thickness} resolution={[size.width, size.height]} />    
        </line2>;
};

export {
    Node,
    Connector
}
