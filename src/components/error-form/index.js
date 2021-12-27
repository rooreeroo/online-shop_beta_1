import React from 'react';

function ErrorForm(props) {

    return (
        <div style={{color: 'red', paddingLeft: '40px'}}>
            <h1>Error</h1>
            <div>
                <p>КОД:{props.resp.id}</p>
                <p>Тип:{props.resp.message === 'Incorrect data'? ' ' + 'Некорректный ввод' : props.resp.message}</p>
                {props.resp.data.issues && props.resp.data.issues.map((item, index) => (
                    <div key={index}><p>{
                        item.path === "title.'ru'" ? 'Название' :
                            item.path === "price" ? 'Цена' :
                                item.path === "edition" ? 'Год выпуска' : item.path}{':'+' '+item.message}</p></div>
                ))}
            </div>
        </div>
    );
}

export default React.memo(ErrorForm);
