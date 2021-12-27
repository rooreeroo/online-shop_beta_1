import StoreModule from "../module";


class CategoriesStore extends StoreModule {

    /**
     * Начальное состояние
     */
    initState() {
        return {
            categories: null,
            waiting: true
        };
    }

    convert = (data) => {
        // создаем ассоциативный массив с ключами айдишниками и добавляем к элементу поле children
        let mapList = {}
        data.forEach(item => mapList[item._id] = {...item, children: []})
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
                let {children, ...item} = treeItem
                item.title = '-'.repeat(level) + item.title
                result.push(item)
                result = result.concat(treeToFlatList(children, level + 1))
            })
            return result
        }

        return treeToFlatList(tree)
    }
    // getFullTree = (rootArray) => {
    //     const getTree = (array, parent = null, inner = 0) => {
    //         return array.reduce((arr, elem) => {
    //             if (elem.parent && elem.parent._id !== parent) {
    //                 return arr;
    //             }
    //
    //             arr.push({
    //                 ...elem,
    //                 title: `${'-'.repeat(inner)}${elem.title}`,
    //             });
    //
    //             const children = rootArray.filter((item) => item.parent && item.parent._id === elem._id);
    //             if(!children) {
    //                 return arr;
    //             }
    //             const childArr = getTree(children, elem._id, inner + 1);
    //             return arr.concat(childArr);
    //         }, []);
    //     }
    //     return getTree(rootArray);
    // }


    async getCategories() {
        try {
            const response = await fetch(`api/v1/categories?limit=*&fields=_id,parent,title`);
            const json = await response.json();

            this.setState({
                ...this.getState(),
                categories: this.convert(json.result.items), // две функции на выбор convert || getFullTree обе работают, но различными способами
                waiting: false
            });
        } catch (e) {
            this.updateState({
                categories: null,
                waiting: false
            });
        }

    }
}
export default CategoriesStore;