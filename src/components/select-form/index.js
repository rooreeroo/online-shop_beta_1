import React, {useCallback} from 'react';
import propTypes from "prop-types";
import {cn} from '@bem-react/classname'
import './styles.css';

function SelectForm(props){

    // CSS классы по БЭМ
    const className = cn('Select');

    const onSelect = useCallback((e) => {
        props.onChange(e.target.value);
    }, [props.onChange])

    return (
        <select className={className()} onChange={onSelect} defaultValue={props.value}>
            {props.options.map(item => (
                <option key={item._id} value={item._id}>{item.title}</option>
            ))}
        </select>
    )
}

SelectForm.propTypes = {
    options: propTypes.arrayOf(propTypes.object).isRequired,
    value: propTypes.any,
    onChange: propTypes.func
}

SelectForm.defaultProps = {
    onChange: () => {
    }
}

export default React.memo(SelectForm);