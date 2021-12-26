import React, {useCallback, useEffect} from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner";
import ArticleRefactor from "../../components/article-refactor";
import Header from "../../containers/header";
import useInit from "../../utils/use-init";

function ArticleForm() {

    const store = useStore();
    // Параметры из пути
    const params = useParams();

    // Начальная загрузка
    useInit(async () => {
        await store.get('form').getCountries();
        await store.get('categories').getCategories();
        await store.get('form').load(params.id);
        await store.get('article').load(params.id)
    }, [params.id]);
    // store.form.getState().resp.subscribe({})
    const select = useSelector(state => ({
        countries: state.form.countries,
        data: state.form.data,
        article: state.article.data,
        waiting: state.form.waiting,
        categories: state.categories.nonChangedCat,
        error: state.form.resp
    }));
    const options = {
        countries: select.countries,
        categories: select.categories
    }
    const callbacks = {
        onChange: useCallback((name, e) => store.form.setData(name, e), [store]),
        putForm: useCallback((_id) => store.form.putForm(_id), [store]),
    }

    return (
        <Layout head={<h1>{select.article.title}</h1>}>

            <Header/>

            <Spinner active={select.waiting}>
                {select.data && <ArticleRefactor
                    id={params.id}
                    options={options}
                    onChange={callbacks.onChange}
                    categories={select.categories}
                    article={select.data}
                    putForm={callbacks.putForm}
                />}
            </Spinner>
            {select.error && <div style={{color: 'red'}}>{JSON.stringify(select.error)}</div>}
        </Layout>
    );
}

export default React.memo(ArticleForm);
