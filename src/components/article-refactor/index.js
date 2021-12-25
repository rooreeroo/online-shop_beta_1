import React, {useCallback} from 'react';
import propTypes from 'prop-types';
import {cn} from '@bem-react/classname'
import './styles.css';
import numberFormat from "../../utils/number-format";
import Input from "../input";

function ArticleRefactor({article, putForm, options}) {



    const onSelect = useCallback((e) => {
    }, [])

    // CSS классы по БЭМ
    const className = cn('ArticleRefactor');

    return (
        <form className={className()}>
            <div className={className('Title')}>Название:</div>
            <Input className={className('Title_input')} name='title' value={article.title} required/>

            <div className={className('Description')}>Описание:</div>
            <textarea className={className('Description_text')} name='description' value={article.description} required />

            <div className={className('Label')}>Страна производитель:</div>
            <select onChange={onSelect} defaultValue={article.maidIn?.title} name='maidIn?._id'>
                {options.countries && options.countries.map(country => (
                    <option key={country._id} value={country._id} selected={country.title === article.maidIn?.title} >{country.title}</option>
                ))}
            </select>

            <div className={className('Category')}>Категория:</div>
            <select onChange={onSelect} defaultValue={article.category?.title} name='category?._id'>
                {options.categories && options.categories.map(category => (
                    <option key={category._id} value={category._id} selected={category.title === article.category?.title} >{category.title}</option>
                ))}
            </select>

            <div className={className('Edition')}>Год выпуска:</div>
            <Input className={className('Edition_input')} name='edition' value={article.edition} required/>

            <div className={className('Label')}>Цена:</div>
            <Input className={className('Value')} name='price' value={`${numberFormat(article.price)}`} required/>

            <div className={className('Button')}><input type="submit" value={"отправить"} className={'active'} onClick={() => putForm(article._id)}/></div>
        </form>
    )
}

ArticleRefactor.propTypes = {
    article: propTypes.object.isRequired,
    putForm: propTypes.func
}

ArticleRefactor.defaultProps = {
    article: {},
    putForm: () => {}
}

export default React.memo(ArticleRefactor);
