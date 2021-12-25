import StoreModule from "../module";


class CategoriesStore extends StoreModule {

    /**
     * Начальное состояние
     */
    initState() {
        return {
            categories: []
        };
    }


    convert = (data) => {
        // создаем ассоциативный массив с ключами айдишниками и добавляем к элементу поле children
        let mapList = {}
        data.forEach(item => mapList[item._id] = { ...item, children: [] })
        // console.log(mapList)

        // собираем дерево
        let tree = []
        Object.values(mapList).forEach(item => {
            if (!item.parent) {
                tree.push(item)
            } else {
                mapList[item.parent._id].children.push(item)
            }
        })

        // обходим дерево рекурсивно и отбираем данные с форматированным title
        const treeToFlatList = (tree, level = 0) => {
            let result = []
            tree.forEach(treeItem => {
                let { children, ...item } = treeItem
                item.title = '-'.repeat(level) + item.title
                result.push(item)
                result = result.concat(treeToFlatList(children, level + 1))
            })
            return result
        }

        return treeToFlatList(tree)
    }



    async getCategories() {

        const response = await fetch(`api/v1/categories?limit=*&fields=_id,parent,title`);
        const json = await response.json();

        this.setState({
            categories: this.convert(json.result.items),
        });
    }
}
export default CategoriesStore;
