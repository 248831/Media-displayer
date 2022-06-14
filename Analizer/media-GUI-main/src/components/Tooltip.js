import './Tooltip.css';

function Tooltip(props)
{    
    const className = props.visible ? 'tooltip' : 'tooltip hide';

    return <div className={className}
                style={{transform: 'translate3d(' + props.cursorPosition[0] + 'px, ' + props.cursorPosition[1] + 'px, 0px)'}}>
                    {props.tooltipContent}
            </div>;
}

export default Tooltip;
