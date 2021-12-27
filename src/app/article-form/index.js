import React, {useCallback} from "react";
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
        await store.catalog.getCategories();
        await store.get('form').load(params.id);
        await store.get('article').load(params.id)
    }, [params.id]);
    const select = useSelector(state => ({
        countries: state.form.countries,
        data: state.form.data,
        article: state.article.data,
        waiting: state.form.waiting,
        resp: state.form.resp,
        categories: state.catalog.categories,
    }));
    const options = {
        countries: select.countries,
        categories: select.categories
    };
    const callbacks = {
        onChange: useCallback((name, e) => store.form.setData(name, e), [store]),
        putForm: useCallback((_id) => store.form.putForm(_id), [store]),
    };

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
            {/*тут должно быть сообщение об ошибке полученное от сервера*/}
            {select.resp && <div style={{color: 'red', paddingLeft: '40px'}}>
                <h1>Error</h1>
                <div>
                    <p>КОД:{select.resp.id}</p>
                    <p>Тип:{select.resp.message === 'Incorrect data'? ' ' + 'Некорректный ввод' : select.resp.message}</p>
                    {/*<p>Правило:{JSON.stringify(select.resp.data.issues)}</p>*/}
                    {select.resp.data.issues && select.resp.data.issues.map((item, index) => (
                        <div key={index}><p>{
                            item.path === "title.'ru'" ? 'Название' :
                                item.path === "price" ? 'Цена' :
                                    item.path === "edition" ? 'Год выпуска' : item.path}{':'+' '+item.message}</p></div>
                    ))}
                </div>
            </div>}

        </Layout>
    );
}

export default React.memo(ArticleForm);
