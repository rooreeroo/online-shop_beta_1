import React, {useCallback} from 'react';
import propTypes from "prop-types";
import {cn} from '@bem-react/classname'
import './styles.css';

function Select(props){

  // CSS классы по БЭМ
  const className = cn('Select');

  const onSelect = useCallback((e) => {
    props.onChange(e.target.value);
  }, [props.onChange]);

  return (
    <select className={className()} onChange={onSelect} value={props.value}>
      {props.all === undefined ? null : props.all}
      {props.options.map(item => (
        <option key={item.value || item._id} value={item.value || item._id}>{item.title}</option>
      ))}
    </select>
  )
}

Select.propTypes = {
  options: propTypes.arrayOf(propTypes.object).isRequired,
  value: propTypes.any,
  onChange: propTypes.func
};

Select.defaultProps = {
  onChange: () => {
  }
};

export default React.memo(Select);
