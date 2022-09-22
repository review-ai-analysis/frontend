import React from "react";
import axios from 'axios';
import CircleProgress from '../../components/CircleProgress/'
import Widget from "../../components/Widget";
import s from './Reviews.module.scss';
import {Dropdown} from "@nextui-org/react";
import {Button, Grid} from "@nextui-org/react";

let banks, sources;
let headers = {'Access-Control-Allow-Origin': '*'}
let url = "https://reviews-ai.ru/api/v1/"
let state;

class Reviews extends React.Component {

    constructor(props) {
        super(props);
        this.state = {response: [], limit: 0, offset: 0, categories: [], filters: {}, banks_dropdown_list: []};
        this.checkPosition = this.checkPosition.bind(this);
        this.categories_dropdown = this.categories_dropdown.bind(this);
        this.rating_dropdown = this.rating_dropdown.bind(this);
        this.banks_dropdown = this.banks_dropdown.bind(this);
        this.sources_dropdown = this.sources_dropdown.bind(this);
        this.delete_filter = this.delete_filter.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.generateFilters = this.generateFilters.bind(this);
    }

    throttle(callee, timeout) {
        let timer = null
        return function perform(...args) {
            if (timer) return
            timer = setTimeout(() => {
                callee(...args)
                clearTimeout(timer)
                timer = null
            }, timeout)
        }
    }

    checkPosition() {
        // Высота документа и высота экрана:
        const height = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        const screenHeight = window.innerHeight
        // Отслеживаем, где находится низ экрана относительно страницы:
        const position = window.scrollY + screenHeight
        if (position >= height - screenHeight / 4) {
            let headers = {
                'Access-Control-Allow-Origin': '*'
            }
            let concated = this.getReviews(this.state.limit, this.state.limit + 50, this.generateFilters(), false)
            concated.then(res => {
                    let result = this.state.response.concat(res.data.response)
                    this.setState({response: result});
                }
            )
        }
    }

    showAll(event, body, item) {
        let pItem = document.getElementsByClassName(`item${item}`)[0];
        pItem.innerHTML = `<p>${body.review}</p>`;
    };

    getReviews(offset, limit, filters, save) {
        let axios_response = axios({
            method: "get", url: `${url}getreviews/?offset=${offset}&limit=${limit}&${filters}`, headers: headers,
        })

        if (!save) {
            return axios_response
        }

        axios_response.then(res => {
            if (save === false) {
                return res.data.response
            } else {
                this.setState({response: res.data.response, limit: limit + 50});
            }
        })
    }

    componentDidMount() {
        banks = {
            'gpb': 'Газпромбанк',
            'alfa': 'Альфа-Банк',
            'pochtabank': 'Почта Банк',
            'raif': 'Райффайзенбанк',
            'sberbank': 'СберБанк',
            'tinkoff': 'Тинькофф',
            'vtb': 'ВТБ'
        };

        sources = {
            'otzovik': 'Отзовик',
            'i_recomend': 'IRecommend.ru',
            'playmarket': 'Google PlayMarket',
            'banki_ru': 'Banki.ru'
        };

        this.setState({
            banks_dropdown_list: [
                {name: 'Газпромбанк', key: "gpb"},
                {name: 'Альфа-Банк', key: "alfa"},
                {name: 'Почта Банк', key: "pochtabank"},
                {name: 'Райффайзенбанк', key: "raif"},
                {name: 'СберБанк', key: "sberbank"},
                {name: 'Тинькофф', key: "tinkoff"},
                {name: 'ВТБ', key: "vtb"},
            ],
            sources_dropdown_list: [
                {name: 'Отзовик', key: "otzovik"},
                {name: 'IRecommend.ru', key: "i_recomend"},
                {name: 'Google PlayMarket', key: "playmarket"},
                {name: 'Banki.ru', key: "banki_ru"},
                {name: 'Google Maps', key: "google_maps"},
                {name: 'Yandex Maps', key: "yandex_maps"}
            ]
        })
        this.getReviews(0, 50, "", true)
        axios({
            method: "get",
            url: `${url}getcategories/`,
            headers: headers
        }).then(res => {
            res["data"]["response"].forEach((value, index) => {

                if (value === null) {
                    this.state.categories.push({name: "Без категории", key: value})
                    return;
                }
                this.state.categories.push({name: value, key: value})
            })
        })
        window.addEventListener("scroll", this.throttle(this.checkPosition, 250))
    }

    componentDidUpdate() {
        let standartText, classPercentage;

        try {
            standartText = document.getElementsByClassName(`${s.percentage}`)
            classPercentage = s.percentage;

        } catch {
            return;
        }

        CircleProgress(`.${s.counter}`, standartText, classPercentage, this.state.offset);
    }

    generateFilters() {
        let string_filters = ""
        Object.keys(this.state.filters).map((key, item) => {
            if (key === "rating") {
                string_filters += `${key}=${this.state.filters[key] / 5}&`
                return;
            }

            string_filters += `${key}=${this.state.filters[key]}&`
        })
        return string_filters
    }

    categories_dropdown(element) {
        this.state.filters["category_name"] = element
        state = this.state.filters
        this.setState({filters: state})
        let limit = this.state.limit
        this.getReviews(0, 50, this.generateFilters(), true)
        window.scrollTo(0, 0)
    }

    rating_dropdown(element) {
        this.state.filters["rating"] = element
        state = this.state.filters
        this.setState({filters: state})
        let limit = this.state.limit
        this.getReviews(0, 50, this.generateFilters(), true)
        window.scrollTo(0, 0)
    }

    banks_dropdown(element) {
        this.state.filters["bank"] = element
        state = this.state.filters
        this.setState({filters: state})
        let limit = this.state.limit
        this.getReviews(0, 50, this.generateFilters(), true)
        window.scrollTo(0, 0)
    }

    sources_dropdown(element) {
        this.state.filters["source"] = element
        state = this.state.filters
        this.setState({filters: state})
        let limit = this.state.limit
        this.getReviews(0, 50, this.generateFilters(), true)
        window.scrollTo(0, 0)
    }

    delete_filter(element) {
        Object.keys(this.state.filters).forEach((value, index) => {
            if (this.state.filters[value] === element["target"].children[0].textContent || this.state.filters[value] === "null") {
                delete this.state.filters[value]
                state = this.state.filters
            }
        });

        this.setState({filters: state})
        let limit = this.state.limit
        this.getReviews(0, 50, this.generateFilters(), true)

    }

    render() {
        let filters = <div>
            <div className={s.buttons}>
                <Dropdown>
                    <Dropdown.Button css={{marginBottom: "12px", margin: 0, backgroundColor: "#11132d"}} flat
                                     color="default">Категории</Dropdown.Button>
                    <Dropdown.Menu aria-label="Dynamic Actions" items={this.state.categories}
                                   onAction={this.categories_dropdown}>
                        {(item) => (
                            <Dropdown.Item key={item.key} color="default">{item.name}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Button css={{marginBottom: "12px", marginLeft: "12px", backgroundColor: "#11132d"}}
                                     flat color="default">Рейтинг</Dropdown.Button>
                    <Dropdown.Menu aria-label="Dynamic Actions"
                                   items={[{name: "5", key: "5"}, {name: "4", key: "4"}, {
                                       name: "3", key: "3"
                                   }, {name: "2", key: "2"}, {name: "1", key: "1"}]}
                                   onAction={this.rating_dropdown}>
                        {(item) => (
                            <Dropdown.Item key={item.key} color="default">{item.name}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Button css={{marginBottom: "12px", marginLeft: "12px", backgroundColor: "#11132d"}}
                                     flat
                                     color="default">Банки</Dropdown.Button>
                    <Dropdown.Menu aria-label="Dynamic Actions"
                                   items={this.state.banks_dropdown_list}
                                   onAction={this.banks_dropdown}>
                        {(item) => (
                            <Dropdown.Item key={item.key} color="default">{item.name}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Button css={{marginBottom: "12px", marginLeft: "12px", backgroundColor: "#11132d"}}
                                     flat
                                     color="default">Источники</Dropdown.Button>
                    <Dropdown.Menu aria-label="Dynamic Actions"
                                   items={this.state.sources_dropdown_list}
                                   onAction={this.sources_dropdown}>
                        {(item) => (
                            <Dropdown.Item key={item.key} color="default">{item.name}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Grid.Container gap={2}>
                {Object.keys(this.state.filters).map((body, item) =>
                    <Grid key={item}>
                        <Button key={item} auto
                                onPress={this.delete_filter}>{this.state.filters[body] === "null" ? "Без категории" : this.state.filters[body]}</Button>
                    </Grid>
                )}
            </Grid.Container>
        </div>
        if (Object.keys(this.state.response).length === 0) {
            return (<div>
                <h1 className="page-title">
                    Отзывы
                </h1>
                {filters}
                <a>Отзывы не найдены!</a>
            </div>);
        }

        return (
            <div className={s.widgetClass}>
                <h1 className={s.pageTitle}>Отзывы</h1>
                {filters}
                {this.state.response.map((body, item) =>
                    <Widget key={item} className={s.widgetElem}>
                        <div className={s.review}>
                            <div className={s.text}>
                                <h4>{body.username}
                                    {body.url && <a href={body.url} target="_blank"> (источник)</a>}
                                    <span
                                        className={s.date}>{body.publication_date.split('T')[0].split('-').reverse().join('.')}</span>
                                </h4>
                                {body.review.length < 450
                                    ? <p>{body.review}</p>
                                    : <p className={`item${item}`}>{body.review.slice(0, 450)}...<br></br><a
                                        className={s.showFullReview} onClick={(e) => {
                                        this.showAll(e, body, item);
                                    }}> Показать полностью</a></p>
                                }
                            </div>
                            <div className={s.data}>
                                {body.rating !== -1 &&
                                    <div className={s.rating}>
                                        <h5 className={s.descriptionAnalysis}>Оценка отзыва</h5>
                                        <div className={s.counter} data-cp-percentage={body.rating * 5}></div>
                                    </div>
                                }
                                <div className={s.categories}>
                                    <h5 className={s.descriptionAnalysis}>Другие характеристики</h5>
                                    <div className={s.categoriesElem}>Адрес: {body.address}</div>
                                    <div className={s.categoriesElem}>Банк: {banks[body.bank]}</div>
                                    {body.category_name
                                        ? <div className={s.categoriesElem}>Категория: {body.category_name}</div>
                                        : <div className={s.categoriesElem}>Категория: не указана</div>
                                    }
                                    <div className={s.categoriesElem}>Ресурс: {sources[body.source]}</div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                )}
            </div>
        );
    }
}

export default Reviews;
