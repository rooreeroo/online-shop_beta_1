import React, {useCallback} from 'react';
import propTypes from 'prop-types';
import {cn} from '@bem-react/classname'
import './styles.css';
import Input from "../input";
import Select from "../select";
import Textarea from '../textarea'

function ArticleRefactor({onChange, article, putForm, countries, categories}) {
    let handleSubmit = (event) => {
        putForm(article);
        event.preventDefault();
    }


    // CSS классы по БЭМ
    const className = cn('ArticleRefactor');

    return (
        <form className={className()} onSubmit={(event) => handleSubmit(event)}>
            <div className={className('Title')}>Название:</div>
            <Input
                onChange={(e) => onChange('title', e)}
                className={className('Title_input')}
                value={article.title}
            />
            <div className={className('Description')}>Описание:</div>
            <Textarea
                onChange={(e) => onChange('description', e)}
                className={className('Description_text')}
                value={article.description}
            />
            <div className={className('Label')}>Страна производитель:</div>
            <Select
                onChange={(e) => onChange('maidIn', e)}
                options={countries}
                value={article.maidIn?._id}
            />
            <div className={className('Category')}>Категория:</div>
            <Select
                onChange={(e) => onChange('category', e)}
                value={article.category?._id}
                options={categories}
            />
            <div className={className('Edition')}>Год выпуска:</div>
            <Input
                onChange={(e) => onChange('edition', e)}
                className={className('Edition_input')}
                value={article.edition}
            />
            <div className={className('Label')}>Цена:</div>
            <Input
                onChange={(e) => onChange('price', e)}
                className={className('Value')}
                value={article.price}
            />
            <div className={className('Button')}>
                <input
                    type="submit"
                    value={"Сохранить"}
                />
            </div>
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
