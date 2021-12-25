import React, {useCallback} from 'react';
import propTypes from "prop-types";
import {cn} from '@bem-react/classname';



function SelectCategory(props){

    // CSS классы по БЭМ
    const className = cn('Select');

    const onSelect = useCallback((e) => {
        props.onChange(e.target.value);
        console.log('value', e.target.value)
    }, [props.onChange])

    return (
        <select className={className()} onChange={onSelect} value={props.value}>
            <option key={Symbol} value={''}>Все</option>
            {props.options.map(category => (
                <option key={category._id} value={'&search[category]=' + category._id}>{category.title}</option>
            ))}
        </select>
    )
}

SelectCategory.propTypes = {
    options: propTypes.arrayOf(propTypes.object).isRequired,
    value: propTypes.any,
    onChange: propTypes.func
}

SelectCategory.defaultProps = {
    onChange: () => {
    }
}

export default React.memo(SelectCategory);